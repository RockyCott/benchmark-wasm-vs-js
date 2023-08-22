let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add(a, b) {
    _assertNum(a);
    _assertNum(b);
    const ret = wasm.add(a, b);
    return ret >>> 0;
}

/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function subtract(a, b) {
    _assertNum(a);
    _assertNum(b);
    const ret = wasm.subtract(a, b);
    return ret >>> 0;
}

/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function multiply(a, b) {
    _assertNum(a);
    _assertNum(b);
    const ret = wasm.multiply(a, b);
    return ret >>> 0;
}

/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function divide(a, b) {
    _assertNum(a);
    _assertNum(b);
    const ret = wasm.divide(a, b);
    return ret >>> 0;
}

export function __wbg_log_b101747d1f7a2d75() { return logError(function (arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
}, arguments) };

