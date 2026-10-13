# Update system

## How it works (Android)

```
Settings → [Check for updates]
   │  GET https://api.github.com/repos/{owner}/{repo}/releases/latest
   ▼
tag_name (v0.2.0) vs installed nativeApplicationVersion (0.1.0)   → semver compare
   │ newer
   ▼
Shows: current → latest, release notes (release body), [Download & install]
   ▼
expo-file-system downloads the .apk asset to the cache (progress shown)
   ▼
expo-intent-launcher opens ACTION_VIEW on a content:// URI (FileProvider)
   ▼
Android's package installer asks you to confirm.  ← we never bypass this
```

Files: `app/src/services/updates/index.ts` (+ `version.ts`), UI in `app/src/app/settings.tsx`.

## Android constraints (respected, not bypassed)

- "Install unknown apps" must be allowed for this app the first time (manifest has `REQUEST_INSTALL_PACKAGES`). Android shows the prompt.
- The new APK must be signed with the **same key** and have a **higher `versionCode`**, or the installer refuses. Hence the stable keystore (RELEASE.md).
- No silent installs are possible without device-owner/root, and we do not attempt them.
- Release notes come from the GitHub Release body = **changelog**; also kept in `CHANGELOG.md`.

## Notification of a new version

Since 0.5.2 Home also has a **Check for updates** button and, when a newer version exists, an **Update now** card (`features/UpdateCard.tsx`). Since 0.3.0 the app checks automatically **at most once per 24 h** at startup (silent on failure; can be disabled in Settings) and shows a banner on Home when a newer version exists. The default repository is `Drabo2019/my-english-coach`. The result is cached in the `kv` table (`updateCheck`) and re-evaluated against the installed version, so the banner disappears right after you update. GitHub's unauthenticated limit is 60 req/h per IP, far above one call a day.

## Data migration between versions

- SQLite schema: ordered `MIGRATIONS[]`, `PRAGMA user_version`, each in a transaction. A failed migration leaves the DB at the previous version and the app shows an error rather than corrupting data.
- Content ids are stable (see ARCHITECTURE.md). SRS/mistake rows reference ids; removing an id only orphans a card (it is skipped silently).
- `kv` JSON (profile/settings) is merged over defaults at read time (`{ ...DEFAULT, ...stored }`) so adding new settings never breaks old data.
- Rule for every release: install the new APK **over** the old one on a phone that already has data and verify progress is intact before tagging.

## Not chosen

- **Expo Updates / EAS Update** (OTA JS patches): great for hot-fixes but depends on EAS; JS-only. Revisit if native updates become rare and a hosted channel is acceptable.
- **Play Store**: possible later (needs a Google developer account, AAB); not needed for personal use.
