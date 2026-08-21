# Native Lab Code Review Guide

This guide applies only to pull requests that change `apps/native-lab` or one of its subdirectories. It is intended for reviewing work produced with Codex, but the same standard applies to every contributor.

The reviewer should first read:

1. `apps/native-lab/AGENTS.md`
2. `apps/native-lab/docs/native-lab.md`
3. The issue or task description for the pull request

`docs/native-lab.md` is the product and learning contract. Review the implementation against that contract, not against an imagined production app. The purpose of this project is to learn where React Native meets the device, so a review should explain the platform behavior behind a recommendation.

## Review boundaries

- Review only files under `apps/native-lab`.
- Do not leave comments on unrelated apps, packages, generated output, or root-level changes unless they directly break `native-lab`.
- Check the PR's issue before judging whether a missing feature belongs in this change. Do not turn every PR into a request to implement the entire learning document.
- Treat unrelated refactors and broad dependency upgrades as review findings when they increase risk or make the learning goal harder to understand.
- Preserve existing user changes. A review should identify problems and propose focused alternatives; it should not silently redesign the app.

## Review goals

Prioritize findings in this order:

1. Data loss, crashes, broken navigation, or a required flow that cannot complete.
2. Permission, file, WebView, deep-link, or other security and platform mistakes.
3. Incorrect assumptions that work on the web but fail on iOS or Android.
4. Missing loading, cancellation, denial, empty, or error states.
5. Accessibility, persistence consistency, and avoidable performance problems.
6. Code clarity and educational value.

Do not block a pull request for personal style preferences, a different but valid component arrangement, or an optional improvement outside the issue. If the code is acceptable but there is a useful learning opportunity, leave it as a non-blocking suggestion.

## How to write a review comment

Write comments for a React Native beginner. Do not only say that a pattern is “wrong” or “not idiomatic.” Explain the runtime or platform consequence and show the smallest useful alternative.

For every substantive comment, use this reasoning:

```text
Problem: What the changed code currently assumes or does.
Why it matters: The concrete user, data, lifecycle, platform, or security consequence.
Better approach: A focused alternative and why it fits this project.
How to verify: A test, device scenario, or command that can confirm the fix.
```

Use a severity label when it helps the author prioritize:

- `[blocker]` — The PR is unsafe to merge because it can lose data, crash, expose content, break a required flow, or fail on a supported platform.
- `[important]` — The behavior is likely incorrect or fragile and should be fixed in this PR when practical.
- `[learning]` — The code works, but the explanation or alternative will prevent a likely future bug.
- `[nit]` — Optional readability or style improvement. Do not overuse this label.

Prefer one specific comment over several broad comments. Include file and line context naturally through the GitHub review location. When a concern applies to several files, explain the shared rule once and point to the most important example.

Good review comments answer all four questions:

```text
[important] Problem: The selected asset URI is stored directly in SQLite.
Why it matters: A picker URI may be temporary or may be a content URI whose access is not guaranteed after the app restarts. The record can look valid while the attachment can no longer be opened.
Better approach: Copy the asset into the app's private file-system directory first, then persist the copied URI and file metadata together. Keep the picker result as transient input only.
How to verify: Select a file, force-quit the app, reopen it, and open the attachment on both iOS and Android.
```

Avoid comments like “use a service,” “this is bad RN,” or “make this production-ready” without naming the failure mode and a concrete next step.

## Native Lab-specific review checklist

### 1. Scope and learning intent

- Does the change solve the issue without pulling in excluded scope such as authentication, a server API, push notifications, background location, Bluetooth, NFC, payments, or a complex global state library?
- Is a native feature kept understandable enough to study? A large abstraction that hides permissions, URIs, lifecycle, or bridge messages is a learning problem even if it works.
- If a platform-specific decision is required, is the reason documented in code or in the learning documentation?
- Does the implementation match the Expo SDK 57 dependency versions in this app? If an API is uncertain, check the Expo SDK 57 and React Native documentation before making a confident review claim.

### 2. React Native fundamentals

- Are native components used instead of web-only elements such as `div`, `button`, `input`, CSS files, or browser-only globals?
- Are visible strings rendered inside `Text` rather than placed directly under `View` or another native container?
- Does layout use React Native style rules rather than assuming the browser's CSS layout, DOM measurement, or hover behavior?
- Are `Pressable` interactions given an accessible role, label, and disabled/pressed behavior where appropriate?
- Are long or dynamic collections rendered with a virtualized list when a `ScrollView` would create unnecessary work?
- Are state updates and effects safe across rerenders? Look for stale closures, missing dependencies, effects that update state in loops, and asynchronous work that updates an unmounted or no-longer-relevant screen.
- Is screen state separated from native service code so permission, file, database, and WebView behavior can be tested without rendering the entire screen?
- Does the code avoid copying a web mental model into mobile without handling app lifecycle, system back, keyboard, safe areas, or platform differences?

When suggesting a hook or component change, explain the lifecycle reason. For example, an event subscription belongs in an effect with a cleanup function because the app may mount the screen more than once; it should not be registered on every render.

### 3. Permissions

- Is the purpose of camera or photo access explained before the system prompt appears?
- Are permission states modeled beyond a simple boolean? Review allowed, denied, limited/restricted access, and the case where the user must open Settings.
- Does the code handle a user denying permission without throwing an app-wide error or leaving an infinite loading state?
- Is permission requested immediately before the feature needs it rather than at app startup without context?
- Are iOS usage descriptions and Android permission/configuration changes present when the feature requires them?
- Does the UI provide a clear retry path and explain why the feature cannot continue?

The reviewer should distinguish “the user cancelled” from “the native API failed” and from “the user denied access.” These are different normal states with different next actions.

### 4. Camera and photo selection

- Are camera and photo-library flows treated as separate permission and result paths where the platform requires it?
- Is cancellation a successful no-op that preserves the draft rather than an error that clears it?
- Does the code validate that a result exists before reading its URI, file name, type, or size?
- Is the selected image's URI treated as an input to be copied or processed, rather than as a permanent storage location?
- Are simulator limitations and real-device testing needs documented when camera behavior cannot be faithfully simulated?
- Does the UI prevent duplicate submissions while a photo is being copied or saved?

### 5. Files and app-private storage

- Is the difference between a temporary picker URI and an app-private persistent URI explicit?
- Are `file://` and `content://` URIs handled without assuming a normal filesystem path? Never build a path by string concatenation when a platform file-system API is available.
- Are file name, extension, MIME type, size, and local URI stored as deliberate metadata rather than inferred later from an unreliable URI?
- Is the file copied before its metadata is committed to SQLite, or is there a compensating cleanup path when either operation fails?
- On record deletion, are both the database metadata and the physical attachment cleaned up? What happens if one cleanup step fails?
- Does the implementation avoid needless duplicate copies and loading large images into JS memory? Review resize, compression, and caching decisions when relevant.
- Does the app detect a missing or unreadable attachment and show a recoverable error instead of crashing?

Call out the consistency boundary clearly: the database row and the actual file are two resources. A successful row insert does not prove that the file is safely stored.

### 6. Local data and SQLite

- Does the data model express the relationship between a record and its attachments?
- Are create, read, update, and delete operations awaited and error-handled?
- Are writes serialized or otherwise protected from duplicate submission and conflicting updates?
- Does deleting a record remove or reconcile its attachment metadata and files?
- Does the app restore data after a force-quit and restart, rather than only preserving in-memory state?
- Are schema creation and future migrations explicit enough that a fresh install and an existing install can both open the database?
- Is user-visible state refreshed after a mutation, or can the list show stale data after creating or deleting a record?

Avoid recommending a global state library merely to refresh a screen. First consider a small repository/service boundary, a focused hook, or an explicit reload after the persisted mutation.

### 7. Loading, errors, and lifecycle

- Does every asynchronous native operation have a visible loading state and a failure state?
- Is a loading state always cleared in success, cancellation, and failure paths?
- Are buttons disabled while a non-idempotent save or delete is in progress?
- Can the user safely leave and return to a screen while a picker, camera, database write, or WebView load is active?
- Does the implementation behave when the app moves to background and returns to foreground?
- Does Android system back have an intentional priority between WebView history, a modal, a dirty form, and navigation?
- Are subscriptions, listeners, timers, and pending native events cleaned up when a screen unmounts or becomes irrelevant?

Review race conditions explicitly. For example, a slow file copy finishing after the user has deleted the draft must not recreate an attachment for a record that no longer exists.

### 8. Navigation and deep links

- Are both initial app URLs and URLs received while the app is already running handled?
- Is the `nativelab://record/{id}` record ID parsed and validated before navigation or database lookup?
- Does a missing or invalid record ID result in a safe fallback such as an error state or list screen?
- Is navigation state updated only after the record lookup is complete when the detail screen requires persisted data?
- Does the behavior remain correct when the app is cold-started, backgrounded, or already on another screen?

Do not treat a deep link as trusted input. A URL can be malformed, point to a deleted record, or contain unexpected characters.

### 9. WebView and the RN/web bridge

- Is WebView limited to its documented role as a supporting screen rather than becoming the app's main content?
- Are messages explicit, typed, and validated instead of being handled through loosely shaped arbitrary objects or executable strings?
- Does the RN side validate message origin/content and reject unknown message types?
- Are messages from RN to the web page sent only after the page is ready, with a defined behavior if the page has not loaded or has failed?
- Are WebView navigation and external links restricted by an allowlist of permitted domains and schemes?
- Are loading, failure, retry, and back-navigation states handled?
- Does the code avoid injecting user-controlled values into JavaScript without safe serialization and escaping?
- Are authentication tokens, cookies, local storage, and other sensitive data kept within an explicit security boundary?

The bridge is an API boundary, even inside one app. Review its message schema and failure behavior with the same care as a small network API.

### 10. iOS and Android behavior

- Does shared code represent the common flow while making meaningful platform differences visible with `Platform.select`, platform files, or a documented adapter?
- Are Safe Area, keyboard behavior, screen rotation, font metrics, touch feedback, and shadows considered where the UI depends on them?
- Are iOS simulator and Android emulator limitations acknowledged for camera, photo library, file providers, and sharing?
- Are real-device checks required for the feature and documented in the PR or README?
- Does Android system back and iOS swipe-back behave safely for the changed flow?
- Are URI, MIME type, share sheet, intent, URL scheme, ATS, and cleartext assumptions platform-safe?

Do not accept a platform workaround that hides a behavior difference without documenting why it exists. The difference is part of this project's learning objective.

### 11. Accessibility and responsive UI

- Can VoiceOver and TalkBack identify the purpose and state of buttons, inputs, images, loading indicators, and error messages?
- Are touch targets usable and are important actions not communicated by color alone?
- Are labels, hints, and error messages understandable without seeing the screen?
- Does the layout survive small iPhones, larger phones, and tablets without clipped text or inaccessible actions?
- Does dynamic text or a long file name cause overflow or push critical controls off screen?

### 12. Verification and documentation

- Does the PR run the app-level checks first: `npm run lint`, `npm run check-types`, and relevant tests from `apps/native-lab`?
- Are native features tested on the platform/device combinations that matter, not only in a web preview?
- Are permission denial, limited access, cancellation, missing files, storage failure, WebView failure, invalid deep links, and duplicate taps covered where relevant?
- Does the PR document a platform difference, setup step, or limitation that a future learner would otherwise have to rediscover?
- If verification could not be run, does the PR state exactly what was unavailable and what remains to test?

## Review result format

Start the review with a short summary of the overall risk and whether the issue's intended flow is complete. Then leave findings in severity order. End with a compact verification summary.

Use this shape when useful:

```text
Summary
- Scope: [within native-lab / includes unrelated changes]
- Main risk: [one sentence]
- Recommendation: [approve / request changes / needs follow-up]

Findings
1. [severity] [file/area]
   Problem: ...
   Why it matters: ...
   Better approach: ...
   How to verify: ...

Verification
- [command or device scenario]: [result]
- Remaining checks: [if any]
```

Approve when the requested flow is correct, failure and platform states are handled, and remaining comments are optional learning improvements. Request changes when a blocker or important correctness issue remains. Keep the review focused enough that a beginner can turn every comment into a concrete next step.
