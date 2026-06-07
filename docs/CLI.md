# CLI

The CLI stores every wordline as a normal folder on disk. Commands use `--wordline <folder>` when you want to be explicit. If omitted, the CLI first checks whether the current directory is a wordline, then checks whether the current directory contains exactly one `.wordline` folder.

## Create

```bash
wordlines init "Appeal medical bill" --intent "Contest a surprise invoice"
```

Creates:

```text
appeal-medical-bill.wordline/
  wordline.json
  timeline.md
  tabs.json
  files/
  screenshots/
  notes/
  agent-runs/
  artifacts/
```

Use `--path` to choose a folder:

```bash
wordlines init "Launch page" --intent "Ship a new landing page" --path launch.wordline
```

## Add Notes

```bash
wordlines add-note "Called support. Appeals take 10 business days." --title "Support call"
```

## Add Links

```bash
wordlines add-link https://example.com/billing-policy --title "Billing policy"
```

## Add Files

By default, files are copied into the wordline so the capsule remains portable.

```bash
wordlines add-file ./invoice.pdf --title "Original invoice"
```

Use `--reference` if you only want to record the source path and hash:

```bash
wordlines add-file ./large-video.mov --reference
```

## Add Screenshots

```bash
wordlines add-screenshot ./evidence.png --title "Payment portal error"
```

Screenshots are copied into `screenshots/`.

## Checkpoints

```bash
wordlines checkpoint "Ready to draft appeal" --summary "Evidence collected."
```

Checkpoints create both a structured checkpoint entry and a timeline event.

## Summary

```bash
wordlines summary
```

Prints a compact Markdown summary.

## Export

```bash
wordlines export --out appeal-export.wordline
```

Export currently copies the wordline folder to a new folder. Zip export is planned later.

