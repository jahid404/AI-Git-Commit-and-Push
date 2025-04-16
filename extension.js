const vscode = require('vscode');
const cp = require('child_process');
const fetch = require('node-fetch');

function activate(context) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	if (workspaceFolder) {
		vscode.window.showInformationMessage('🚀 Auto Git Commit is running on startup...');
		autoCommit({ showInfoIfNoChanges: false });
	}

	const startCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.init', async () => {
		vscode.window.showInformationMessage('🚀 Running Auto Git Commit...');
		autoCommit({ showInfoIfNoChanges: true });
	});

	const stopCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.stop', () => {
		vscode.window.showInformationMessage('ℹ️ Auto AI Git Commit has stopped.');
	});

	context.subscriptions.push(startCommand, stopCommand);
}

async function autoCommit(options = {}) {
	const { showInfoIfNoChanges = true, enablePush = true } = options;
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

	if (!workspaceFolder) {
		vscode.window.showErrorMessage('❌ No workspace folder found.');
		return;
	}

	try {
		cp.execSync('git rev-parse --is-inside-work-tree', { cwd: workspaceFolder, stdio: 'ignore' });
		cp.execSync('git add .', { cwd: workspaceFolder });

		const diff = cp.execSync('git diff --cached', { cwd: workspaceFolder, encoding: 'utf8' });
		if (!diff.trim()) {
			if (showInfoIfNoChanges) {
				vscode.window.showInformationMessage('ℹ️ No changes to commit.');
			}
			return;
		}

		const message = await generateCommitMessage(diff);
		if (!message) {
			vscode.window.showErrorMessage('❌ Failed to generate commit message.');
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
			const remote = cp.execSync('git remote get-url origin', { cwd: workspaceFolder }).toString().trim();
			if (!remote.startsWith('git@')) {
				vscode.window.showWarningMessage('🚨 Push skipped: Please configure SSH for GitHub to enable push support.');
			} else {
				cp.execSync('git push', { cwd: workspaceFolder });
				vscode.window.showInformationMessage('🚀 Commit pushed to GitHub.');
			}
		} else {
			vscode.window.showInformationMessage('✅ Auto commit complete!');
		}

	} catch (err) {
		vscode.window.showErrorMessage('❌ Auto commit failed: ' + err.message);
	}
}

async function generateCommitMessage(diff) {
	const apiKey = 'AIzaSyAB6KIFg8yPA4Q_9VEKrFDanwoumTm-q5k';
	if (!apiKey) {
		vscode.window.showErrorMessage('❌ Gemini API key is missing.');
		return null;
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
		return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Updated';
	} catch (err) {
		vscode.window.showErrorMessage('❌ Error contacting Gemini API: ' + err.message);
		return null;
	}
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
