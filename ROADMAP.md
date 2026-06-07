# Roadmap

## Phase 0: Format

- Define the `wordline.json` file format
- Define event types for notes, tabs, files, screenshots, decisions, questions, checkpoints, and agent actions
- Create example wordline folders
- Document export/import expectations

## Phase 1: Local CLI

- `wordlines init`
- `wordlines add-note`
- `wordlines add-link`
- `wordlines add-file`
- `wordlines checkpoint`
- `wordlines export`
- `wordlines summary`

## Phase 2: Browser Capture

- Capture selected tabs into the active wordline
- Save page title, URL, timestamp, and optional user note
- Restore saved tabs from a checkpoint
- Export tabs as Markdown for human or agent handoff

## Phase 3: Desktop Capture

- Add screenshot capture
- Track selected files/folders
- Track active app/window titles with user consent
- Add quick capture hotkey

## Phase 4: Agent Handoff

- Generate compact handoff packets
- Attach agent runs to a wordline
- Record agent-created artifacts
- Require action receipts for irreversible changes

## Phase 5: Forks And Checkpoints

- Fork a wordline into alternate strategies
- Compare forks
- Archive completed wordlines
- Mark source evidence and final outcomes

