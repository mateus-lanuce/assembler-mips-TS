import { mipsType } from './utils/checkMipsType';
import { OperationCodes, FunctionCodes, Registers } from './utils/mipsValues';

export type R_Instruction = {
    opcode: number;
    rs: number;
    rt: number;
    rd: number;
    shamt: number;
    funct: number;
};

export type I_Instruction = {
    opcode: number;
    rt: number;
    rs: number;
    immediate: number;
};

export type J_Instruction = {
    opcode: number;
    adress: number;
};

type Instruction = {
    type: string;
    command: String;
    instruction: R_Instruction | I_Instruction | J_Instruction | null;
    lineIndex: number;
}

type Label = {
    label: String;
    command: String;
    commandType: string;
    instruction: R_Instruction | I_Instruction | J_Instruction | null;
    adress: number;
    lineIndex: number;
}

class MipsInstructions {
    protected registers = Registers;
    protected operationCodes = OperationCodes;
    protected functionCodes = FunctionCodes;
    //usar os objetos como objeto['valor da string lida'];
}

/**
 * classe que organiza o codigo.
 */
export class MipsAssembler extends MipsInstructions{

    private _data: Buffer;
    
    private _readRows: String[]; //array com as linhas lidas

    private _labels: Array<Label> = []; //instruçoes L1, L2 labels

    private _instructions: Array<Instruction> = [];

    private _lineAdress = 0x00400000;

    /**
     * @param Data objeto retornado da leitura do arquivo no formato assembly mips
     */
    constructor(Data: Buffer) {
        super();
        this._data = Data;
        this._readRows = Data.toString().split('\n'); //ler as linhas e separar por quebra de linha
        this.setLabels(this._readRows);
        this.setInstructions(this._readRows);

        console.log('labels: ', this.labels);
        console.log('instructions:', this._instructions);
        
        // console.log('adress:', this._lineAdress)
    }
    
    /**
     * @param rows array de linhas lidas do arquivo
     */
    setLabels(rows: String[]): void {
        
        //percorre as linhas pegando as labels e preenchendo os objetos
        rows.forEach((row, index) => {

            if(row.includes(':')) {

                const splitLabel: string[] = row.split(':');
                const commandType = mipsType(splitLabel[1].trim());
                const instruction =  this.formatMipsInstruction(commandType, splitLabel[1]);

                const label: Label = { 
                    label: splitLabel[0], 
                    instruction , 
                    commandType , 
                    command: splitLabel[1].trim(), 
                    adress: this._lineAdress + (index * 4) ,
                    lineIndex: index
                };

                this._labels.push(label);

            }
        
        })
    }

    setInstructions(rows: String[]): void {

        rows.forEach((row, index) => {

            //linhas que nao sao labels
            if(!row.includes(':')) {
                const type = mipsType(row);
                const instruction: Instruction = { 
                    type, 
                    command: row.trim() , 
                    instruction: this.formatMipsInstruction(type, row), 
                    lineIndex: index 
                };

                this._instructions.push(instruction);
            }

        })
    }

    /**
     * 
     * @param type tipo da instrução
     * @param command comando a ser convertido
     * @returns retorna a instrução convertida
    */
    formatMipsInstruction(type: string, command: String): Instruction["instruction"] {
        //pega cada palavra
        const commandSplit = command.trim().split(" ").map(word => word.replace(',', ''));
        let operation: Instruction["instruction"] = { opcode: 0, rs: 0, rt: 0, rd: 0, shamt: 0, funct: 0 }; //valor padrao

        //formata o objeto de acordo com o tipo de comando
        switch (type) {
            case 'r':

                operation.opcode = this.operationCodes[commandSplit[0] as keyof typeof this.operationCodes];
                operation.funct = this.functionCodes[commandSplit[0] as keyof typeof this.functionCodes];

                if(operation.funct === 0 || (operation.funct === 2 && operation.opcode === 0)) {
                    operation.rd = this.registers[commandSplit[1] as keyof typeof this.registers];
                    operation.rt = this.registers[commandSplit[2] as keyof typeof this.registers];
                    operation.shamt = parseInt(commandSplit[3]);
                    break;
                }

                if(operation.funct === 8) {
                    operation.rs = this.registers[commandSplit[1] as keyof typeof this.registers];
                    break;
                }

                if(operation.funct === 16 || operation.funct === 18) {
                    operation.rd = this.registers[commandSplit[1] as keyof typeof this.registers];
                    break;
                }

                //entra aqui apenas se nao for nenhum dos casos acima por causa do break
                operation.rs = this.registers[commandSplit[1] as keyof typeof this.registers];
                operation.rt = this.registers[commandSplit[2] as keyof typeof this.registers];
                operation.rd = commandSplit[3] ? this.registers[commandSplit[3] as keyof typeof this.registers] : 0;
                break;
                
            case 'i':
                operation = {
                    opcode: 0,
                    rs: 0,
                    rt: 0,
                    immediate: 0
                }

                operation.opcode = this.operationCodes[commandSplit[0] as keyof typeof this.operationCodes];
                if(operation.opcode !== 15) {
                    operation.rs = this.registers[commandSplit[1] as keyof typeof this.registers];
                    operation.rt = this.registers[commandSplit[2] as keyof typeof this.registers];
                    operation.immediate = parseInt(commandSplit[3]);

                    //se for uma label pega o endereco
                    if(isNaN(operation.immediate)) {
                        operation.immediate = this._labels.find(label => label.label === commandSplit[3])?.adress || 0;
                    }

                } else {
                    operation.rt = this.registers[commandSplit[1] as keyof typeof this.registers];
                    operation.immediate = parseInt(commandSplit[2]);
                }
                break;

            case 'j':
                operation = {
                    opcode: 0,
                    adress: 0
                }

                operation.opcode = this.operationCodes[commandSplit[0] as keyof typeof this.operationCodes];
                operation.adress = parseInt(commandSplit[1]);

                //se for uma label pega o endereco
                if(isNaN(operation.adress)) {
                    operation.adress = this._labels.find(label => label.label === commandSplit[1])?.adress || 0;
                }
                break;
                
        }

        return operation;
    }
    
    get readRows() {
        return this._readRows;
    }

    get labels() {
        return this._labels;
    }
}