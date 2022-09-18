import * as fs from "node:fs";
import { Mips } from "./Mips";


try {
    const data = fs.readFileSync('assembly.txt');

    const mips = new Mips(data);

    console.log(mips.labels);
   
} catch (error) {
    console.log(error);
}

