## ethjs-util

<div>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/ethjs/ethjs-util">
    <img src="https://david-dm.org/ethjs/ethjs-util.svg"
    alt="Dependency Status" />
  </a>

  <!-- devDependency Status -->
  <a href="https://david-dm.org/ethjs/ethjs-util#info=devDependencies">
    <img src="https://david-dm.org/ethjs/ethjs-util/dev-status.svg" alt="devDependency Status" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/ethjs/ethjs-util">
    <img src="https://travis-ci.org/ethjs/ethjs-util.svg"
    alt="Build Status" />
  </a>

  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/ethjs-util">
    <img src="http://img.shields.io/npm/v/ethjs-util.svg"
    alt="NPM version" />
  </a>

  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/ethjs/ethjs-util">
    <img src="https://coveralls.io/repos/github/ethjs/ethjs-util/badge.svg" alt="Test Coverage" />
  </a>

  <!-- Javascript Style -->
  <a href="http://airbnb.io/javascript/">
    <img src="https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg" alt="js-airbnb-style" />
  </a>
</div>

<br />

A simple set of Ethereum JS utilities such as `toBuffer` and `isHexPrefixed`.

## Usage

```js
import * as util from 'https://deno.land/x/npm_ethjs_util@0.0.1/mod.ts';

const value = util.intToBuffer(38272);
// returns <Buffer ...>
```

## About

A simple set of Ethereum JS utilties, mainly for frontend dApps.

Credits to the original implementation https://www.npmjs.org/package/ethjs-util

## Available Methods

```
getBinarySize        <Function (String) : (Number)>
intToBuffer          <Function (Number) : (Buffer)>
intToHex             <Function (Number) : (String)>

padToEven            <Function (String) : (String)>
isHexPrefixed        <Function (String) : (Boolean)>
isHexString          <Function (Value, Length) : (Boolean)>
stripHexPrefix       <Function (String) : (String)>
addHexPrefix         <Function (String) : (String)>

getKeys              <Function (Params, Key, Empty) : (Array)>
arrayContainsArray   <Function (Array, Array) : (Boolean)>

fromAscii            <Function (String) : (String)>
fromUtf8             <Function (String) : (String)>
toAscii              <Function (String) : (String)>
toUtf8               <Function (String) : (String)>
```
