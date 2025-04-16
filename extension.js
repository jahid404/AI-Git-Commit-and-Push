const vscode = require('vscode');
const cp = require('child_process');
const fetch = require('node-fetch');

let commitIntervalId = null;
const msgPrefix = 'Auto AI Git Commit:';

function activate(context) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	if (workspaceFolder) {
		vscode.window.showInformationMessage(`${msgPrefix} Running on startup...`);
		const config = vscode.workspace.getConfiguration('autoAiGitCommit');
		const delayInSeconds = Math.max(config.get('commitDelay') || 30, 30);

		// start auto-commits on interval
		commitIntervalId = setInterval(() => {
			try {
				autoCommit({ showInfoIfNoChanges: false });
			} catch (error) {
				vscode.window.showErrorMessage(`${msgPrefix} Auto commit failed during interval: ${error.message}`);
			}
		}, delayInSeconds * 1000);

		autoCommit({ showInfoIfNoChanges: false });
	}

	// Immediate Commit command
	const commitNow = vscode.commands.registerCommand('auto-ai-git-commit-and-push.commit', async () => {
		autoCommit({ showInfoIfNoChanges: true });
	});

	// Stop command
	const stopCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.stop', () => {
		vscode.window.showInformationMessage(`${msgPrefix} Stopped.`);

		if (commitIntervalId) {
			clearInterval(commitIntervalId);
			commitIntervalId = null;
		}
	});

	// Restart command
	const restartCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.restart', () => {
		if (commitIntervalId) {
			clearInterval(commitIntervalId);
			commitIntervalId = null;
		}
		vscode.window.showInformationMessage(`${msgPrefix} Restarting...`);

		const config = vscode.workspace.getConfiguration('autoAiGitCommit');
		const delayInSeconds = Math.max(config.get('commitDelay') || 30, 30);

		commitIntervalId = setInterval(() => {
			try {
				autoCommit({ showInfoIfNoChanges: false });
			} catch (error) {
				vscode.window.showErrorMessage(`${msgPrefix} Auto commit failed: ${error.message}`);
			}
		}, delayInSeconds * 1000);

		autoCommit({ showInfoIfNoChanges: false });
	});

	// Open settings command
	const openSettingsCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.openSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', '@ext:dreamersdesire.auto-ai-git-commit-and-push');
	});


	context.subscriptions.push(commitNow, stopCommand, restartCommand, openSettingsCommand);
}

async function autoCommit(options = {}) {
	const config = vscode.workspace.getConfiguration('autoAiGitCommit');
	const apiKey = config.get('geminiApiKey');
	const enablePush = false /* config.get('enablePush') */;
	const defaultConfigMessage = config.get('defaultConfigMessage') || 'Updated Changes';

	const { showInfoIfNoChanges = true } = options;
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	if (!workspaceFolder) {
		vscode.window.showErrorMessage(`${msgPrefix} No workspace folder found`);
		return;
	}

	try {
		cp.execSync('git --version', { stdio: 'ignore' });
		cp.execSync('git rev-parse --is-inside-work-tree', { cwd: workspaceFolder, stdio: 'ignore' });
		cp.execSync('git add .', { cwd: workspaceFolder });

		const diff = cp.execSync('git diff --cached', { cwd: workspaceFolder, encoding: 'utf8' });
		if (!diff.trim()) {
			if (showInfoIfNoChanges) {
				// vscode.window.showInformationMessage('No changes to commit.');
			}
			return;
		}

		const message = await generateCommitMessage(diff, apiKey, defaultConfigMessage);
		if (!message) {
			vscode.window.showErrorMessage(`${msgPrefix} Failed to generate commit message`);
			return;
		}

		let lines = message.trim().split('\n');
		if (lines[0].startsWith('```')) lines.shift();
		if (lines[lines.length - 1].startsWith('```')) lines.pop();

		let cleanMessage = lines.join('\n')
			.replace(/\[ETA:.*?\]/g, '')
			.trim();

		cp.execSync(`git commit -m "${cleanMessage.replace(/"/g, "'")}"`, { cwd: workspaceFolder });
		// vscode.window.showInformationMessage('Auto commit complete!');

		if (enablePush) {
			vscode.window.showInformationMessage(`🚧 ${msgPrefix} Push feature is coming in a future update. Stay tuned!`);

			/* const remote = cp.execSync('git remote get-url origin', { cwd: workspaceFolder }).toString().trim();
			if (!remote.startsWith('git@')) {
				vscode.window.showWarningMessage('Push skipped: Please configure SSH for GitHub to enable push support.');
			} else {
				cp.execSync('git push', { cwd: workspaceFolder });
				vscode.window.showInformationMessage('Commit pushed to GitHub.');
			} */
		}
	} catch (err) {
		vscode.window.showErrorMessage(`${msgPrefix} Auto commit failed (${err.message})`);
	}
}

async function generateCommitMessage(diff, apiKey, fallbackMessage) {
	if (!apiKey) {
		vscode.window.showErrorMessage(`${msgPrefix} Gemini API key is missing. Please set it in extension settings.`);
		return fallbackMessage;
	}

	try {
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{
					parts: [{
						text: `Generate a short, specific, and professional Git commit message for the following diff:\n\n${diff}`
					}]
				}]
			})
		});

		const data = await res.json();

		if (data.error) {
			vscode.window.showErrorMessage(`${msgPrefix} Error from Gemini (${data.error.message})`);
			return fallbackMessage;
		}

		return data?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackMessage;
	} catch (err) {
		vscode.window.showErrorMessage(`${msgPrefix} Error contacting with Gemini (${err.message})`);
		return fallbackMessage;
	}
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
