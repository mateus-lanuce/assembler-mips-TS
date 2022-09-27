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
    jumpInstruction: Boolean;
};

export type J_Instruction = {
    opcode: number;
    adress: number;
};

type Instruction = {
    type: string;
    command: String;
    instruction: R_Instruction | I_Instruction | J_Instruction;
    lineIndex: number;
}

type Label = {
    label: String;
    command: String;
    commandType: string;
    instruction: R_Instruction | I_Instruction | J_Instruction;
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
                    instruction, 
                    commandType, 
                    command: splitLabel[1].trim(), 
                    adress: this._lineAdress + (index * 4),
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
                    immediate: 0,
                    jumpInstruction: false
                }

                operation.opcode = this.operationCodes[commandSplit[0] as keyof typeof this.operationCodes];
                if(operation.opcode !== 15) {
                    operation.rs = this.registers[commandSplit[1] as keyof typeof this.registers];
                    operation.rt = this.registers[commandSplit[2] as keyof typeof this.registers];
                    operation.immediate = parseInt(commandSplit[3]);
                    operation.jumpInstruction = operation.opcode === 4 || operation.opcode === 5 ? true : false;
                    
                    //se for uma label pega o endereco
                    if(isNaN(operation.immediate)) {
                        //pegar o endereco (linha da label - linha da instrucao - 1)
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
                    adress: 0,          
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

    /**
     * transforma os valores em um array de inteiros onde cada posicao é uma linha
     */
    get int32BitsArray(): Int32Array {
        //um array com os valores das instruçoes ordenado
        let tempArray: Array<number> = [];
        //passa por cada linha verifica de qual objeto faz parte e adiciona seu valor convertido a um array.
        this.readRows.forEach((row, index) => {
            const label = this._labels.filter(label => label.lineIndex === index)[0];
            const instruction = this._instructions.filter(instruction => instruction.lineIndex === index)[0];

            if(label) {
                tempArray.push(this.convertInstructionBool(label, label.commandType));
            } else {
                tempArray.push(this.convertInstructionBool(instruction, instruction.type));
            }

        })
        let int32 = new Int32Array(tempArray);

        return int32;
    }

    /**
     * converte o objeto de instrução em um numero com os bits da instruçao
     * @param instruction 
     * @param type
     * @return {number}
    */
    convertInstructionBool(instruction: Instruction | Label, type: string  ): number {

        let number = 0;
        // console.log(instruction, type)

        switch (type) {
            case 'r':
                let typeR = instruction.instruction as R_Instruction;
                number = typeR.opcode << 26;
                number = number | typeR.rs << 21;
                number = number | typeR.rt << 16;
                number = number | typeR.rd << 11;
                number = number | typeR.shamt << 6;
                number = number | typeR.funct;

                break;
        
            case 'i':
                let typeI = instruction.instruction as I_Instruction;

                //pegar o endereco (linha da label - linha da instrucao - 1)
                if(typeI.jumpInstruction) {
                    typeI.immediate = this._labels.find(label => label.adress === typeI.immediate)?.lineIndex || 0;
                    typeI.immediate = typeI.immediate - instruction.lineIndex - 1;
                }

                number = typeI.opcode << 26;
                number = number | typeI.rs << 21;
                number = number | typeI.rt << 16;

                
                if(typeI.jumpInstruction) {
                    const mascara = 0b00000000000000001111111111111111;
                    typeI.immediate = typeI.immediate & mascara;                       
                }

                number = number | typeI.immediate;
                
                break;

            case 'j':
                let typeJ = instruction.instruction as J_Instruction;
                number = typeJ.opcode << 26;
                number = number | (typeJ.adress / 4);

                break;
            default:
                break;
        }

        return number;
    }
    
    get readRows() {
        return this._readRows;
    }

    get labels() {
        return this._labels;
    }
}