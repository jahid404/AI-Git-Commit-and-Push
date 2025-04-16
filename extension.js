const vscode = require('vscode');
const cp = require('child_process');
const fetch = require('node-fetch');

function activate(context) {
	const startCommand = vscode.commands.registerCommand('auto-ai-git-commit-and-push.init', async () => {
		vscode.window.showInformationMessage('🚀 Running Auto Git Commit...');
		await autoCommit();
	});

	context.subscriptions.push(startCommand);
}

async function autoCommit() {
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
			vscode.window.showInformationMessage('ℹ️ No changes to commit.');
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
		// cp.execSync('git push origin main', { cwd: workspaceFolder });

		vscode.window.showInformationMessage('✅ Auto commit complete!');
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

	const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [{
				parts: [{
					text: `Generate a very short but specific and professional Git commit message for the following diff:\n\n${diff}`
				}]
			}]
		})
	});

	const data = await res.json();
	return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Updated';
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
