import {spawnSync} from "node:child_process";
import {readdirSync, statSync} from "node:fs";
import {dirname, join, relative} from "node:path";
import {fileURLToPath} from "node:url";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const sourceDir = join(rootDir, "src");

function walk(dir) {
    return readdirSync(dir)
        .flatMap((entry) => {
            const path = join(dir, entry);
            const stat = statSync(path);

            if (stat.isDirectory()) return walk(path);
            if (stat.isFile() && path.endsWith(".test.mts")) return [path];
            return [];
        });
}

const testFiles = walk(sourceDir)
    .map((path) => relative(rootDir, path))
    .sort();

if (testFiles.length === 0) {
    console.error("No test files found.");
    process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
    cwd: rootDir,
    stdio: "inherit",
});

process.exit(result.status ?? 1);
