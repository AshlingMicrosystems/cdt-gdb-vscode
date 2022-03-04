/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

/*********************************************************************
 * Based on the theia-cpp-extension in Eclipse Theia under EPL-2.0
 *********************************************************************/

import * as React from 'react';

import './GlobalVariables.scss';
import { messageBroker } from './MessageBroker';

// class ForwardIterator implements Iterator<number> {
//     private nextItem: number = 0;

//     constructor(private array: Uint8Array) { }

//     next(): IteratorResult<number> {
//         if (this.nextItem < this.array.length) {
//             return {
//                 value: this.array[this.nextItem++],
//                 done: false,
//             }
//         } else {
//             return {
//                 done: true,
//                 value: 0,
//             };
//         }
//     }

//     [Symbol.iterator](): IterableIterator<number> {
//         return this;
//     }
// }

// class ReverseIterator implements Iterator<number> {
//     private nextItem: number;

//     constructor(private array: Uint8Array) {
//         this.nextItem = this.array.length - 1;
//     }

//     next(): IteratorResult<number> {
//         if (this.nextItem >= 0) {
//             return {
//                 value: this.array[this.nextItem--],
//                 done: false,
//             }
//         } else {
//             return {
//                 done: true,
//                 value: 0,
//             };
//         }
//     }

//     [Symbol.iterator](): IterableIterator<number> {
//         return this;
//     }
// }

interface Props {
};

interface State {
    symbols?: any;
    error?: JSX.Element;
};

export class GlobalVariables extends React.Component<Props, State> {
    private addressReq = "";
    private lengthReq = "512";

    constructor (props: Props) {
        super(props);
        this.state = {
        };
    }

    async sendReadMemoryRequest() {
        try {
            this.setState({
                error: undefined,
                symbols: undefined
            });
            const result = await messageBroker.send({
                command: 'ReadGlobals',
                args: {
                    address: this.addressReq,
                    length: parseInt(this.lengthReq)
                }
            });
            console.log(result.result.symbols);
            this.setState({symbols: result.result});
        } catch (err) {
            this.setState({error: <h3>{err + ''}</h3>});
        }
    }

    onEndiannessChange(event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        if (value === 'le' || value === "be") {
            this.setState({});
        }
    }

    renderInputSection() {
        return (
            <div className="input-group">
                    <button
                        onClick={() => this.sendReadMemoryRequest()}
                        
                    >
                        Fetch/Update Globals
                    </button>
                </div>
        );
    }

    // private hex2bytes(hex: string): Uint8Array {
    //     const bytes = new Uint8Array(hex.length / 2);

    //     for (let i = 0; i < hex.length / 2; i++) {
    //         const hexByte = hex.slice(i * 2, (i + 1) * 2);
    //         const byte = parseInt(hexByte, 16);
    //         bytes[i] = byte;
    //     }

    //     return bytes;
    // }

    // private isprint(byte: number) {
    //     return byte >= 32 && byte < 127;
    // }
    
    private renderRows() {
        if (!this.state.symbols) {
            return undefined;
        }
        const rows: JSX.Element[] = [];
        // this.state = {symbols : {"test" : "testworking"}};
        // if(!this.state.symbols.symbols){

        // }
        if(!this.state.symbols.symbols || !this.state.symbols.symbols.debug){
            return undefined;
        }
        const debugSymbols = this.state.symbols.symbols.debug;
        for (let i=0; i<debugSymbols.length; i++) {
            for (let j=0; j<debugSymbols[i].symbols.length; j++) {
                rows.push(
                    <tr>
                        <td>{debugSymbols[i].symbols[j].name}</td>
                        <td>{debugSymbols[i].symbols[j].type}</td>
                        <td>{debugSymbols[i].filename}</td>
                        <td>{debugSymbols[i].symbols[j].value}</td>
                    </tr>
                );
            }
        }
        // for (let i=0; i<this.state.symbols[0].debug[0].symbols.length; i++) {
        //     let varName = this.state.symbols[0].debug[0].symbols[i].name;
        //     rows.push(
        //         <tr>
        //             <td>{varName}</td>
        //             <td>test1</td>
        //         </tr>
        //     );
        // }
        // rows.push(
        //             <tr>
        //                 <td>test</td>
        //                 <td>test1</td>
        //             </tr>
        //         );

        // for (let rowOffset = 0; rowOffset < bytes.length; rowOffset += this.state.bytesPerRow) {
        //     rows.push(
        //         <tr key={rowOffset}>
        //             <td key={`addr${rowOffset}`}>{addressStr}</td>
        //             {data.map((group, index) => <td key={`data${rowOffset},${index}`}>{group}</td>)}
        //             <td key={`asc${rowOffset}`}>{asciiStr}</td>
        //         </tr>
        //     )
        // }

        return (
            <React.Fragment>
                {rows}
            </React.Fragment>
        );
    }

    private renderMemory() {
        if (!this.state.symbols) {
            return undefined;
        }

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Variable</th>
                            <th>Type</th>
                            <th>FilePath</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        console.log("hai");
        alert("hai1");
        return (
            <div id="memory-browser">
                {this.renderInputSection()}
                <hr className="seperator" />
                {this.state.error}
                {this.renderMemory()}
            </div>
        );
    }
}
