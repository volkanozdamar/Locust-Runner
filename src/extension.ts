// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { QuickPickItem } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "locust-runner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.locustrunner', async () => {
		// The code you place here will be executed every time your command is executed
		const locustPath = '/usr/local/bin/locust'
		// Display a message box to the user
		const runnerType = await vscode.window.showQuickPick(['local', 'master','slave']);
		// Test File Location
		const fileLocation =  await vscode.window.showInputBox({value: 'tests/',placeHolder: 'FileLocation'});

		const platform = await vscode.window.showInputBox({value: 'stage',placeHolder: 'Select where do you want to run your test?'});
		//await vscode.window.showInformationMessage('Your Test is Running '+input);
		
		const terminal = (<any>vscode.window).createTerminal({ name: `Locust Runner `+platform});
		await terminal.show();
		if(runnerType === 'local'){
			await terminal.sendText(locustPath+' -f '+fileLocation+' --host='+platform);
		}
		
	});

	context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {}
