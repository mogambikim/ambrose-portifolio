import { cp, mkdir, rm } from 'node:fs/promises';

const output = new URL('./dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of ['index.html', 'styles.css', 'script.js', 'site-config.js', 'assets', 'README.md', 'vercel.json']) {
  try { await cp(new URL(`./${entry}`, import.meta.url), new URL(`./dist/${entry}`, import.meta.url), { recursive: true }); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
console.log('Static portfolio built in dist/.');
