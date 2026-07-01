import {spawnSync} from "node:child_process";
import {existsSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = resolve(rootDir, "package.json");
const packageLockPath = resolve(rootDir, "package-lock.json");
const tagPrefix = "ui-v";

class ReleaseError extends Error {}

function runCommand(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: options.cwd ?? rootDir,
        encoding: "utf8",
        shell: options.shell ?? false,
        stdio: options.captureOutput ? "pipe" : "inherit",
    });

    if (result.error) {
        throw new ReleaseError(result.error.message);
    }

    if (result.status !== 0 && options.check !== false) {
        throw new ReleaseError(`${command} ${args.join(" ")} failed`);
    }

    return result;
}

function git(args, options = {}) {
    return runCommand("git", args, options);
}

function npm(args, options = {}) {
    const npmCliPath = npmCli();

    if (npmCliPath) {
        return runCommand(process.execPath, [npmCliPath, ...args], options);
    }

    return runCommand(
        process.platform === "win32" ? "npm.cmd" : "npm",
        args,
        {...options, shell: process.platform === "win32"},
    );
}

function npmCli() {
    const candidates = [
        process.env.npm_execpath,
        process.platform === "win32"
            ? resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js")
            : resolve(dirname(process.execPath), "../lib/node_modules/npm/bin/npm-cli.js"),
    ].filter(Boolean);

    return candidates.find((path) => existsSync(path));
}

function readPackageJson() {
    return JSON.parse(readFileSync(packageJsonPath, "utf8"));
}

function writeJson(path, data) {
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function bumpVersion(version, part) {
    const [major, minor, patch] = version.split(".").map((item) => Number.parseInt(item, 10));

    if ([major, minor, patch].some((item) => Number.isNaN(item))) {
        throw new ReleaseError(`Unsupported package version: ${version}`);
    }

    if (part === "patch") {
        return `${major}.${minor}.${patch + 1}`;
    }

    if (part === "minor") {
        return `${major}.${minor + 1}.0`;
    }

    if (part === "major") {
        return `${major + 1}.0.0`;
    }

    throw new ReleaseError(`Unsupported release part: ${part}`);
}

function checkWorktreeIsClean() {
    const result = git(["status", "--short"], {captureOutput: true});

    if (result.stdout.trim()) {
        throw new ReleaseError("Git worktree is not clean. Commit or stash changes before release.");
    }
}

function checkTagDoesNotExist(tagName) {
    const result = git(
        ["rev-parse", "-q", "--verify", `refs/tags/${tagName}`],
        {captureOutput: true, check: false},
    );

    if (result.status === 0) {
        throw new ReleaseError(`Git tag ${tagName} already exists.`);
    }
}

function writeVersion(version) {
    const packageJson = readPackageJson();
    packageJson.version = version;
    writeJson(packageJsonPath, packageJson);

    const packageLock = JSON.parse(readFileSync(packageLockPath, "utf8"));
    packageLock.version = version;

    if (packageLock.packages?.[""]) {
        packageLock.packages[""].version = version;
    }

    writeJson(packageLockPath, packageLock);
}

function release(part, options) {
    const currentVersion = readPackageJson().version;
    const nextVersion = bumpVersion(currentVersion, part);
    const tagName = `${tagPrefix}${nextVersion}`;

    console.log(`Package: @orcestr/ui`);
    console.log(`Current version: ${currentVersion}`);
    console.log(`Next version: ${nextVersion}`);
    console.log(`Tag: ${tagName}`);

    if (options.dryRun) {
        console.log("Dry run mode. No files or git objects were changed.");
        return;
    }

    checkWorktreeIsClean();
    checkTagDoesNotExist(tagName);
    writeVersion(nextVersion);
    npm(["install", "--package-lock-only"]);
    git(["add", "package.json", "package-lock.json"]);
    git(["commit", "-m", `chore: release @orcestr/ui ${tagName}`]);
    git(["tag", tagName]);

    if (options.push) {
        git(["push"]);
        git(["push", "origin", tagName]);
        console.log(`Release ${tagName} was pushed.`);
        return;
    }

    console.log("Release commit and tag were created locally.");
    console.log("Run these commands when you are ready to publish:");
    console.log("  git push");
    console.log(`  git push origin ${tagName}`);
}

function main() {
    const [, , part, ...flags] = process.argv;
    const allowedParts = new Set(["patch", "minor", "major"]);

    if (!allowedParts.has(part)) {
        throw new ReleaseError("Usage: node scripts/release.mjs <patch|minor|major> [--push] [--dry-run]");
    }

    release(part, {
        dryRun: flags.includes("--dry-run"),
        push: flags.includes("--push"),
    });
}

try {
    main();
} catch (error) {
    console.error(`Release error: ${error.message}`);
    process.exit(1);
}
