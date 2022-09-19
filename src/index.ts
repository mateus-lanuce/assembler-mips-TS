import * as fs from "node:fs";
import { MipsAssembler } from "./Mips";
import { mipsType } from "./utils/checkMipsType";

try {
  const data = fs.readFileSync("assembly.txt");
  const mips = new MipsAssembler(data);

  mips.readRows.forEach((row) => {
    console.log(mipsType(row));
  });

  //   console.log(mips.labels);
} catch (error) {
  console.log(error);
}