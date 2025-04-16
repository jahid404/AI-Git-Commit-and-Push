# Auto AI Git Commit and Push

Automatically stage, commit, and optionally push your code using AI-generated commit messages powered by **Google Gemini**. This extension helps automate Git hygiene for solo developers, prototypers, or anyone who wants quick commits without switching context.


## Features

- ⏳ **Auto Commit on Inactivity**: Automatically commits code after a period of inactivity (default 60 seconds, minimum 30).
- 🤖 **Gemini AI-Powered Commit Messages**: Generate meaningful and professional commit messages from code diffs.
- 💬 **Manual Controls via Command Palette**:
  - `Commit` now
  - `Stop` auto commit
  - `Restart` the extension
  - `Open Settings`
- 📁 **Works only in Git projects**: Automatically detects if a `.git` folder is present.
- 🛡️ **Fallback Message**: Uses a default commit message if AI fails or no key is set.


## Requirements

- Git must be installed and available in your terminal (`git --version`).
- A valid **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app) to enable AI commit messages.
- A Git-initialized project (must contain a `.git` folder).
- Internet access to connect to Google's API.

## Extension Settings

This extension contributes the following settings:

- `autoAiGitCommit.commitDelay`  
  _Type_: `number` – Delay (in seconds) between changes and auto-commit. Must be at least `30`.  
  _Default_: `60`

- `autoAiGitCommit.defaultCommitMessage`  
  _Type_: `string` – Used when Gemini fails to generate a commit message.  
  _Default_: `"Updated Changes"`

- `autoAiGitCommit.geminiApiKey`  
  _Type_: `string` – Your Gemini API key. Get one at [Google AI Studio](https://makersuite.google.com/app).


## Known Issues

- The "Push" feature is not implemented yet and is marked as "Coming Soon".
- Works only with one workspace folder. Multi-root workspaces are not yet supported.
- Some rare Gemini API responses may return improperly formatted messages.

## FAQ

**Q: Does this push to GitHub?**  
A: Not yet. The `enablePush` feature is planned and will be released soon.

**Q: Is my API key safe?**  
A: Your Gemini API key is stored in your local VS Code settings and is never transmitted anywhere other than Google's API.

**Q: Will this work with private Git repositories?**  
A: Yes. As long as the workspace contains a `.git` folder, it will function.

**Q: What happens if there's no diff to commit?**  
A: Nothing will be committed, and no message is shown unless triggered manually.


## Release Notes

### 1.0.0

🎉 Initial release of `Auto AI Git Commit and Push`.

- Auto-detect `.git` projects
- Auto-commit after delay
- Gemini-generated commit messages
- Manual `commit`, `stop`, `restart`, `openSettings` commands
- Minimum delay enforcement (30 seconds)
- Graceful fallback commit messaging


## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows/Linux)
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows/Linux)
- Press `Ctrl+Space` to see a list of Markdown snippets


## For more information

- [Visual Studio Code Extension Docs](https://code.visualstudio.com/api)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
- [Google Gemini API](https://ai.google.dev/)


**Enjoy Auto AI Git Commit and Push!**  
Made with 💡 by [DreamersDesire](https://dreamersdesire.com)  
GitHub: [https://github.com/jahid404](https://github.com/jahid404)
