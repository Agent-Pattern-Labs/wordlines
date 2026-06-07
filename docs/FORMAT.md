# Wordline Format

The canonical export is a folder:

```text
my-task.wordline/
  wordline.json
  timeline.md
  tabs.json
  files/
  screenshots/
  notes/
  agent-runs/
  artifacts/
```

## `wordline.json`

`wordline.json` is the machine-readable index for the task capsule.

Minimum fields:

- `id`
- `title`
- `intent`
- `created_at`
- `updated_at`
- `status`
- `events`
- `checkpoints`

## Event Types

Initial event types:

- `note`
- `link`
- `file`
- `screenshot`
- `decision`
- `question`
- `checkpoint`
- `agent_run`
- `artifact`

## Design Constraints

- The folder should remain useful without the app.
- Markdown and JSON are preferred over custom binary formats.
- Events should reference local artifacts by relative path.
- Sensitive data should be explicit and removable.
- Agent traces should be optional, not required.

