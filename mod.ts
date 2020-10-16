import {Buffer} from "./deps.js";

export function isHexPrefixed(str: string) {
  if (typeof str !== 'string') {
    throw new Error(`[ethjs-util] Value must be type 'string', ${(typeof str)} provided`);
  }

  return str.slice(0, 2) === '0x';
}

/**
 * Removes '0x' from a given `String` if present
 * 
 * If something other than a hex string is provided
 * it will return the value passed to it
 */
export function stripHexPrefix(str: string){
  if (typeof str !== 'string') {
    return str;
  }

  return isHexPrefixed(str) ? str.slice(2) : str;
}

/**
 * Pads a `String` to have an even length
 */
export function padToEven(value: string) {
  if (typeof value !== 'string') {
    throw new Error(`[ethjs-util] While padding to even, value must be string, is currently ${typeof value}, while padToEven.`);
  }

  if (value.length % 2) {
    return `0${value}`;
  }

  return value;
}

/**
 * Converts a `Number` into a hex `String`
 */
export function intToHex(i: number) {
  var hex = i.toString(16);

  return `0x${hex}`;
}

/**
 * Converts an `Number` to a `Buffer`
 */
export function intToBuffer(i: number) {
  const hex = intToHex(i);

  return Buffer.from(padToEven(hex.slice(2)), 'hex');
}

/**
 * Get the binary size of a string
 */
export function getBinarySize(str: string) {
  if (typeof str !== 'string') {
    throw new Error(`[ethjs-util] while getting binary size, method getBinarySize requires input 'str' to be type String, got '${typeof str}'.`);
  }

  return Buffer.byteLength(str, 'utf8');
}

/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 */
export function arrayContainsArray(superset: unknown[], subset: unknown[], some?: boolean) {
  if (Array.isArray(superset) !== true) { throw new Error(`[ethjs-util] method arrayContainsArray requires input 'superset' to be an array got type '${typeof superset}'`); }
  if (Array.isArray(subset) !== true) { throw new Error(`[ethjs-util] method arrayContainsArray requires input 'subset' to be an array got type '${typeof subset}'`); }

  return subset[Boolean(some) && 'some' || 'every']((value) => (superset.indexOf(value) >= 0));
}

/**
 * Should be called to get utf8 from it's hex representation
 * 
 * @returns ascii string representation of hex value
 */
export function toUtf8(hex: string) {
  const bufferValue = Buffer.from(
    padToEven(
      stripHexPrefix(hex).replace(/^0+|0+$/g, '')
    ),
    'hex',
  );

  return bufferValue.toString('utf8');
}

/**
 * Should be called to get ascii from it's hex representation
 * @returns ascii string representation of hex value
 */
export function toAscii(hex: string) {
  let str = '';
  let i = 0;
  const l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }

  for (; i < l; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
}

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @returns hex representation of input string
 */
export function fromUtf8(stringValue: string) {
  const str = Buffer.from(stringValue, 'utf8');

  return `0x${padToEven(str.toString('hex')).replace(/^0+|0+$/g, '')}`;
}

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @returns hex representation of input string
 */
export function fromAscii(stringValue: string) {
  let hex = '';
  for(let i = 0; i < stringValue.length; i++) {
    const code = stringValue.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? `0${n}` : n;
  }

  return `0x${hex}`;
}

/**
 * Get specific key from inner object array of objects
 * 
 * @example
 * // returns [1, 3]
 * getKeys([{a: 1, b: 2}, {a: 3, b: 4}], 'a')
 */
export function getKeys(params: Array<{[key: string]: string}>, key: string, allowEmpty?: boolean) {
  if (!Array.isArray(params)) { throw new Error(`[ethjs-util] method getKeys expecting type Array as 'params' input, got '${typeof params}'`); }
  if (typeof key !== 'string') { throw new Error(`[ethjs-util] method getKeys expecting type String for input 'key' got '${typeof key}'.`); }

  const result: string[] = [];

  for (let i = 0; i < params.length; i++) {
    let value = params[i][key];
    if (allowEmpty && !value) {
      value = '';
    } else if (typeof(value) !== 'string') {
      throw new Error('invalid abi');
    }
    result.push(value);
  }

  return result;
}

/**
 * Is the string a hex string.
 */
export function isHexString(value: string, length?: number) {
  if (typeof(value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  if (length && value.length !== 2 + 2 * length) {
    return false;
  }

  return true;
}
