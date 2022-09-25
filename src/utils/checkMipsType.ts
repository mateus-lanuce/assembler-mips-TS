import {
  OperationCodes,
  FunctionCodes,
} from "./mipsValues";

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

/**
 * 
 * @param command comando a ser verificado
 * @returns  retorna o tipo da instrução
 */
export function mipsType(command: String): string {
  let operation = command.split(" ");
  let operationCode = operation.filter((operation) => operation !== "");
  let pos: number;
  let type = " ";

  if (operationCode[0].includes(":")) pos = 1;
  else pos = 0;

  operationsR.forEach((code) => {
    if (code === operationCode[pos]) type = "r";
  });
  operationsI.forEach((code) => {
    if (code === operationCode[pos]) type = "i";
  });
  operationsJ.forEach((code) => {
    if (code === operationCode[pos]) type = "j";
  });

  return type;
}
