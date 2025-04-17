# Changelog

All notable changes to the **Auto AI Git Commit and Push** extension will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] – 2025-04-17

### Added

- Automatic detection of file changes in Git-tracked projects.
- AI-powered commit message generation using Gemini API.
- Configurable commit delay (minimum 30 seconds).
- Manual commit trigger via command palette.
- "Stop" and "Restart" commands for controlling the auto-commit behavior.
- Settings integration to configure API key, commit delay, and fallback message.
- Informative logging via VS Code notifications.
- Graceful error handling for missing configs, Git issues, or API errors.
