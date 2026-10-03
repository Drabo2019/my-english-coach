# Release process

## One-time setup

1. **Keystore** (already generated on this PC): `C:\Users\drabo\.english-coach\release.keystore`, secrets in `C:\Users\drabo\.english-coach\keystore.env`.
   **Back both files up somewhere safe (not in git).** If you lose the key you can never ship an update that installs over the old app: you would have to uninstall (and lose local data).
2. Create a GitHub repository (public is simplest: the in-app updater uses the unauthenticated API). Push this folder.
3. In the repo → Settings → Secrets → Actions, add: `COACH_KEYSTORE_BASE64` (`base64 -w0 release.keystore`), `COACH_KEYSTORE_PASSWORD`, `COACH_KEY_ALIAS` (= `coach`), `COACH_KEY_PASSWORD`.
4. In the app: Settings → *GitHub repository* = `owner/repo`.

## Cut a release

```bash
# 1. bump version in app/app.json  ("version": "0.2.0")  AND increase android.versionCode
# 2. add notes to CHANGELOG.md
git commit -am "Release 0.2.0" && git tag v0.2.0 && git push --follow-tags
```

GitHub Actions (`.github/workflows/release.yml`) runs tests, builds the signed APK and attaches `my-english-coach-0.2.0.apk` to a GitHub Release whose body is the release notes. The app then offers it under Settings → *Check for updates*.

## Build locally

```bash
cd app && ./build-apk.sh        # output: dist/my-english-coach-<version>.apk
```
Requires JDK 17 (Android Studio's JBR is used automatically), the Android SDK, and the keystore env file. `ARCHS=arm64-v8a ./build-apk.sh` builds a smaller single-ABI APK. First build ≈ 25 min (native compile), later ones are incremental.

## Install on the phone

1. Copy the `.apk` to the phone (USB, Drive, `adb install -r dist/….apk`).
2. Open it. Android asks to allow installing from this source → allow once.
3. First launch: allow the **microphone** (and notifications if you want reminders).

## Versioning

`MAJOR.MINOR.PATCH` in `app.json`. `versionCode` must strictly increase for Android to accept an update. Data migrations: append to `MIGRATIONS` in `services/storage/db.ts`; they run automatically at first launch of the new version (see UPDATE_SYSTEM.md).
