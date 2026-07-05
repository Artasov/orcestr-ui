# Security Policy

## Supported Versions

Security fixes are handled on the default branch until the first stable versioned release.

## Reporting a Vulnerability

Do not open a public issue for vulnerabilities.

Report security issues privately to the maintainer through GitHub.

Include:

- affected package version or commit;
- affected component, provider, hook or package entrypoint;
- what an attacker can do;
- whether user input, tokens, private URLs or application data can be exposed;
- a minimal reproduction if possible.

## UI Safety

Orcestr UI should not store secrets, tokens or private application data.

Be careful with changes that affect:

- links and external navigation;
- rendered HTML or user-provided content;
- clipboard behavior;
- file inputs and media previews;
- overlays, focus traps and keyboard handling;
- package build output and release automation.
