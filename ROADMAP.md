# Roadmap

## Phase 0: Format

- Define the `wordline.json` file format
- Define event types for notes, tabs, files, screenshots, decisions, questions, checkpoints, and agent actions
- Create example wordline folders
- Document export/import expectations

## Phase 1: Local CLI

- [x] `wordlines init`
- [x] `wordlines add-note`
- [x] `wordlines add-link`
- [x] `wordlines add-file`
- [x] `wordlines add-screenshot`
- [x] `wordlines checkpoint`
- [x] `wordlines export`
- [x] `wordlines summary`
- [x] `wordlines status`
- [ ] `wordlines fork`
- [ ] `wordlines pause`
- [ ] `wordlines complete`
- [ ] `wordlines handoff`

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
