import { statSync } from 'node:fs';
import { resolve } from 'node:path';

const budgets = [
    ['dist/styles/orcestr-ui.css', 150 * 1024],
    ['dist/example/styles.css', 48 * 1024],
];

let failed = false;
for (const [relativePath, budget] of budgets) {
    const path = resolve(relativePath);
    const size = statSync(path).size;
    if (size > budget) {
        console.error(`${relativePath}: ${size} bytes exceeds the ${budget}-byte budget.`);
        failed = true;
    } else {
        console.log(`${relativePath}: ${size}/${budget} bytes`);
    }
}

if (failed) process.exit(1);
