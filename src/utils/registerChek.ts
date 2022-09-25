import { MipsAssembler } from "../Mips";

const registerV = [
  { nome: "$v0", value: 2 },
  { nome: "$v1", value: 3 },
];
const registerA = [
  { nome: "$a0", value: 4 },
  { nome: "$a1", value: 5 },
  { nome: "$a2", value: 6 },
  { nome: "$a3", value: 7 },
];
const registerT = [
  { nome: "$t0", value: 8 },
  { nome: "$t1", value: 9 },
  { nome: "$t2", value: 10 },
  { nome: "$t3", value: 11 },
  { nome: "$t4", value: 12 },
  { nome: "$t5", value: 13 },
  { nome: "$t6", value: 14 },
  { nome: "$t7", value: 15 },
  { nome: "$t8", value: 24 },
  { nome: "$t9", value: 25 },
];
const registerS = [
  { nome: "$s0", value: 16 },
  { nome: "$s1", value: 17 },
  { nome: "$s2", value: 18 },
  { nome: "$s3", value: 19 },
  { nome: "$s4", value: 20 },
  { nome: "$s5", value: 21 },
  { nome: "$s6", value: 22 },
  { nome: "$s7", value: 23 },
];

export function registerChecks(
  register: string,
  dataMips?: MipsAssembler
): number {
  const registrator = register
    .split(",")
    .filter((operation) => operation !== "")
    .toString()
    .split("");

  const value = Number(register[2]);
  let labelAdress;

  if (registrator[1] == "v") console.log(registerV[value].value);
  else if (registrator[1] == "a") return registerA[value].value;
  else if (registrator[1] == "t") return registerT[value].value;
  else if (registrator[1] == "s") return registerS[value].value;
  else if (registrator[0] == "L") {
    if (dataMips)
      dataMips.labels.forEach((label) => {
        if (register == label.label) {
          labelAdress = label.address;
        }
      });

    return Number(labelAdress);
  }

  return Number(register);
}
