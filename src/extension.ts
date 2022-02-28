/*********************************************************************
 * Copyright (c) 2018 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { ExtensionContext, commands, window } from 'vscode';
import { MemoryServer } from './memory/server/MemoryServer';
export { MemoryServer } from './memory/server/MemoryServer';

export function activate(context: ExtensionContext) {
    new MemoryServer(context);

    context.subscriptions.push(
       commands.registerCommand('cdt.debug.askProgramPath', config => {
            return browseFile("Program to debug");
        })
    );

    context.subscriptions.push(
        commands.registerCommand('cdt.debug.askServerPath', config => {
            return browseFile("GDB Server Executable");
        })
    );

    context.subscriptions.push(
        commands.registerCommand('cdt.debug.askGDBPath', config => {
            return browseFile("GDB Executable");
        })
    );

    context.subscriptions.push(
        commands.registerCommand('cdt.debug.askProcessId', (_config) => {
            return window.showInputBox({
                placeHolder: 'Please enter ID of process to attach to',
            });
        })
    );
}

export function deactivate() {
    // empty, nothing to do on deactivating extension
}

export async function browseFile(titleString:string)
{
    const APP_FILE = await window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        openLabel:titleString
      });

      if (!APP_FILE || APP_FILE.length < 1) {
        return;
      }

      return APP_FILE[0].fsPath;
}
