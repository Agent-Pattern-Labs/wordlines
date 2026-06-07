# Publishing

The npm package is published by GitHub Actions.

## Package Name

The package is published as:

```text
@agent-pattern-labs/wordlines
```

## Authentication

Use one of these options.

### Option A: Trusted Publishing

Configure npm Trusted Publishing for:

```text
Package: @agent-pattern-labs/wordlines
GitHub organization: Agent-Pattern-Labs
GitHub repository: wordlines
Workflow filename: npm-publish.yml
Allowed action: npm publish
```

This uses GitHub Actions OIDC and does not require a long-lived publish token.

### Option B: npm Token

Add this repository secret in GitHub:

```text
NPM_TOKEN
```

Use an npm automation token with permission to publish `@agent-pattern-labs/wordlines`.

## Release Flow

1. Update the `version` field in `package.json`.
2. Commit and push the change.
3. Create a GitHub release for the same version.
4. Publishing the release triggers `.github/workflows/npm-publish.yml`.

The workflow:

1. Checks out the repo.
2. Installs dependencies with `npm ci`.
3. Runs `npm test`.
4. Publishes with either `NPM_TOKEN` or Trusted Publishing:

```bash
npm publish --access public
```

## Manual Dry Run

Use the `Publish npm package` workflow from the GitHub Actions tab and leave `dry_run` enabled. This runs:

```bash
npm publish --dry-run --access public
```

## Manual Publish

You can also manually run the workflow with `dry_run` disabled. This publishes the current branch state, so release-based publishing is preferred for normal package releases.
