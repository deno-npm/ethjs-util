import {
  arrayContainsArray,
  fromAscii,
  fromUtf8,
  getBinarySize,
  getKeys,
  intToBuffer,
  intToHex,
  isHexPrefixed,
  isHexString,
  padToEven,
  stripHexPrefix,
  toAscii,
  toUtf8,
} from "./mod.ts";
import {
  BN,
  Buffer,
} from "./deps.js";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";

Deno.test("intToHex handles numbers", () => {
  const i = 6003400;
  const hex = intToHex(i);
  assertEquals(hex, '0x5b9ac8');
});

Deno.test("intToHex handles BN", () => {
  assertEquals(intToHex(new BN(0)), '0x0');
});

Deno.test('getKeys retrieves correct set of values', () => {
  assertEquals(
    getKeys([{ type: 'sfd' }, { type: 'something' }], 'type'),
    ['sfd', 'something'],
  );
  assertEquals(getKeys([{ cool: 'something' }, { cool: 'fdsdfsfd' }], 'cool'), ['something', 'fdsdfsfd']);
  assertEquals(getKeys([{ type: '234424' }, { type: '243234242432' }], 'type'), ['234424', '243234242432']);
  assertEquals(getKeys([{ type: 'something' }, { type: 'something' }], 'type'), ['something', 'something']);
  assertEquals(getKeys([{ type: 'something' }], 'type'), ['something']);
  assertEquals(getKeys([], 'type'), []);
  assertEquals(getKeys([{ type: 'something' }, { type: 'something' }, { type: 'something' }], 'type'), ['something', 'something', 'something']);
});

Deno.test('isHexString validates hex correctly', () => {
  assertEquals(isHexString('0x0e026d45820d91356fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString('0x1e026d45820d91356fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString('0x6e026d45820d91356fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString('0xecfaa1a0c4372a2ac5cca1e164510ec8df04f681fc960797f1419802ec00b225'), true);
  assertEquals(isHexString('0x6e0e6d45820d91356fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString('0x620e6d45820d91356fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString('0x1e0e6d45820d91356fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString('0x2e0e6d45820d91356fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString('0x220c96d48733a847570c2f0b40daa8793b3ae875b26a4ead1f0f9cead05c3863'), true);
  assertEquals(isHexString('0x2bb303f0ae65c64ef80a3bb3ee8ceef5d50065bd'), true);
  assertEquals(isHexString('0x6e026d45820d91256fc73d7ff2bdef353ebfe7e9'), true);
  assertEquals(isHexString(' 0x0e026d45820d91356fc73d7ff2bdef353ebfe7e9'), false);
  assertEquals(isHexString('fdsjfsd'), false);
  assertEquals(isHexString(' 0xfdsjfsd'), false);
  assertEquals(isHexString('0xfds*jfsd'), false);
  assertEquals(isHexString('0xfds$jfsd'), false);
  assertEquals(isHexString('0xf@dsjfsd'), false);
  assertEquals(isHexString('0xfdsjf!sd'), false);
  assertEquals(isHexString('fds@@jfsd'), false);
  assertEquals(isHexString('0x0', 2), false);
});

Deno.test('stripHexPrefix strip prefix of valid strings', () => {
  assertEquals(stripHexPrefix('0xkdsfksfdkj'), 'kdsfksfdkj');
  assertEquals(stripHexPrefix('0xksfdkj'), 'ksfdkj');
  assertEquals(stripHexPrefix('0xkdsfdkj'), 'kdsfdkj');
  assertEquals(stripHexPrefix('0x23442sfdkj'), '23442sfdkj');
  assertEquals(stripHexPrefix('0xkdssdfssfdkj'), 'kdssdfssfdkj');
  assertEquals(stripHexPrefix('0xaaaasfdkj'), 'aaaasfdkj');
  assertEquals(stripHexPrefix('0xkdsdfsfsdfsdfsdfdkj'), 'kdsdfsfsdfsdfsdfdkj');
  assertEquals(stripHexPrefix('0x111dssdddj'), '111dssdddj');
  assertEquals(stripHexPrefix('0xkdsfksfdkj'), 'kdsfksfdkj');
  assertEquals(stripHexPrefix('ksfdkj'), 'ksfdkj');
  assertEquals(stripHexPrefix('kdsfdkj'), 'kdsfdkj');
  assertEquals(stripHexPrefix('23442sfdkj'), '23442sfdkj');
  assertEquals(stripHexPrefix('0xkdssdfssfdkj'), 'kdssdfssfdkj');
  assertEquals(stripHexPrefix('aaaasfdkj'), 'aaaasfdkj');
  assertEquals(stripHexPrefix('kdsdfsfsdfsdfsdfdkj'), 'kdsdfsfsdfsdfsdfdkj');
  assertEquals(stripHexPrefix('111dssdddj'), '111dssdddj');
  assertEquals(stripHexPrefix(null as unknown as string), null);
  assertEquals(stripHexPrefix(undefined as unknown as string), undefined);
  assertEquals(stripHexPrefix(242423 as unknown as string), 242423);
  assertEquals(stripHexPrefix({} as unknown as string), {});
  assertEquals(stripHexPrefix([] as unknown as string), []);
  assertEquals(stripHexPrefix(true as unknown as string), true);
});

Deno.test('padToEven should pad to even', () => {
  assertEquals(padToEven('0').length % 2, 0);
  assertEquals(padToEven('111').length % 2, 0);
  assertEquals(padToEven('22222').length % 2, 0);
  assertEquals(padToEven('ddd').length % 2, 0);
  assertEquals(padToEven('aa').length % 2, 0);
  assertEquals(padToEven('aaaaaa').length % 2, 0);
  assertEquals(padToEven('sdssd').length % 2, 0);
  assertEquals(padToEven('eee').length % 2, 0);
  assertEquals(padToEven('w').length % 2, 0);
});

Deno.test('padToEven should add leading 0 to non-even strings', () => {
  assertEquals(padToEven('0'), '00');
  assertEquals(padToEven('111'), '0111');
  assertEquals(padToEven('22222'), '022222');
  assertEquals(padToEven('ddd'), '0ddd');
  assertEquals(padToEven('aa'), 'aa');
  assertEquals(padToEven('aaaaaa'), 'aaaaaa');
  assertEquals(padToEven('sdssd'), '0sdssd');
  assertEquals(padToEven('eee'), '0eee');
  assertEquals(padToEven('w'), '0w');
});

Deno.test('arrayContainsArray checks `a` contains all of `b` items', () => {
  assertEquals(arrayContainsArray([1, 2], [1], true), true);
  assertEquals(arrayContainsArray([3, 3], [3, 2323], true), true);
  assertEquals(arrayContainsArray([1, 2, 'h'], [2332, 2, 'h'], true), true);
  assertEquals(arrayContainsArray([1, 2, 'fsffds'], [3232, 2, 'fsffds'], true), true);
  assertEquals(arrayContainsArray([1], [1], true), true);
  assertEquals(arrayContainsArray([1, 3333], [1, 323232], true), true);
});

Deno.test('arrayContainsArray checks `a` contains some of `b` items', () => {
  assertEquals(arrayContainsArray([1, 2, 3], [1, 2]), true);
  assertEquals(arrayContainsArray([3, 3], [3, 3]), true);
  assertEquals(arrayContainsArray([1, 2, 'h'], [1, 2, 'h']), true);
  assertEquals(arrayContainsArray([1, 2, 'fsffds'], [1, 2, 'fsffds']), true);
  assertEquals(arrayContainsArray([1], [1]), true);
  assertEquals(arrayContainsArray([], []), true);
  assertEquals(arrayContainsArray([1, 3333], [1, 3333]), true);
});

Deno.test('valid getBinarySize should get binary size of string', () => {
  assertEquals(getBinarySize('0x0e026d45820d91356fc73d7ff2bdef353ebfe7e9'), 42);
  assertEquals(getBinarySize('0x220c96d48733a847570c2f0b40daa8793b3ae875b26a4ead1f0f9cead05c3863'), 66);
});

const fromAsciiTests = [
  { value: 'myString', expected: '0x6d79537472696e67' },
  { value: 'myString\x00', expected: '0x6d79537472696e6700' },
  { value: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB',
    expected: '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c' },
];


Deno.test(`fromAscii works correctly`, () => {
  fromAsciiTests.forEach((test) => {
    assertEquals(fromAscii(test.value), test.expected);
  });
});

const fromUtf8Tests = [
  { value: 'myString', expected: '0x6d79537472696e67' },
  { value: 'myString\x00', expected: '0x6d79537472696e67' },
  { value: 'expected value\u0000\u0000\u0000', expected: '0x65787065637465642076616c7565' },
];

Deno.test('fromUtf8 works correctly', () => {
  fromUtf8Tests.forEach((test) => {
    assertEquals(fromUtf8(test.value), test.expected);
  });
});

const toUtf8Tests = [
  { value: '0x6d79537472696e67', expected: 'myString' },
  { value: '0x6d79537472696e6700', expected: 'myString' },
  { value: '0x65787065637465642076616c7565000000000000000000000000000000000000', expected: 'expected value' },
];

Deno.test('toUtf8 works correctly', () => {
  toUtf8Tests.forEach((test) => {
    assertEquals(toUtf8(test.value), test.expected);
  });
});

const toAsciiTests = [
  { value: '0x6d79537472696e67', expected: 'myString' },
  { value: '0x6d79537472696e6700', expected: 'myString\u0000' },
  { value: '0x0300000035e8c6d54c5d127c9dcebe9e1a37ab9b05321128d097590a3c100000000000006521df642ff1f5ec0c3a7aa6cea6b1e7b7f7cda2cbdf07362a85088e97f19ef94331c955c0e9321ad386428c',
    expected: '\u0003\u0000\u0000\u00005èÆÕL]\u0012|Î¾\u001a7«\u00052\u0011(ÐY\n<\u0010\u0000\u0000\u0000\u0000\u0000\u0000e!ßd/ñõì\f:z¦Î¦±ç·÷Í¢Ëß\u00076*\bñùC1ÉUÀé2\u001aÓB' },
];

Deno.test('toAsciiTests', () => {
  toAsciiTests.forEach((test) => {
    assertEquals(toAscii(test.value), test.expected);
  });
});

Deno.test('intToBuffer works correctly', () => {
  const x = 6003400;
  assertEquals(intToBuffer(x).toString('hex'), '5b9ac8');

  //Odd int
  const y = 1;
  assertEquals(intToBuffer(y).toString('hex'), '01');
});
