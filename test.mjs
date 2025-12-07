import p from './pack.mjs';
const { bool, bits, float, varint, string, blob, date, array, selectOne, selectMany, Pack } = p;

export const logs = [];
const log = (...msg) => console.log(...msg) || logs.push(msg);

const data = Array.from({ length: 32 }).map((x, i) => i);

const tests = [
	{ schema: bool, data: true },
	{ schema: bool, data: false },
	...Array.from({ length: 32 }).map((x, i) => ({ schema: bits(i + 1), data: 2**(i + 1) - 1 })),
	{ schema: bits(8), data: 255 },
	{ schema: bits(32), data: 4294967295 },
	{ schema: string, data: 'str' },
	{ schema: string([ 'str1', 'str2' ]), data: 'str2' },
	//{ schema: float(32), data: 1.33 },
	//{ schema: float(64), data: 12345678.901234 },
	{ schema: blob, data: new Uint8Array([ 0, 1 ]) },
	{ schema: blob(3), data: new Uint8Array([ 0, 1, 2 ]) },
	...Array.from({ length: 32 }).map((x, i) => ({ schema: array(bits(i + 1)), data })),
	{ schema: selectOne({ s1: null, s2: bits(3) }), data: { s2: 3 } },
	{ schema: selectMany({ s1: null, s2: bits(3) }), data: { s2: 3 } },
];
tests.push({
	schema: tests.reduce((obj, t, i) => (obj[i] = t.schema, obj), {}),
	data: tests.reduce((obj, t, i) => (obj[i] = t.data, obj), {})
});
tests.push(
	...tests.map(t => ({ schema: array(t.schema), data: [ t.data, t.data ] })),
	...tests.map(t => ({ schema: array(t.schema, 3), data: [ t.data, t.data, t.data ] }))
);
tests.push({
	schema: tests.reduce((obj, t, i) => (obj[i] = t.schema, obj), {}),
	data: tests.reduce((obj, t, i) => (obj[i] = t.data, obj), {})
});
tests.push({
	schema: selectMany({ s1: bool, s2: tests.slice(-1)[0].schema }),
	data: { s2: tests.slice(-1)[0].data }
});
for (let x = 1; x <= 1_073_741_823; x*=2) tests.push({ schema: varint, data: x });

// run tests
let fail;
tests.forEach((t, i) => {
	if (fail) return;
	const json = JSON.stringify(t.schema);
	const { encode, decode } = Pack(json);
	log('');
	log('TEST', i + 1);
	log('schema:', json);
	log('data:', JSON.stringify(t.data));
	try {
		var buf = encode(t.data);
		log('buf:', buf);
		var result = decode(buf);
		log('result:', JSON.stringify(result));
	} catch (e) {
		log('');
		log('FAIL:');
		log(e.stack);
		fail = true;
		return;
	}
	if (JSON.stringify(result) == JSON.stringify(t.data)) return;
	log('');
	log('FAIL:');
	log('data:', JSON.stringify(t.data));
	log('result:', result);
	log('result:', JSON.stringify(result));
	log('');
	fail = true;
});
if (!fail) {
	log('');
	log('ALL TESTS PASSED');
	log('');
}
