/* QR Code encoder — Byte mode, versions 1–40, ECC L/M/Q/H.
 * Compact adaptation of Project Nayuki's MIT-licensed reference encoder.
 * https://github.com/nayuki/QR-Code-generator (MIT). */

export type QrEcc = 'L' | 'M' | 'Q' | 'H';

const ECC_FORMAT: Record<QrEcc, number> = { L: 1, M: 0, Q: 3, H: 2 };
const ECC_LEVEL: Record<QrEcc, number> = { L: 0, M: 1, Q: 2, H: 3 };

// Per-version EC codewords per block, num blocks for each ECC level.
// Indexed [version][ecLevel] where ecLevel: L=0 M=1 Q=2 H=3. Versions 1–40.
const NUM_ERROR_CORRECTION_CODEWORDS: number[][] = [
  /* placeholder */ [0, 0, 0, 0],
  [7, 10, 13, 17],
  [10, 16, 22, 28],
  [15, 26, 36, 44],
  [20, 36, 52, 64],
  [26, 48, 72, 88],
  [36, 64, 96, 112],
  [40, 72, 108, 130],
  [48, 88, 132, 156],
  [60, 110, 160, 192],
  [72, 130, 192, 224],
  [80, 150, 224, 264],
  [96, 176, 260, 308],
  [104, 198, 288, 352],
  [120, 216, 320, 384],
  [132, 240, 360, 432],
  [144, 280, 408, 480],
  [168, 308, 448, 532],
  [180, 338, 504, 588],
  [196, 364, 546, 650],
  [224, 416, 600, 700],
  [224, 442, 644, 750],
  [252, 476, 690, 816],
  [270, 504, 750, 900],
  [300, 560, 810, 960],
  [312, 588, 870, 1050],
  [336, 644, 952, 1110],
  [360, 700, 1020, 1200],
  [390, 728, 1050, 1260],
  [420, 784, 1140, 1350],
  [450, 812, 1200, 1440],
  [480, 868, 1290, 1530],
  [510, 924, 1350, 1620],
  [540, 980, 1440, 1710],
  [570, 1036, 1530, 1800],
  [570, 1064, 1590, 1890],
  [600, 1120, 1680, 1980],
  [630, 1204, 1770, 2100],
  [660, 1260, 1860, 2220],
  [720, 1316, 1950, 2310],
  [750, 1372, 2040, 2430],
];

const NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 2, 2],
  [1, 2, 2, 4],
  [1, 2, 4, 4],
  [2, 4, 4, 4],
  [2, 4, 6, 5],
  [2, 4, 6, 6],
  [2, 5, 8, 8],
  [4, 5, 8, 8],
  [4, 5, 8, 11],
  [4, 8, 10, 11],
  [4, 9, 12, 16],
  [4, 9, 16, 16],
  [6, 10, 12, 18],
  [6, 10, 17, 16],
  [6, 11, 16, 19],
  [6, 13, 18, 21],
  [7, 14, 21, 25],
  [8, 16, 20, 25],
  [8, 17, 23, 25],
  [9, 17, 23, 34],
  [9, 18, 25, 30],
  [10, 20, 27, 32],
  [12, 21, 29, 35],
  [12, 23, 34, 37],
  [12, 25, 34, 40],
  [13, 26, 35, 42],
  [14, 28, 38, 45],
  [15, 29, 40, 48],
  [16, 31, 43, 51],
  [17, 33, 45, 54],
  [18, 35, 48, 57],
  [19, 37, 51, 60],
  [19, 38, 53, 63],
  [20, 40, 56, 66],
  [21, 43, 59, 70],
  [22, 45, 62, 74],
  [24, 47, 65, 77],
  [25, 49, 68, 81],
];

class BitBuffer {
  bits: number[] = [];
  appendBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) this.bits.push((val >>> i) & 1);
  }
}

function getNumRawDataModules(ver: number): number {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

function getNumDataCodewords(ver: number, ecc: QrEcc): number {
  return (
    Math.floor(getNumRawDataModules(ver) / 8) -
    NUM_ERROR_CORRECTION_CODEWORDS[ver][ECC_LEVEL[ecc]]
  );
}

function reedSolomonComputeDivisor(degree: number): Uint8Array {
  const result = new Uint8Array(degree);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = reedSolomonMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = reedSolomonMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function reedSolomonComputeRemainder(data: Uint8Array, divisor: Uint8Array): Uint8Array {
  const result: number[] = new Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= reedSolomonMultiply(divisor[i], factor);
    }
  }
  return Uint8Array.from(result);
}

function getAlignmentPositions(ver: number): number[] {
  if (ver === 1) return [];
  const numAlign = Math.floor(ver / 7) + 2;
  const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (numAlign * 2 - 2)) * 2;
  const result: number[] = [6];
  for (let pos = ver * 4 + 10; result.length < numAlign; pos -= step) {
    result.splice(1, 0, pos);
  }
  return result;
}

interface QrModule {
  size: number;
  modules: boolean[][];
}

export function encodeQr(text: string, ecc: QrEcc = 'M'): QrModule {
  const utf8 = new TextEncoder().encode(text);
  let version = 1;
  let dataCapacityBits = 0;
  let modeBits = 0;
  let charCountBits = 0;
  for (; version <= 40; version++) {
    dataCapacityBits = getNumDataCodewords(version, ecc) * 8;
    modeBits = 4;
    charCountBits = version < 10 ? 8 : 16;
    if (modeBits + charCountBits + utf8.length * 8 <= dataCapacityBits) break;
    if (version === 40)
      throw new Error('QR data too long');
  }

  const bb = new BitBuffer();
  bb.appendBits(0x4, 4); // byte mode
  bb.appendBits(utf8.length, charCountBits);
  for (const b of utf8) bb.appendBits(b, 8);
  const terminator = Math.min(4, dataCapacityBits - bb.bits.length);
  bb.appendBits(0, terminator);
  bb.appendBits(0, (8 - (bb.bits.length % 8)) % 8);
  for (let pad = 0xec; bb.bits.length < dataCapacityBits; pad ^= 0xec ^ 0x11)
    bb.appendBits(pad, 8);

  const dataCodewords = new Uint8Array(bb.bits.length / 8);
  for (let i = 0; i < bb.bits.length; i++) {
    dataCodewords[i >>> 3] |= bb.bits[i] << (7 - (i & 7));
  }

  // Reed-Solomon
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[version][ECC_LEVEL[ecc]];
  const blockEccLen = NUM_ERROR_CORRECTION_CODEWORDS[version][ECC_LEVEL[ecc]] / numBlocks;
  const rawCodewords = Math.floor(getNumRawDataModules(version) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);

  const blocks: Uint8Array[] = [];
  const rsDiv = reedSolomonComputeDivisor(blockEccLen);
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dataLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
    const dat = dataCodewords.slice(k, k + dataLen);
    k += dataLen;
    const ecc2 = reedSolomonComputeRemainder(dat, rsDiv);
    const block = new Uint8Array(shortBlockLen + 1);
    block.set(dat);
    block.set(ecc2, block.length - blockEccLen);
    if (i < numShortBlocks) block[shortBlockLen - blockEccLen] = 0;
    blocks.push(block);
  }
  const interleaved = new Uint8Array(rawCodewords);
  let outIdx = 0;
  for (let i = 0; i < blocks[0].length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
        interleaved[outIdx++] = blocks[j][i];
      }
    }
  }

  // Build matrix
  const size = version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  function setFunctionModule(x: number, y: number, isDark: boolean) {
    modules[y][x] = isDark;
    isFunction[y][x] = true;
  }

  function drawFinder(x: number, y: number) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) {
          setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  function drawAlignment(x: number, y: number) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  // Timing
  for (let i = 0; i < size; i++) {
    setFunctionModule(6, i, i % 2 === 0);
    setFunctionModule(i, 6, i % 2 === 0);
  }
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  const alignPos = getAlignmentPositions(version);
  const numAlign = alignPos.length;
  for (let i = 0; i < numAlign; i++) {
    for (let j = 0; j < numAlign; j++) {
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === numAlign - 1) ||
        (i === numAlign - 1 && j === 0)
      ) {
        continue;
      }
      drawAlignment(alignPos[i], alignPos[j]);
    }
  }

  // Reserve format
  for (let i = 0; i < 9; i++) setFunctionModule(i, 8, true);
  for (let i = 0; i < 8; i++) setFunctionModule(8, i, true);
  for (let i = 0; i < 8; i++) setFunctionModule(size - 1 - i, 8, true);
  for (let i = 0; i < 7; i++) setFunctionModule(8, size - 7 + i, true);
  setFunctionModule(8, size - 8, true);

  // Version info (≥ 7)
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = ((bits >>> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunctionModule(a, b, bit);
      setFunctionModule(b, a, bit);
    }
  }

  // Place data
  const dataBits: boolean[] = [];
  for (const cw of interleaved) {
    for (let i = 7; i >= 0; i--) dataBits.push(((cw >>> i) & 1) === 1);
  }

  let bitIdx = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && bitIdx < dataBits.length) {
          modules[y][x] = dataBits[bitIdx++];
        }
      }
    }
  }

  // Pick best mask (lowest penalty)
  let bestMask = 0;
  let bestPenalty = Infinity;
  for (let m = 0; m < 8; m++) {
    applyMask(modules, isFunction, m);
    drawFormat(modules, ecc, m, size, setFunctionModule);
    const p = penaltyScore(modules, size);
    if (p < bestPenalty) {
      bestPenalty = p;
      bestMask = m;
    }
    applyMask(modules, isFunction, m); // toggle off
  }
  applyMask(modules, isFunction, bestMask);
  drawFormat(modules, ecc, bestMask, size, setFunctionModule);

  return { size, modules };
}

function applyMask(
  modules: boolean[][],
  isFunc: boolean[][],
  mask: number,
) {
  const size = modules.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isFunc[y][x]) continue;
      let invert = false;
      switch (mask) {
        case 0: invert = (x + y) % 2 === 0; break;
        case 1: invert = y % 2 === 0; break;
        case 2: invert = x % 3 === 0; break;
        case 3: invert = (x + y) % 3 === 0; break;
        case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
        case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
        case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        case 7: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
      }
      if (invert) modules[y][x] = !modules[y][x];
    }
  }
}

function drawFormat(
  modules: boolean[][],
  ecc: QrEcc,
  mask: number,
  size: number,
  setFn: (x: number, y: number, dark: boolean) => void,
) {
  const data = (ECC_FORMAT[ecc] << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  for (let i = 0; i <= 5; i++) setFn(8, i, ((bits >>> i) & 1) === 1);
  setFn(8, 7, ((bits >>> 6) & 1) === 1);
  setFn(8, 8, ((bits >>> 7) & 1) === 1);
  setFn(7, 8, ((bits >>> 8) & 1) === 1);
  for (let i = 9; i < 15; i++) setFn(14 - i, 8, ((bits >>> i) & 1) === 1);
  for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, ((bits >>> i) & 1) === 1);
  for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, ((bits >>> i) & 1) === 1);
  setFn(8, size - 8, true);
}

function penaltyScore(modules: boolean[][], size: number): number {
  let result = 0;
  // Adjacent same-color in row/col runs
  for (let y = 0; y < size; y++) {
    let runColor = false;
    let runLen = 0;
    for (let x = 0; x < size; x++) {
      if (modules[y][x] === runColor) {
        runLen++;
        if (runLen === 5) result += 3;
        else if (runLen > 5) result++;
      } else {
        runColor = modules[y][x];
        runLen = 1;
      }
    }
  }
  for (let x = 0; x < size; x++) {
    let runColor = false;
    let runLen = 0;
    for (let y = 0; y < size; y++) {
      if (modules[y][x] === runColor) {
        runLen++;
        if (runLen === 5) result += 3;
        else if (runLen > 5) result++;
      } else {
        runColor = modules[y][x];
        runLen = 1;
      }
    }
  }
  // 2x2 same-color blocks
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = modules[y][x];
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1])
        result += 3;
    }
  }
  return result;
}
