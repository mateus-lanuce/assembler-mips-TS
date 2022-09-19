import * as fs from "node:fs";
import { createInterface } from "node:readline";
import readline from "readline";
import { MipsAssembler } from "./Mips";
import { mipsType } from "./utils/checkMipsType";

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

    mips.readRows.forEach((row) => {
      console.log(mipsType(row));
    });

    // console.log(mips.labels);
  } catch (error) {
    console.log(error);
  }
}
