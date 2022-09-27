import * as fs from "node:fs";
import { createInterface } from "node:readline";
import readline from "readline";
import { MipsAssembler } from "./Mips";

const scanner = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// scanner.question("Digite o nome do arquivo: ", (input) => {
//   let fileName = "";

//   if (input.includes(".asm")) fileName = input;
//   else fileName = input + ".asm";

//   main(fileName);
//   scanner.close();
// });

main("assembly.asm");

function main(fileName: string) {
  try {
    const data = fs.readFileSync(fileName);
    const mips = new MipsAssembler(data);

    const Array32Bin: Int32Array = mips.int32BitsArray;
    
    const Array32BinString: Array<string> = [];
    Array32Bin.forEach((element) => {
      Array32BinString.push(element.toString(2).padStart(32, "0"));
    });

    fs.writeFileSync("output.txt", Array32BinString.join("\n"));

    //fs.writeFileSync("output.bin", Array32Bin);
    
    //mipsMount(mips)
  } catch (error) {
    console.log(error);
  }
}
