import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = mkdtempSync(path.join(tmpdir(), "wordlines-smoke-"));
const cli = path.resolve("dist/cli.js");

function run(args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8"
  });
}

run(["init", "Appeal medical bill", "--intent", "Contest a surprise invoice"]);
run(["add-link", "https://example.com/billing-policy", "--title", "Billing policy"]);
run(["add-note", "Called support. Appeals take 10 business days.", "--title", "Support call"]);

const invoice = path.join(root, "invoice.txt");
writeFileSync(invoice, "invoice total: 412.18\n", "utf8");
run(["add-file", invoice, "--title", "Original invoice"]);
run(["checkpoint", "Ready to draft appeal", "--summary", "Evidence collected."]);

const summary = run(["summary"]);
assert.match(summary, /Appeal medical bill/);
assert.match(summary, /Events: 4/);
assert.match(summary, /Checkpoints: 1/);

const wordlinePath = path.join(root, "appeal-medical-bill.wordline", "wordline.json");
const wordline = JSON.parse(readFileSync(wordlinePath, "utf8"));
assert.equal(wordline.events.length, 4);
assert.equal(wordline.checkpoints.length, 1);
assert.equal(wordline.events.some((event) => event.type === "file" && event.stored_path), true);

run(["export", "--out", "exported.wordline"]);
const exported = JSON.parse(readFileSync(path.join(root, "exported.wordline", "wordline.json"), "utf8"));
assert.equal(exported.id, wordline.id);

console.log("smoke test passed");

