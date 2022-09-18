class cu {

}



export class Mips extends cu{

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