# wordlines

Purpose-scoped timelines for human and AI work.

`wordlines` is an open-source local-first project for preserving the full state of a task across apps: browser tabs, files, screenshots, notes, clipboard snippets, decisions, questions, agent actions, and produced artifacts.

The core idea is simple: modern work does not live in one app. It lives across windows, tabs, documents, chats, downloads, screenshots, and half-finished drafts. A wordline gives that scattered work one portable shape.

## Why this exists

Screen recorders and desktop-memory tools answer:

> What happened on my computer?

`wordlines` answers:

> What belongs to this one purpose, and how do I pause, resume, fork, hand off, or archive it?

In the agent era, this matters because agents should not need your entire life history. They need the right task world, with the right context, evidence, constraints, and current state.

## What is a wordline?

A wordline is a local task capsule with:

- An active intent, such as "appeal this bill" or "ship the launch page"
- A timeline of relevant events
- Browser tabs and source links
- Files and folders touched
- Screenshots and visual evidence
- Clipboard snippets intentionally saved
- Notes, decisions, assumptions, and open questions
- Agent runs, prompts, tool calls, and outputs
- Artifacts produced during the task
- Checkpoints that can be resumed or forked

## Example use cases

- Resume a complex task after days away
- Hand a messy life admin problem to another person or agent
- Preserve evidence for an appeal, claim, dispute, or application
- Separate task context from raw 24/7 screen history
- Fork a task into alternate strategies
- Archive completed work with its sources and decisions intact

## Principles

- Local-first by default
- Intent-first, not surveillance-first
- Human-readable exports
- Portable folders over opaque cloud databases
- Explicit capture over ambient hoarding
- Agent-compatible, not agent-dependent
- Every automated action should be traceable to a task and checkpoint

## MVP shape

The current MVP is a local CLI:

```bash
npm install
npm run build
node dist/cli.js init "Appeal medical bill" --intent "Contest a surprise invoice"
node dist/cli.js add-link https://example.com/billing-policy --title "Billing policy"
node dist/cli.js add-note "Called support. Appeals take 10 business days."
node dist/cli.js add-file ./invoice.pdf --title "Original invoice"
node dist/cli.js checkpoint "Ready to draft appeal" --summary "Evidence collected."
node dist/cli.js summary
```

After building locally, you can also link the command:

```bash
npm link
wordlines --help
```

Once published, install the CLI with:

```bash
npm install -g @agent-pattern-labs/wordlines
```

## CLI commands

- `wordlines init <title> --intent <intent> [--path <folder>]`
- `wordlines add-note <text> [--title <title>] [--wordline <folder>]`
- `wordlines add-link <url> [--title <title>] [--wordline <folder>]`
- `wordlines add-file <path> [--title <title>] [--reference] [--wordline <folder>]`
- `wordlines add-screenshot <path> [--title <title>] [--reference] [--wordline <folder>]`
- `wordlines checkpoint <title> [--summary <text>] [--wordline <folder>]`
- `wordlines summary [--wordline <folder>]`
- `wordlines status [--wordline <folder>]`
- `wordlines export --out <folder> [--wordline <folder>]`

See [docs/CLI.md](docs/CLI.md) for details.

## Publishing

Publishing is handled by GitHub Actions in `.github/workflows/npm-publish.yml`.

To publish from GitHub:

1. Configure npm Trusted Publishing for `@agent-pattern-labs/wordlines`, or add an npm automation token as the repository secret `NPM_TOKEN`.
2. Bump `version` in `package.json`.
3. Create and publish a GitHub release.

The workflow runs `npm ci`, `npm test`, and then publishes the scoped public package.

You can also run the workflow manually with `dry_run` enabled to verify the package without publishing.

## Non-goals

- Not a 24/7 surveillance system
- Not a generic AI desktop agent
- Not a replacement for notes, task managers, or project management tools
- Not a cloud account or sync service
- Not an automation tool that acts without explicit user authority

## Repository status

This repository now has a working CLI MVP. The next major step is browser capture for selected tabs and sources.
