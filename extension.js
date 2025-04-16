const vscode = require('vscode');
const cp = require('child_process');
const fetch = require('node-fetch');

let commitIntervalId = null;

function activate(context) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	if (workspaceFolder) {
		try {
			cp.execSync('git --version', { stdio: 'ignore' }); 
		} catch (err) {
			vscode.window.showErrorMessage('Git is not installed or not in the system PATH.');
			return;
		}
		
		vscode.window.showInformationMessage('Auto AI Git Commit is running on startup...');
		const config = vscode.workspace.getConfiguration('autoAiGitCommit');
		const delayInSeconds = config.get('commitDelay') || 15;

		// start auto-commits on interval
		commitIntervalId = setInterval(() => {
			try {
				autoCommit({ showInfoIfNoChanges: false });
			} catch (error) {
				vscode.window.showErrorMessage(`Auto commit failed during interval: ${error.message}`);
			}
		}, delayInSeconds * 1000);

		autoCommit({ showInfoIfNoChanges: false });
	}

	const startCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.init', async () => {
		autoCommit({ showInfoIfNoChanges: true });
	});

	const stopCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.stop', () => {
		vscode.window.showInformationMessage('Auto AI Git Commit has stopped.');

		if (commitIntervalId) {
			clearInterval(commitIntervalId);
			commitIntervalId = null;
		}
	});

	const openSettingsCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.openSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', '@ext:dreamersdesire.auto-ai-git-commit-and-push');
	});


	context.subscriptions.push(startCommand, stopCommand, openSettingsCommand);
}

async function autoCommit(options = {}) {
	const config = vscode.workspace.getConfiguration('autoAiGitCommit');
	const apiKey = config.get('geminiApiKey');
	const enablePush = config.get('enablePush');
	const defaultConfigMessage = config.get('defaultConfigMessage') || 'Updated Changes';

	const { showInfoIfNoChanges = true } = options;
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	try {
		cp.execSync('git rev-parse --is-inside-work-tree', { cwd: workspaceFolder, stdio: 'ignore' });
		cp.execSync('git add .', { cwd: workspaceFolder });

		const diff = cp.execSync('git diff --cached', { cwd: workspaceFolder, encoding: 'utf8' });
		if (!diff.trim()) {
			if (showInfoIfNoChanges) {
				vscode.window.showInformationMessage('No changes to commit.');
			}
			return;
		}

		const message = await generateCommitMessage(diff, apiKey, defaultConfigMessage);
		if (!message) {
			vscode.window.showErrorMessage('Failed to generate commit message.');
			return;
		}

		let lines = message.trim().split('\n');
		if (lines[0].startsWith('```')) lines.shift();
		if (lines[lines.length - 1].startsWith('```')) lines.pop();

		let cleanMessage = lines.join('\n')
			.replace(/\[ETA:.*?\]/g, '')
			.trim();

		cp.execSync(`git commit -m "${cleanMessage.replace(/"/g, "'")}"`, { cwd: workspaceFolder });
		if (enablePush) {
			vscode.window.showInformationMessage('🚧 Push feature is coming in a future update. Stay tuned!');

			/* const remote = cp.execSync('git remote get-url origin', { cwd: workspaceFolder }).toString().trim();
			if (!remote.startsWith('git@')) {
				vscode.window.showWarningMessage('Push skipped: Please configure SSH for GitHub to enable push support.');
			} else {
				cp.execSync('git push', { cwd: workspaceFolder });
				vscode.window.showInformationMessage('Commit pushed to GitHub.');
			} */
		} else {
			vscode.window.showInformationMessage('Auto commit complete!');
		}

	} catch (err) {
		vscode.window.showErrorMessage('Auto commit failed: ' + err.message);
	}
}

async function generateCommitMessage(diff, apiKey, fallbackMessage) {
	if (!apiKey) {
		vscode.window.showErrorMessage('Gemini API key is missing. Please set it in extension settings.');
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
			vscode.window.showErrorMessage('Error from Gemini: ' + data.error.message);
			return fallbackMessage;
		}

		return data?.candidates?.[0]?.content?.parts?.[0]?.text || fallbackMessage;
	} catch (err) {
		vscode.window.showErrorMessage('Error contacting Gemini: ' + err.message);
		return fallbackMessage;
	}
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
