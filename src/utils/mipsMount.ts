import { MipsAssembler } from "../Mips";
import { mipsType } from "./checkMipsType";
import { registerChecks } from "./registerChek";

export function mipsMount(dataMips: MipsAssembler): void {
  dataMips.readRows.forEach((row) => {
    let operation = row.split(" ").filter((operation) => operation !== "");
    let pos: number;

    if (operation[0].includes(":")) pos = 1;
    else pos = 0;

    let registrores$ = operation.filter((operation) => operation.includes("$"));
    let registrores = operation.slice(2, operation.length);

    let typeR = { opcode: 0, rs: 0, rt: 0, rd: 0, sa: 0, function: 0 };
    let typeI = { opcode: 0, rs: 0, rt: 0, immediate: 0 };
    let typeJ = { opcode: 0, endereco: 0 };

    if (mipsType(row) === "r") {
      if (operation[pos] == "mull") typeR.opcode = 28;

      registrores.forEach((value, i) => {
        if (registrores$.length == 1) typeR.rs = registerChecks(value);
        else if (registrores$.length == 2) {
          if (i == 0) typeR.rs = registerChecks(value);
          else if (i == 1) typeR.rt = registerChecks(value);
          else if (i == 2) typeR.sa = registerChecks(value);
        } else if (registrores$.length == 3) {
          if (i == 0) typeR.rd = registerChecks(value);
          else if (i == 1) typeR.rs = registerChecks(value);
          else if (i == 2) typeR.rt = registerChecks(value);
        }
      });

      console.log(typeR);
    }

    if (mipsType(row) === "i") {
      registrores.forEach((value, i) => {
        if (registrores$.length == 2) {
          if (i == 0) typeI.rs = registerChecks(value, dataMips);
          else if (i == 1) typeI.rt = registerChecks(value, dataMips);
          else if (i == 2) typeI.immediate = registerChecks(value, dataMips);
        } else if (registrores$.length == 3) {
        }
      });

      console.log(typeI);
    }
    if (mipsType(row) === "j") {
      const contect = row.split(" ").filter((operation) => operation !== "");
      if (contect[0] === "j") typeJ.opcode = 2;
      else typeJ.opcode = 3;

      dataMips.labels.forEach((label) => {
        if (contect[1] === label.label) typeJ.endereco = Number(label.address);
      });
      console.log(typeJ);
    }
  });
}
