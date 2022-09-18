export enum TemporaryRegister {
    $t0 = 8, $t1, $t2, $t3, $t4, $t5, $t6, $t7
}

export enum StorageRegister {
    $s0 = 16, $s1, $s2, $s3, $s4, $s5, $s6, $s7
}

export enum OperationCodes {
    //r instructions
    sll = 0, slr = 0, jr = 0, mfhi = 0, mflo = 0,
    mult = 0, multu = 0, div = 0, divu = 0, add = 0,
    addu = 0, sub = 0, subu = 0, and = 0, or = 0,
    slt = 0, sltu = 0, mul = 28,
    //i instructions
    beq = 4, bne, addi = 8, addiu, slti, sltiu, andi, 
    ori, lui = 15, lw = 35, sw = 43,
    // j instructions
    j = 2, jal = 3
}

export enum FunctionCodes {
    //r instructions
    sll = 0, slr = 2, jr = 8, mfhi = 16, mflo = 18,
    mult = 24, multu, div, divu, add = 32,
    addu, sub, subu, and, or,
    slt = 42, sltu, mul = 2
}