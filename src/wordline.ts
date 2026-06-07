import { createHash, randomUUID } from "node:crypto";
import { cp, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type { EventType, Wordline, WordlineCheckpoint, WordlineEvent } from "./types.js";

const WORDLINE_FILE = "wordline.json";
const TIMELINE_FILE = "timeline.md";
const TABS_FILE = "tabs.json";

export class WordlinesError extends Error {}

export function nowISO(): string {
  return new Date().toISOString();
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "wordline";
}

export async function createWordline(input: {
  title: string;
  intent: string;
  targetPath?: string;
}): Promise<{ root: string; wordline: Wordline }> {
  const root = path.resolve(input.targetPath ?? `${slugify(input.title)}.wordline`);
  const createdAt = nowISO();
  const wordline: Wordline = {
    version: "0.1.0",
    id: `wl_${randomUUID()}`,
    title: input.title,
    intent: input.intent,
    created_at: createdAt,
    updated_at: createdAt,
    status: "active",
    events: [],
    checkpoints: []
  };

  await mkdir(root, { recursive: false });
  await Promise.all([
    mkdir(path.join(root, "files"), { recursive: true }),
    mkdir(path.join(root, "screenshots"), { recursive: true }),
    mkdir(path.join(root, "notes"), { recursive: true }),
    mkdir(path.join(root, "agent-runs"), { recursive: true }),
    mkdir(path.join(root, "artifacts"), { recursive: true })
  ]);
  await writeJson(path.join(root, WORDLINE_FILE), wordline);
  await writeFile(path.join(root, TABS_FILE), "[]\n", "utf8");
  await writeFile(
    path.join(root, TIMELINE_FILE),
    `# ${input.title}\n\nIntent: ${input.intent}\n\nCreated: ${createdAt}\n\n`,
    "utf8"
  );

  return { root, wordline };
}

export async function resolveWordlineRoot(provided?: string): Promise<string> {
  if (provided) {
    const resolved = path.resolve(provided);
    await assertWordlineRoot(resolved);
    return resolved;
  }

  const cwd = process.cwd();
  if (await exists(path.join(cwd, WORDLINE_FILE))) {
    return cwd;
  }

  const entries = await readdir(cwd, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isDirectory() && entry.name.endsWith(".wordline"))
    .map((entry) => path.join(cwd, entry.name));

  const validCandidates: string[] = [];
  for (const candidate of candidates) {
    if (await exists(path.join(candidate, WORDLINE_FILE))) {
      validCandidates.push(candidate);
    }
  }

  if (validCandidates.length === 1) {
    return validCandidates[0];
  }

  if (validCandidates.length > 1) {
    throw new WordlinesError("Multiple wordlines found. Pass --wordline <path>.");
  }

  throw new WordlinesError("No wordline found. Run `wordlines init` first or pass --wordline <path>.");
}

export async function readWordline(root: string): Promise<Wordline> {
  const raw = await readFile(path.join(root, WORDLINE_FILE), "utf8");
  return JSON.parse(raw) as Wordline;
}

export async function writeWordline(root: string, wordline: Wordline): Promise<void> {
  wordline.updated_at = nowISO();
  await writeJson(path.join(root, WORDLINE_FILE), wordline);
}

export async function addEvent(root: string, event: Omit<WordlineEvent, "id" | "created_at">): Promise<WordlineEvent> {
  const wordline = await readWordline(root);
  const fullEvent: WordlineEvent = {
    id: `ev_${randomUUID()}`,
    created_at: nowISO(),
    ...event
  };
  wordline.events.push(fullEvent);
  await writeWordline(root, wordline);
  await appendTimeline(root, fullEvent);
  return fullEvent;
}

export async function addStoredFileEvent(input: {
  root: string;
  type: Extract<EventType, "file" | "screenshot" | "artifact">;
  sourcePath: string;
  title?: string;
  copyMode: boolean;
}): Promise<WordlineEvent> {
  const sourcePath = path.resolve(input.sourcePath);
  const sourceStat = await stat(sourcePath);
  if (!sourceStat.isFile()) {
    throw new WordlinesError(`Not a file: ${sourcePath}`);
  }

  const sha256 = await hashFile(sourcePath);
  const folder = input.type === "screenshot" ? "screenshots" : input.type === "artifact" ? "artifacts" : "files";
  let storedPath: string | undefined;

  if (input.copyMode) {
    const basename = path.basename(sourcePath);
    const targetName = `${Date.now()}-${basename}`;
    const absoluteTarget = path.join(input.root, folder, targetName);
    await cp(sourcePath, absoluteTarget, { force: false });
    storedPath = path.relative(input.root, absoluteTarget);
  }

  return addEvent(input.root, {
    type: input.type,
    title: input.title ?? path.basename(sourcePath),
    source_path: sourcePath,
    stored_path: storedPath,
    path: storedPath,
    sha256,
    size_bytes: sourceStat.size
  });
}

export async function addCheckpoint(root: string, title: string, summary?: string): Promise<WordlineCheckpoint> {
  const wordline = await readWordline(root);
  const checkpoint: WordlineCheckpoint = {
    id: `cp_${randomUUID()}`,
    created_at: nowISO(),
    title,
    summary,
    event_count: wordline.events.length
  };
  wordline.checkpoints.push(checkpoint);
  wordline.events.push({
    id: `ev_${randomUUID()}`,
    type: "checkpoint",
    created_at: checkpoint.created_at,
    title,
    body: summary
  });
  await writeWordline(root, wordline);
  await appendTimeline(root, {
    id: checkpoint.id,
    type: "checkpoint",
    created_at: checkpoint.created_at,
    title,
    body: summary
  });
  return checkpoint;
}

export async function exportWordline(root: string, outputPath: string): Promise<string> {
  const destination = path.resolve(outputPath);
  await cp(root, destination, { recursive: true, force: false, errorOnExist: true });
  return destination;
}

export function summarize(wordline: Wordline): string {
  const counts = new Map<EventType, number>();
  for (const event of wordline.events) {
    counts.set(event.type, (counts.get(event.type) ?? 0) + 1);
  }

  const eventSummary = [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, count]) => `- ${type}: ${count}`)
    .join("\n") || "- No events yet";

  const latest = wordline.events.at(-1);
  const latestLine = latest ? `${latest.type}: ${latest.title ?? latest.body ?? latest.url ?? latest.id}` : "None";

  return [
    `# ${wordline.title}`,
    "",
    `Intent: ${wordline.intent}`,
    `Status: ${wordline.status}`,
    `Created: ${wordline.created_at}`,
    `Updated: ${wordline.updated_at}`,
    `Events: ${wordline.events.length}`,
    `Checkpoints: ${wordline.checkpoints.length}`,
    `Latest: ${latestLine}`,
    "",
    "## Event Counts",
    "",
    eventSummary
  ].join("\n");
}

async function assertWordlineRoot(root: string): Promise<void> {
  if (!(await exists(path.join(root, WORDLINE_FILE)))) {
    throw new WordlinesError(`Not a wordline folder: ${root}`);
  }
}

async function appendTimeline(root: string, event: Pick<WordlineEvent, "id" | "type" | "created_at" | "title" | "body" | "url" | "path" | "stored_path">): Promise<void> {
  const label = event.title ?? event.url ?? event.path ?? event.stored_path ?? event.type;
  const lines = [`## ${event.created_at} - ${event.type}`, "", label];
  if (event.body) {
    lines.push("", event.body);
  }
  if (event.url) {
    lines.push("", event.url);
  }
  if (event.path ?? event.stored_path) {
    lines.push("", `Path: ${event.path ?? event.stored_path}`);
  }
  lines.push("", "");

  const current = await readFile(path.join(root, TIMELINE_FILE), "utf8").catch(() => "");
  await writeFile(path.join(root, TIMELINE_FILE), `${current}${lines.join("\n")}`, "utf8");
}

async function hashFile(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  hash.update(await readFile(filePath));
  return hash.digest("hex");
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}
