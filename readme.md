# PackBytes

- Binary data encoder + decoder for JavaScript
- Create the smallest possible encoding for a given Schema
- Send compact data to browser clients - 5x to 50x smaller than JSON

# API

```js
import p from './pack.mjs';

const { bool, bits, float, varint, string, blob, date, array, selectOne, selectMany, Pack } = p;

// All available data types:
type = bool // true or false
type = bits(x) // x number of bits 1-32 for unsigned integer, max int = 2**x - 1
type = float(x) // 16, 32, or 64 bit floating point number
type = varint // variable length integer, max int = 1_073_741_823
type = string // string, max length = 1_073_741_823
type = blob // buffer, max length = 1_073_741_823
type = blob(x) // specific byte size buffer 
type = date // 32 bit javascript Date, 1 second accuracy with year range 1884 to 2106
type = array(type) // array of any type, max length = 1_073_741_823
type = array(type, length) // specific length array
type = selectOne({ field1: type, field2: type, .. }) // object with a single active field
type = selectMany({ field1: type, field2: type, .. }) // object with multiple optional fields
type = { field1: type, field2: type, .. } // object with all fields
type = null // takes up no space

// Create a schema with any combination of types, usually with
// object, array, selectOne, or selectMany as base type:
schema = type

// Create Encoder/Decoder by providing schema or JSON.stringify(schema):
const { encode, decode } = Pack(schema)
const { encode, decode } = Pack(JSON.stringify(schema))

// Encode data to buffer:
buf = encode(data)

// Decode data from buffer, returns original data:
data = decode(buf)
```
 