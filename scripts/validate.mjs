import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(resolve(root, 'README.md'), 'utf8');
const targets = [...readme.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
let checked = 0;
for (const target of new Set(targets)) {
  if (/^(?:https?:|#)/.test(target)) continue;
  await access(resolve(root, target.split('#')[0]));
  checked++;
}
assert.ok(checked > 0, 'README must link to local snippets');
console.log(`Validated ${checked} local README links.`);

// --list loads specs and config without invoking tests, hooks or browser fixtures.
const require = createRequire(import.meta.url);
const result = spawnSync(process.execPath, [
  require.resolve('@playwright/test/cli'), 'test', '--list',
], { cwd: root, encoding: 'utf8' });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
assert.equal(result.status, 0, 'Playwright discovery failed');
