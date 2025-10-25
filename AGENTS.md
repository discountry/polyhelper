# Repository Guidelines

## Project Structure & Module Organization
PolyHelper is a lightweight Manifest V3 content-script extension. The root contains `manifest.json`, which declares permissions and injects the script on Polymarket event pages, and `content.js`, which renders the “问AI” helper button and handles clipboard + window navigation. There are currently no build artifacts or additional asset folders; keep supplemental utilities inside `src/` only if the project grows, and reflect any new entry points in the manifest.

## Build, Test, and Development Commands
The extension runs directly from source—no bundler or package manager is currently in use. During development, load the project via `chrome://extensions` → “Load unpacked” and point Chrome to the repository root. When preparing a manual release, create a distributable archive with `zip -r polyhelper.zip manifest.json content.js`. Update the version in `manifest.json` before distribution.

## Coding Style & Naming Conventions
Author JavaScript with 2-space indentation, semicolons omitted unless needed, and modern ES modules kept out of the content script to retain MV3 compatibility. Favor `const` / `let` over `var`, camelCase for functions (`waitForSelector`) and variables, and uppercase snake case only for constants. Keep DOM queries scoped and wrap asynchronous flows in `try/catch`. When adding helper files, mirror the existing naming and store shared utilities under `utils/`.

## Testing Guidelines
There is no automated test suite yet. Verify changes manually by loading the unpacked extension, opening a live Polymarket event, and confirming the prompt button renders once, copies the structured prompt, and opens ChatGPT in a new tab. Test both success and clipboard failure paths using DevTools overrides. If you introduce unit-testable logic, add lightweight Jest tests under `__tests__/` and document the run command.

## Commit & Pull Request Guidelines
This repository has no existing commit history; adopt Conventional Commits to keep future history readable (e.g., `feat: add clipboard fallback`). Each pull request should outline the user-facing change, note manual testing results, reference related issues, and include before/after screenshots or recordings when the UI changes.
