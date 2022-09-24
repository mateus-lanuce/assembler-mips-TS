export function mipsAdress(
  comand: String,
  line: number
): { comand: String; address: number } {
  let address = 0x40000;
  address += 0x4 * line;

  return { comand, address };
}
