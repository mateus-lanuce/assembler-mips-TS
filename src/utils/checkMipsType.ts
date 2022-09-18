import {
  TemporaryRegister,
  StorageRegister,
  OperationCodes,
  FunctionCodes,
} from "./enums";

const operationsR = [
  "sll",
  "slr",
  "jr",
  "mfhi",
  "mflo",
  "mult",
  "multu",
  "div",
  "divu",
  "add",
  "addu",
  "sub",
  "subu",
  "and",
  "or",
  "slt",
  "sltu",
  "mul",
];
const operationsI = [
  "beq",
  "bne",
  "addi",
  "addiu",
  "slti",
  "sltiu",
  "andi",
  "ori",
  "lui",
  "lw",
  "sw",
];
const operationsJ = ["j", "jal"];

export function mipsType(comand: string): string {
  let operation = comand.split(" ");

  operationsR.forEach((operation) => {
    if (operation === operation[0]) return "r";
  });
  operationsI.forEach((operation) => {
    if (operation === operation[0]) return "i";
  });
  operationsJ.forEach((operation) => {
    if (operation === operation[0]) return "j";
  });

  return "Not defined";
}
