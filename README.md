# Auto AI Git Commit and Push

Automatically stage, commit, and optionally push your code using AI-generated commit messages powered by **Google Gemini**. This extension helps automate Git hygiene for solo developers, prototypers, or anyone who wants quick commits without switching context.

## 🔽 Quick Download

#### Recommended
Just search `Auto AI Git Commit` in vscode extension searchbar and install the extension!
Don't forget to verify the publisher name `DreamersDesire` 🤭

#### Manual Install
Grab the latest `.vsix` package directly from the GitHub release:

👉 [Download Auto AI Git Commit and Push](https://github.com/jahid404/AI-Git-Commit-and-Push/releases/download/v1.0.1/auto-ai-git-commit-and-push-1.0.1.vsix)


## ✨ Features

- ⏳ **Auto Commit on Inactivity**: Automatically commits code after a period of inactivity (default 60 seconds, minimum 30).
- 🤖 **Gemini AI-Powered Commit Messages**: Generate meaningful and professional commit messages from code diffs.
- 💬 **Manual Controls via Command Palette**:
  - `Commit` now
  - `Stop` auto commit
  - `Restart` the extension
  - `Open Settings`
- 📁 **Works only in Git projects**: Automatically detects if a `.git` folder is present.
- 🛡️ **Fallback Message**: Uses a default commit message if AI fails or no key is set.


## 📦 Requirements

- Git must be installed and available in your terminal (`git --version`).
- A valid **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app) to enable AI commit messages.
- A Git-initialized project (must contain a `.git` folder).
- Internet access to connect to Google's API.

## 🚀 Usage

Once you've installed the `.vsix` extension in VS Code, the extension works quietly in the background. Here's how to get started:

1. **Install the Extension:**
   - Open VS Code.
   - Press `Ctrl+Shift+P` and select `Extensions: Install from VSIX...`.
   - Choose the `.vsix` file you downloaded.

2. **Configure Gemini API Key:**
   - Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
   - Run the command: `Auto Git Commit: Open Settings`.
   - This will take you directly to the extension's configuration panel.
   - Paste your [Google Gemini API key](https://aistudio.google.com/app/apikey) into the `Gemini API Key` field.

3. **Auto Commit in Action:**
   - After 60 seconds of inactivity in a Git-tracked project, the extension:
     - Detects staged changes.
     - Uses Gemini AI to generate a meaningful commit message.
     - Automatically commits and pushes your changes.

4. **Available Commands (via Command Palette `Ctrl+Shift+P`):**
   - `Auto Git Commit: Commit` – Triggers commit immediately.
   - `Auto Git Commit: Stop` – Disables auto-commits.
   - `Auto Git Commit: Restart` – Restarts the auto-commit timer.
   - `Auto Git Commit: Open Settings` – Opens configuration options.

> 💡 Tip: You can adjust the delay time, default fallback commit message, and more in the extension settings.


## ⚙️ Extension Settings

This extension contributes the following settings:

- `autoAiGitCommit.commitDelay`  
  _Type_: `number` – Delay (in seconds) between changes and auto-commit. Must be at least `30`.  
  _Default_: `60`

- `autoAiGitCommit.defaultCommitMessage`  
  _Type_: `string` – Used when Gemini fails to generate a commit message.  
  _Default_: `"Updated Changes"`

- `autoAiGitCommit.geminiApiKey`  
  _Type_: `string` – Your Gemini API key. Get one at [Google AI Studio](https://makersuite.google.com/app).


## 🐞 Known Issues

- The "Push" feature is not implemented yet and is marked as "Coming Soon".
- Works only with one workspace folder. Multi-root workspaces are not yet supported.
- Some rare Gemini API responses may return improperly formatted messages.

## ❓ FAQ

**Q: Does this push to GitHub?**  
A: Not yet. The `enablePush` feature is planned and will be released soon.

**Q: Is my API key safe?**  
A: Your Gemini API key is stored in your local VS Code settings and is never transmitted anywhere other than Google's API.

**Q: Will this work with private Git repositories?**  
A: Yes. As long as the workspace contains a `.git` folder, it will function.

**Q: What happens if there's no diff to commit?**  
A: Nothing will be committed, and no message is shown unless triggered manually.


## 📝 Release Notes

### 1.1.3
- Added `autoStart` setting to control auto-commit on extension activation.
- Improved error handling and logging.

### 1.0.0
🎉 Initial release of `Auto AI Git Commit and Push`.

- Auto-detect `.git` projects
- Auto-commit after delay
- Gemini-generated commit messages
- Manual `commit`, `stop`, `restart`, `openSettings` commands
- Minimum delay enforcement (30 seconds)
- Graceful fallback commit messaging


## For more information

- [Google Gemini API](https://ai.google.dev/)


**Enjoy Auto AI Git Commit and Push!**  
Made with 💡 by [DreamersDesire](https://dreamersdesire.com)  
GitHub: [https://github.com/jahid404](https://github.com/jahid404)
