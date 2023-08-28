let wasm;

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
  if (
    cachegetUint32Memory0 === null ||
    cachegetUint32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachegetUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint32Memory0().subarray(ptr / 1, ptr / 1 + len);
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

function passArray32ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 4);
  getUint32Memory0().set(arg, ptr / 4);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (
    cachegetInt32Memory0 === null ||
    cachegetInt32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}
/**
 * @param {Int32Array} src1
 * @param {Int32Array} src2
 * @param {Int32Array} res
 * @param {number} n
 */
export function multiply_int_vector(src1, src2, res, n) {
  try {
    var ptr0 = passArray32ToWasm0(src1, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArray32ToWasm0(src2, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passArray32ToWasm0(res, wasm.__wbindgen_malloc);
    var len2 = WASM_VECTOR_LEN;
    wasm.multiply_int_vec(ptr0, len0, ptr1, len1, ptr2, len2, n);
  } finally {
    res.set(getInt32Memory0().subarray(ptr2 / 4, ptr2 / 4 + len2));
    wasm.__wbindgen_free(ptr2, len2 * 4);
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === 'function') {
          try {
              return await WebAssembly.instantiateStreaming(module, imports);

          } catch (e) {
              if (module.headers.get('Content-Type') != 'application/wasm') {
                  console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

              } else {
                  throw e;
              }
          }
      }

      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);

  } else {
      const instance = await WebAssembly.instantiate(module, imports);

      if (instance instanceof WebAssembly.Instance) {
          return { instance, module };

      } else {
          return instance;
      }
  }
}

function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_copy_to_typed_array = function(arg0, arg1, arg2) {
      new Uint8Array(getObject(arg2).buffer, getObject(arg2).byteOffset, getObject(arg2).byteLength).set(getArrayU32FromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
      takeObject(arg0);
  };

  return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachegetUint32Memory0 = null;
    cachegetUint32Memory0 = null;


    return wasm;
}

function initSync(module) {
  if (wasm !== undefined) return wasm;

  const imports = __wbg_get_imports();

  __wbg_init_memory(imports);

  if (!(module instanceof WebAssembly.Module)) {
      module = new WebAssembly.Module(module);
  }

  const instance = new WebAssembly.Instance(module, imports);

  return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
  if (wasm !== undefined) return wasm;

  if (typeof input === 'undefined') {
      input = new URL('multiplyIntVecRust.wasm', import.meta.url);
  }
  const imports = __wbg_get_imports();

  if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
      input = fetch(input);
  }

  __wbg_init_memory(imports);

  const { instance, module } = await __wbg_load(await input, imports);

  return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
