import { TemporaryRegister, StorageRegister, OperationCodes, FunctionCodes } from './utils/enums';

type R_Instruction = {
    opcode: number;
    rs: number;
    rt: number;
    rd: number;
    shamt: number;
    funct: number;
};

type I_Instruction = {
    opcode: number;
    rt: number;
    rs: number;
    immediate: number;
};

type J_Instruction = {
    opcode: number;
    adress: number;
};

class MipsInstructions {
    protected temporaryRegisters = TemporaryRegister;
    protected storageRegisters = StorageRegister;
    protected operationCodes = OperationCodes;
    protected functionCodes = FunctionCodes;
    //usar os enums como enum['valor da string lida'];
    
    protected r: R_Instruction = { opcode: 0, rs: 0, rt: 0, rd: 0, shamt: 0, funct: 0 };
    protected i: I_Instruction = { opcode: 0, rs: 0, rt: 0, immediate: 0 };
    protected j: J_Instruction = { opcode: 0, adress: 0 };
    
    resetInstructions() {
        this.r = { opcode: 0, rs: 0, rt: 0, rd: 0, shamt: 0, funct: 0 };
        this.i = { opcode: 0, rs: 0, rt: 0, immediate: 0 };
        this.j = { opcode: 0, adress: 0 };
    }

    
}


/**
 * classe que organiza o codigo.
 */
export class MipsAssembler extends MipsInstructions{

    private _data: Buffer;
    
    private _readRows: String[]; //array com as linhas lidas

    private _labels: Array<{label: String; index: number}> = []; //instruçoes L1, L2 labels

    // private _instructions: String[];

    /**
     * @param Data objeto retornado da leitura do arquivo no formato assembly mips
     */
    constructor(Data: Buffer) {
        super();
        this._data = Data;
        this._readRows = Data.toString().split('\n');
        this._readRows.forEach((row, index )=> {
            if(row.includes(':')) this._labels.push({label: row, index});
        });

    }
    
    get readRows() {
        return this._readRows;
    }

    get labels() {
        return this._labels;
    }
}