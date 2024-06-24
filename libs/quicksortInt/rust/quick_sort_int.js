let wasm,cachedUint8Memory0=null;function getUint8Memory0(){return null!==cachedUint8Memory0&&0!==cachedUint8Memory0.byteLength||(cachedUint8Memory0=new Uint8Array(wasm.memory.buffer)),cachedUint8Memory0}function getArrayU8FromWasm0(e,t){return e>>>=0,getUint8Memory0().subarray(e/1,e/1+t)}const heap=new Array(128).fill(void 0);function getObject(e){return heap[e]}heap.push(void 0,null,!0,!1);let heap_next=heap.length;function dropObject(e){e<132||(heap[e]=heap_next,heap_next=e)}function takeObject(e){const t=getObject(e);return dropObject(e),t}let cachedUint32Memory0=null;function getUint32Memory0(){return null!==cachedUint32Memory0&&0!==cachedUint32Memory0.byteLength||(cachedUint32Memory0=new Uint32Array(wasm.memory.buffer)),cachedUint32Memory0}let WASM_VECTOR_LEN=0;function passArray32ToWasm0(e,t){const n=t(4*e.length,4)>>>0;return getUint32Memory0().set(e,n/4),WASM_VECTOR_LEN=e.length,n}function addHeapObject(e){heap_next===heap.length&&heap.push(heap.length+1);const t=heap_next;return heap_next=heap[t],heap[t]=e,t}export function quicksort_int(e,t,n){var i=passArray32ToWasm0(e,wasm.__wbindgen_malloc),a=WASM_VECTOR_LEN;wasm.quicksort_int(i,a,addHeapObject(e),t,n)}async function __wbg_load(e,t){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if("application/wasm"==e.headers.get("Content-Type"))throw t;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t)}const n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}{const n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}function __wbg_get_imports(){const e={wbg:{}};return e.wbg.__wbindgen_copy_to_typed_array=function(e,t,n){new Uint8Array(getObject(n).buffer,getObject(n).byteOffset,getObject(n).byteLength).set(getArrayU8FromWasm0(e,t))},e.wbg.__wbindgen_object_drop_ref=function(e){takeObject(e)},e}function __wbg_init_memory(e,t){}function __wbg_finalize_init(e,t){return wasm=e.exports,__wbg_init.__wbindgen_wasm_module=t,cachedUint32Memory0=null,cachedUint8Memory0=null,wasm}function initSync(e){if(void 0!==wasm)return wasm;const t=__wbg_get_imports();return __wbg_init_memory(t),e instanceof WebAssembly.Module||(e=new WebAssembly.Module(e)),__wbg_finalize_init(new WebAssembly.Instance(e,t),e)}async function __wbg_init(e){if(void 0!==wasm)return wasm;void 0===e&&(e=new URL("quick_sort_int_bg.wasm",import.meta.url));const t=__wbg_get_imports();("string"==typeof e||"function"==typeof Request&&e instanceof Request||"function"==typeof URL&&e instanceof URL)&&(e=fetch(e)),__wbg_init_memory(t);const{instance:n,module:i}=await __wbg_load(await e,t);return __wbg_finalize_init(n,i)}export{initSync};export default __wbg_init;