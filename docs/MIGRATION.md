# Migration Guide: v1 → v2

## Quick reference

| v1 (legacy) | v2 (current) |
|-------------|--------------|
| Root JSON **array** | Root JSON **object** |
| Entries only | `entries[]` + `neuralCore`, `contact`, `social`, `resume`, `assistant`, `terminal`, `applications` |
| No `schemaVersion` | `"schemaVersion": "2.0.0"` |

## Commands

```bash
# Generate docs/schema/portfolio_data.v2.example.json (safe, no overwrite)
npm run migrate:portfolio

# Backup v1 array → portfolio_data.v1.backup.json, write v2 to root + public
npm run migrate:portfolio:write

# After editing root JSON
npm run sync:portfolio
```

## Runtime behavior (no file migration required)

The app loader accepts **both** formats:

1. **Array** → auto-migrates in memory via `migrateV1ToV2()`
2. **v2 object** → validates with `parsePortfolioDocument()`

Existing `project`, `experience`, `skill`, `achievement`, and `education` objects are never reshaped—only wrapped.

## Authoring checklist

After migration, replace placeholders:

- [ ] `neuralCore.profile.name`, `location`, `bio`
- [ ] `contact.email`
- [ ] `social[].url` and handles
- [ ] `resume.file.url`
- [ ] `neuralCore.currentFocus.items`
- [ ] Optional: customize `terminal.commands` and `assistant.suggestedPrompts`

## Rollback

```bash
cp portfolio_data.v1.backup.json portfolio_data.json
npm run sync:portfolio
```

The v1 array remains fully supported by the loader.
