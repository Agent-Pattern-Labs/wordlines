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

The first useful version should be small:

1. Start a wordline with a name and intent.
2. Capture selected browser tabs, files, screenshots, notes, and links.
3. Append timestamped decisions and open questions.
4. Save checkpoints.
5. Export the wordline as a folder or zip.
6. Resume from a checkpoint with the right context in front of you.

## Non-goals

- Not a 24/7 surveillance system
- Not a generic AI desktop agent
- Not a replacement for notes, task managers, or project management tools
- Not a cloud account or sync service
- Not an automation tool that acts without explicit user authority

## Repository status

This repository is currently a concept/spec seed. The next step is to define the file format, local capture model, and smallest usable desktop/browser prototype.

