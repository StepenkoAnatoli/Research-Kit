# Sources

Every page this project has fetched, and what it was used for. `P` primary/official
carries the design, `S` secondary is context, `L` lead-only is a hint and never proof.

| URL | Type | Title | Retrieved | Used for |
|---|---|---|---|---|
| https://github.com/nodejs/node/blob/v22.22.0/doc/api/fs.md?plain=1 | P | node/doc/api/fs.md at v22.22.0 · nodejs/node · GitHub | 2026-10-07 | U-02 (the copy overwrites an existing destination by default; COPYFILE_EXCL is what makes it fail) and U-01 (what the page does and does not say about the destination's permissions) |
| https://github.com/nodejs/node/blob/v22.22.0/deps/uv/docs/src/fs.rst?plain=1 | P | node/deps/uv/docs/src/fs.rst at v22.22.0 · nodejs/node · GitHub | 2026-10-07 | U-01, U-02: uv_fs_copyfile is the layer that performs the copy; its flags and its documented default decide what the deploy's second run does |
| https://github.com/nodejs/node/blob/v22.22.0/doc/node.1?plain=1 | P | node/doc/node.1 at v22.22.0 · nodejs/node · GitHub | 2026-10-07 | U-03: NODE_EXTRA_CA_CERTS - what it extends, the missing/malformed-file behaviour, and that it is read only at process launch |
