import * as fs from "node:fs";
import { MipsAssembler } from "./Mips";


try {
    const data = fs.readFileSync('assembly.txt');

    const mips = new MipsAssembler(data);

    console.log(mips.labels);
   
} catch (error) {
    console.log(error);
}

