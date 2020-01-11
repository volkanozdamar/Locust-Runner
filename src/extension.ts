// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { QuickPickItem } from 'vscode';
import * as child_process from 'child_process'; 



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// The code you place here will be executed every time your command is executed
	function wait(ms: number){
		var start = new Date().getTime();
		var end = start;
		while(end < start + ms) {
		  end = new Date().getTime();
	   }
	 }





	let disposable = vscode.commands.registerCommand('extension.ozdamar', async () => {
		const locustPath = '/usr/local/bin/locust'
		// Display a message box to the user
		var testFolder = vscode.workspace.rootPath+'/tests';
		var testfiles:string[] = new Array();
        fs.readdir(testFolder, (err, files) => {
            files.forEach(files => {
                testfiles.push(files);
            });
          }); 

		let runnerType = await vscode.window.showQuickPick(['local', 'master','slave']);
		const platform = await vscode.window.showInputBox({value: 'stage',placeHolder: 'Select where do you want to run your test?'});
		const terminal = await (<any>vscode.window).createTerminal({ name: `Locust Runner `+platform});
		const cterminal = (<any>vscode.window).createTerminal({ name: `Locust Chrome `+platform});
		const testfile = await vscode.window.showQuickPick(testfiles);
		const fileLocation =  'tests/'+testfile;
		if(runnerType === "local"){
			await terminal.sendText(locustPath+' -f '+fileLocation+' --host='+platform);
			await terminal.show();
		}
		if(runnerType === "master"){
			await terminal.sendText(locustPath+' -f '+fileLocation+' --host='+platform+' --master');
			await terminal.show();
		}
	
		if(runnerType === "slave"){
			let hostIp = await  vscode.window.showInputBox({value: '192.0.0.1',placeHolder: 'Write your [MASTER] machine IP'});
			let port = await  vscode.window.showInputBox({value: '80',placeHolder: 'Select where do you want to run your test?'});
			await terminal.sendText(locustPath+' -f '+' --host='+platform+' --master-host='+hostIp+' --master-port='+port);
			await terminal.show();
		}
		wait(4000)
		await cterminal.sendText('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome "http://localhost:8089"');
		await vscode.window.showInformationMessage('Chrome Browser is UP');
	});

	context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {}


//--no-reset-stats --slave --master-host=10.10.48.232