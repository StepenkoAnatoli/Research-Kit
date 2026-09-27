---
url: https://nodejs.org/en/about/previous-releases
retrieved: 2026-09-27
command: firecrawl scrape https://nodejs.org/en/about/previous-releases --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Node.js — Node.js Releases
---
[Skip to content](https://nodejs.org/en/about/previous-releases#main)

# [Node.js Releases](https://nodejs.org/en/about/previous-releases\#nodejs-releases)

Commercial support for versions past the Maintenance LTS phase is available through our [OpenJS Ecosystem Sustainability Program partners](https://nodejs.org/en/about/eol)

Major Node.js versions enter _Current_ release status for six months, which gives library authors time to add support for them.
Historically (up to Node.js 26), odd-numbered releases (9, 11, etc.) become unsupported after six months, and even-numbered releases (10, 12, etc.) move to _Active LTS_ status and are ready for general use.
Starting with Node.js 27, the release cycle will be annual and every major version will move to _LTS_ status after its six-month _Current_ phase (and six additional months of _Alpha_ phase).
_LTS_ release status is "long-term support", which typically guarantees that critical bugs will be fixed for a total of 30 months.
Production applications should only use _Active LTS_ or _Maintenance LTS_ releases.

## [Release Schedule](https://nodejs.org/en/about/previous-releases\#release-schedule)

![Releases](https://raw.githubusercontent.com/nodejs/Release/main/schedule.svg?sanitize=true)

Full details regarding the Node.js release schedule are available [on GitHub](https://github.com/nodejs/release#release-schedule).

## [Looking for the latest release of a version branch?](https://nodejs.org/en/about/previous-releases\#looking-for-the-latest-release-of-a-version-branch)

| Node.js | Codename | First released | Last updated | Status |  |
| --- | --- | --- | --- | --- | --- |
| [v26](https://nodejs.org/en/download/archive/v26.10.0) | - | May 05, 2026 | Sep 21, 2026 | Current | Details |
| [v25](https://nodejs.org/en/download/archive/v25.9.0) | - | Oct 15, 2025 | Mar 31, 2026 | EOL | Details |
| [v24](https://nodejs.org/en/download/archive/v24.21.0) | Krypton | May 06, 2025 | Sep 07, 2026 | LTS | Details |
| [v23](https://nodejs.org/en/download/archive/v23.11.1) | - | Oct 16, 2024 | May 14, 2025 | EOL | Details |
| [v22](https://nodejs.org/en/download/archive/v22.23.3) | Jod | Apr 24, 2024 | Sep 23, 2026 | LTS | Details |
| [v21](https://nodejs.org/en/download/archive/v21.7.3) | - | Oct 17, 2023 | Apr 10, 2024 | EOL | Details |
| [v20](https://nodejs.org/en/download/archive/v20.20.2) | Iron | Apr 17, 2023 | Mar 24, 2026 | EOL | Details |
| [v19](https://nodejs.org/en/download/archive/v19.9.0) | - | Oct 17, 2022 | Apr 10, 2023 | EOL | Details |
| [v18](https://nodejs.org/en/download/archive/v18.20.8) | Hydrogen | Apr 18, 2022 | Mar 27, 2025 | EOL | Details |
| [v17](https://nodejs.org/en/download/archive/v17.9.1) | - | Oct 19, 2021 | Jun 01, 2022 | EOL | Details |
| [v16](https://nodejs.org/en/download/archive/v16.20.2) | Gallium | Apr 20, 2021 | Aug 08, 2023 | EOL | Details |
| [v15](https://nodejs.org/en/download/archive/v15.14.0) | - | Oct 20, 2020 | Apr 06, 2021 | EOL | Details |
| [v14](https://nodejs.org/en/download/archive/v14.21.3) | Fermium | Apr 21, 2020 | Feb 16, 2023 | EOL | Details |
| [v13](https://nodejs.org/en/download/archive/v13.14.0) | - | Oct 22, 2019 | Apr 29, 2020 | EOL | Details |
| [v12](https://nodejs.org/en/download/archive/v12.22.12) | Erbium | Apr 23, 2019 | Apr 05, 2022 | EOL | Details |
| [v11](https://nodejs.org/en/download/archive/v11.15.0) | - | Oct 23, 2018 | Apr 30, 2019 | EOL | Details |
| [v10](https://nodejs.org/en/download/archive/v10.24.1) | Dubnium | Apr 24, 2018 | Apr 06, 2021 | EOL | Details |
| [v9](https://nodejs.org/en/download/archive/v9.11.2) | - | Oct 31, 2017 | Jun 12, 2018 | EOL | Details |
| [v8](https://nodejs.org/en/download/archive/v8.17.0) | Carbon | May 30, 2017 | Dec 17, 2019 | EOL | Details |
| [v7](https://nodejs.org/en/download/archive/v7.10.1) | - | Oct 25, 2016 | Jul 11, 2017 | EOL | Details |
| [v6](https://nodejs.org/en/download/archive/v6.17.1) | Boron | Apr 26, 2016 | Apr 03, 2019 | EOL | Details |
| [v5](https://nodejs.org/en/download/archive/v5.12.0) | - | Oct 29, 2015 | Jun 23, 2016 | EOL | Details |
| [v4](https://nodejs.org/en/download/archive/v4.9.1) | Argon | Sep 08, 2015 | Mar 29, 2018 | EOL | Details |
| [v0](https://nodejs.org/en/download/archive/v0.12.18) | - | Feb 06, 2015 | Feb 22, 2017 | EOL | Details |

## [Official vs. Community Installation Methods](https://nodejs.org/en/about/previous-releases\#official-vs-community-installation-methods)

The Node.js website provides several non-interactive installation methods, including command-line interfaces (CLIs), operating system (OS) package managers (e.g., `brew`), and Node.js version managers (e.g., `nvm`).

To highlight and promote community contributions, the Node.js project introduced a revised Downloads page categorizing installation methods as either “Official” or “Community.” This provides users with increased flexibility and choice. To ensure clarity, we’ve defined criteria for each category.

### [Official Installation Methods](https://nodejs.org/en/about/previous-releases\#official-installation-methods)

Installation methods designated as “Official” must meet the following requirements:

| Requirements (Official Installation Methods) |
| --- |
| New Node.js releases must be available simultaneously with the official release. |
| Project maintainers must have a close relationship with the Node.js project, including direct communication channels. |
| Installation method must download official binaries bundled by the Node.js project. |
| Installation method must not build from source when pre-built binaries are available, nor should it alter the official binaries. |

### [Community Installation Methods](https://nodejs.org/en/about/previous-releases\#community-installation-methods)

Community installation methods included on the self-service download page (located at /download) must also adhere to a minimum set of criteria:

- **Version Support:** Must support all currently supported, non-End-of-Life (EOL) Node.js versions.
- **OS Compatibility:** Must function on at least one officially supported Operating System (OS).
- **Broad OS Support:**Cannot be limited to a subset of OS distributions or versions.

  - For example, an installation method claiming compatibility with “Windows” must function on “Windows 10”, “Windows 11”, and all their editions (including server versions).
  - Similarly, an installation method claiming compatibility with “Linux” must be installable on all major Linux distributions, not just a specific subset. It cannot rely on distribution-specific package managers like `apt` or `dnf`.
- **Free and Open Source:** Must be free to use and open source, must not be sold as a commercial product, and must not be a paid service.
