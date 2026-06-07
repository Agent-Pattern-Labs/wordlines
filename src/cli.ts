#!/usr/bin/env node
import process from "node:process";
import {
  WordlinesError,
  addCheckpoint,
  addEvent,
  addStoredFileEvent,
  createWordline,
  exportWordline,
  readWordline,
  resolveWordlineRoot,
  summarize
} from "./wordline.js";

interface ParsedArgs {
  command?: string;
  positional: string[];
  flags: Map<string, string | boolean>;
}

const help = `wordlines

Purpose-scoped timelines for human and AI work.

Usage:
  wordlines init <title> --intent <intent> [--path <folder>]
  wordlines add-note <text> [--title <title>] [--wordline <folder>]
  wordlines add-link <url> [--title <title>] [--wordline <folder>]
  wordlines add-file <path> [--title <title>] [--reference] [--wordline <folder>]
  wordlines add-screenshot <path> [--title <title>] [--reference] [--wordline <folder>]
  wordlines checkpoint <title> [--summary <text>] [--wordline <folder>]
  wordlines summary [--wordline <folder>]
  wordlines status [--wordline <folder>]
  wordlines export --out <folder> [--wordline <folder>]

Examples:
  wordlines init "Appeal medical bill" --intent "Contest a surprise invoice"
  wordlines add-link https://example.com/billing-policy --title "Billing policy"
  wordlines add-note "Called support. They said appeals take 10 business days."
  wordlines checkpoint "Ready to draft appeal" --summary "Evidence collected."
`;

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.command || args.command === "--help" || args.command === "-h" || args.command === "help") {
    console.log(help);
    return;
  }

  if (args.command === "--version" || args.command === "-v") {
    console.log("0.1.0");
    return;
  }

  switch (args.command) {
    case "init":
      await commandInit(args);
      return;
    case "add-note":
      await withRoot(args, async (root) => {
        const body = requiredJoined(args, "text");
        const event = await addEvent(root, {
          type: "note",
          title: optionalString(args, "title"),
          body
        });
        console.log(`Added note ${event.id}`);
      });
      return;
    case "add-link":
      await withRoot(args, async (root) => {
        const url = requiredPositional(args, 0, "url");
        const event = await addEvent(root, {
          type: "link",
          title: optionalString(args, "title") ?? url,
          url
        });
        console.log(`Added link ${event.id}`);
      });
      return;
    case "add-file":
      await commandStoredFile(args, "file");
      return;
    case "add-screenshot":
      await commandStoredFile(args, "screenshot");
      return;
    case "checkpoint":
      await withRoot(args, async (root) => {
        const title = requiredJoined(args, "title");
        const checkpoint = await addCheckpoint(root, title, optionalString(args, "summary"));
        console.log(`Created checkpoint ${checkpoint.id}`);
      });
      return;
    case "summary":
      await withRoot(args, async (root) => {
        console.log(summarize(await readWordline(root)));
      });
      return;
    case "status":
      await withRoot(args, async (root) => {
        const wordline = await readWordline(root);
        console.log(`${wordline.title} (${wordline.status})`);
        console.log(`Intent: ${wordline.intent}`);
        console.log(`Events: ${wordline.events.length}`);
        console.log(`Checkpoints: ${wordline.checkpoints.length}`);
        console.log(`Root: ${root}`);
      });
      return;
    case "export":
      await withRoot(args, async (root) => {
        const out = requiredFlag(args, "out");
        const exported = await exportWordline(root, out);
        console.log(`Exported to ${exported}`);
      });
      return;
    default:
      throw new WordlinesError(`Unknown command: ${args.command}`);
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const positional: string[] = [];
  const flags = new Map<string, string | boolean>();

  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index];
    if (value.startsWith("--")) {
      const key = value.slice(2);
      const next = rest[index + 1];
      if (!next || next.startsWith("--")) {
        flags.set(key, true);
      } else {
        flags.set(key, next);
        index += 1;
      }
    } else {
      positional.push(value);
    }
  }

  return { command, positional, flags };
}

async function commandInit(args: ParsedArgs): Promise<void> {
  const title = requiredJoined(args, "title");
  const intent = requiredFlag(args, "intent");
  const targetPath = optionalString(args, "path");
  const created = await createWordline({ title, intent, targetPath });
  console.log(`Created ${created.root}`);
}

async function commandStoredFile(args: ParsedArgs, type: "file" | "screenshot"): Promise<void> {
  await withRoot(args, async (root) => {
    const filePath = requiredPositional(args, 0, "path");
    const event = await addStoredFileEvent({
      root,
      type,
      sourcePath: filePath,
      title: optionalString(args, "title"),
      copyMode: !args.flags.has("reference")
    });
    console.log(`Added ${type} ${event.id}`);
  });
}

async function withRoot(args: ParsedArgs, fn: (root: string) => Promise<void>): Promise<void> {
  const root = await resolveWordlineRoot(optionalString(args, "wordline"));
  await fn(root);
}

function requiredJoined(args: ParsedArgs, label: string): string {
  const value = args.positional.join(" ").trim();
  if (!value) {
    throw new WordlinesError(`Missing ${label}.`);
  }
  return value;
}

function requiredPositional(args: ParsedArgs, index: number, label: string): string {
  const value = args.positional[index];
  if (!value) {
    throw new WordlinesError(`Missing ${label}.`);
  }
  return value;
}

function requiredFlag(args: ParsedArgs, key: string): string {
  const value = optionalString(args, key);
  if (!value) {
    throw new WordlinesError(`Missing --${key}.`);
  }
  return value;
}

function optionalString(args: ParsedArgs, key: string): string | undefined {
  const value = args.flags.get(key);
  return typeof value === "string" ? value : undefined;
}

main().catch((error: unknown) => {
  if (error instanceof WordlinesError) {
    console.error(`wordlines: ${error.message}`);
    process.exit(1);
  }
  console.error(error);
  process.exit(1);
});

