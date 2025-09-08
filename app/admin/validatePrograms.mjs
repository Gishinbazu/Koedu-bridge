// admin/validatePrograms.mjs
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'node:fs';
import path from 'node:path';

const schemaPath = path.resolve('data/program.schema.json');
const dataPath = path.resolve('admin/seed/programs.sample.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schema);

const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
let ok = true;

items.forEach((p, i) => {
  const valid = validate(p);
  if (!valid) {
    ok = false;
    console.error(`❌ Invalid program at index ${i} (id: ${p.id || 'N/A'})`);
    console.error(JSON.stringify(validate.errors, null, 2));
  }
});

if (ok) {
  console.log(`✅ ${items.length} program(s) valid.`);
  process.exit(0);
} else {
  console.error('— Validation failed.');
  process.exit(1);
}
