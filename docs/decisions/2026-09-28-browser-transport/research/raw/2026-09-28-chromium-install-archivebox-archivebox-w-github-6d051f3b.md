---
url: https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install
retrieved: 2026-09-28
command: firecrawl scrape https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install --only-main-content --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: Chromium Install · ArchiveBox/ArchiveBox Wiki · GitHub
---
[Skip to content](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install) to refresh your session.Dismiss alert

{{ message }}

[ArchiveBox](https://github.com/ArchiveBox)/ **[ArchiveBox](https://github.com/ArchiveBox/ArchiveBox)** Public

- Sponsor







# Sponsor ArchiveBox/ArchiveBox























##### GitHub Sponsors

[Learn more about Sponsors](https://github.com/sponsors)







[![@ArchiveBox](https://avatars.githubusercontent.com/u/74894248?s=80&v=4)](https://github.com/ArchiveBox)



[ArchiveBox](https://github.com/ArchiveBox)



[ArchiveBox](https://github.com/ArchiveBox)



[Sponsor](https://github.com/sponsors/ArchiveBox)











[![@pirate](https://avatars.githubusercontent.com/u/511499?s=80&v=4)](https://github.com/pirate)



[pirate](https://github.com/pirate)



[pirate](https://github.com/pirate)



[Sponsor](https://github.com/sponsors/pirate)









##### External links









[https://donate.archivebox.io](https://donate.archivebox.io/)











[https://swag.archivebox.io](https://swag.archivebox.io/)









[Learn more about funding links in repositories](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository).




[Report abuse](https://github.com/contact/report-abuse?report=ArchiveBox%2FArchiveBox+%28Repository+Funding+Links%29)

- [Notifications](https://github.com/login?return_to=%2FArchiveBox%2FArchiveBox) You must be signed in to change notification settings
- [Fork\\
1.6k](https://github.com/login?return_to=%2FArchiveBox%2FArchiveBox)
- [Star\\
28.6k](https://github.com/login?return_to=%2FArchiveBox%2FArchiveBox)


# Chromium Install

[Jump to bottom](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#wiki-pages-box)

Nick Sweeting edited this page last weekSep 19, 2026
·
[78 revisions](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install/_history)

# Chrome / Chromium Setup

[Permalink: Chrome / Chromium Setup](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#chrome--chromium-setup)

ArchiveBox resolves Chrome through `abxpkg`, just like every other runtime binary. It checks compatible browsers already installed on the host first. When it finds one, it projects that exact browser into the managed runtime environment; otherwise it installs a compatible managed Chromium build.

```
archivebox install chrome
archivebox version
```

The resolved browser is always available through `./lib/env/bin/chromium` inside the collection. `archivebox version` shows whether it came from the host or a managed provider, along with the exact version and path.

If you need to select a specific compatible browser already installed on the host, set `CHROME_BINARY` and let the same installer validate and project it:

```
archivebox config --set CHROME_BINARY=google-chrome
archivebox install chrome
archivebox version
```

## Troubleshooting Chromium Install

[Permalink: Troubleshooting Chromium Install](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#troubleshooting-chromium-install)

If you encounter problems setting up Google Chrome or Chromium, see the [Troubleshooting](https://github.com/ArchiveBox/ArchiveBox/wiki/Troubleshooting#chromiumgoogle-chrome) page.

* * *

# Setting Up a Chromium User Profile

[Permalink: Setting Up a Chromium User Profile](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#setting-up-a-chromium-user-profile)

You may choose to set up a Chrome/Chromium user profile in order to use your cookies/sessions to log into sites behind authentication/paywall during archiving.

_Note: not all extractors use Chrome (e.g. `wget`, `mercury`, `media`). Importing a dedicated host browser profile into a persona also exports its cookies for those extractors; directly logging in through a new ArchiveBox Chrome profile does not._

Warning

**We strongly recommend you use [separate burner credentials dedicated to archiving](https://docs.sweeting.me/s/cookie-dilemma),** e.g. don't provide cookies for your normal daily Facebook/Instagram/Google/etc. accounts as server responses and page content will often contain your name/email/PII, session cookies, private tokens, etc. which then get preserved in your snapshots for eternity.

Future viewers of your archive may be able to use any reflected archived session tokens to log in as you, or at the very least, associate the content with your real identity. Even if this tradeoff seems acceptable now or you plan to keep your archive data private, you may want to share a snapshot with others in the future, and snapshots are very hard to sanitize/anonymize after-the-fact!

For this reason, it's best to set up dedicated fake profile accounts for each site you want to archive, and consider them burned if you ever share any of your archived snapshots of those sites with untrusted people.

### Docker VNC Setup

[Permalink: Docker VNC Setup](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#docker-vnc-setup)

If using ArchiveBox in Docker, the easiest way to set up session credentials is by remote controlling the ArchiveBox Chrome browser over VNC, and using it to log in to the sites you want to save.

1. Enable the `novnc` server using these settings in your `docker-compose.yml`:

`docker-compose.yml`:

```
services:
    archivebox:
        ...
        volumes:
            ...
        environment:
            - DISPLAY=novnc:0.0

    novnc:
        image: theasp/novnc:latest
        environment:
            - DISPLAY_WIDTH=1920
            - DISPLAY_HEIGHT=1080
            - RUN_XTERM=no
        ports:
            - "8080:8080"
```

2. Start the `novnc` window server container

```
docker compose up -d novnc
# wait a few seconds for novnc to start...
```

3. Start ArchiveBox's Chrome inside Docker

```
docker compose run --rm archivebox persona create personal
docker compose run --rm archivebox /data/lib/env/bin/chromium --user-data-dir=/data/personas/personal/chrome_profile --profile-directory=Default --disable-gpu --disable-features=dbus --disable-dev-shm-usage --start-maximized --no-sandbox --disable-setuid-sandbox --no-zygote --disable-sync --no-first-run
```

(make sure you set `DISPLAY` and keep the normal persistent `/data` volume from the Compose setup!)

4. Open [`http://localhost:8080/vnc.html`](http://localhost:8080/vnc.html) in your browser. You should see a remote linux desktop shown with Chrome open, allowing you to remote-control ArchiveBox's browser. Use it to log into any sites where you want to save credentials.

5. ✅ Close the browser, stop & remove novnc, and then select the `personal` persona when archiving. Chrome-based extractors will use the saved profile and should see the sites as logged in.


```
# stop the archivebox and novnc containers
docker compose down
docker compose down --remove-orphans
# edit docker-compose.yml to remove/comment out the novnc: section

# test it all out by archiving something hosted on one of the domains you logged in to
docker compose run --rm archivebox add --persona=personal 'https://private.example.com/some/site/requiring/login.html'
# check the SingleFile, Screenshot, DOM, or PDF snapshot output (only these use the Chrome profile)
# make sure the content appears as your logged-in user would see it
```

Under the hood this uses [Xvfb](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml) \+ [Fluxbox](http://www.fluxbox.org/) \+ [`novnc`](https://github.com/theasp/docker-novnc) to provide a virtual display, window manager, and VNC server + novnc websocket viewer.

### Non-Docker Setup (Local Host)

[Permalink: Non-Docker Setup (Local Host)](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#non-docker-setup-local-host)

If running ArchiveBox on your local machine without Docker, this process is fairly easy.

First, create a persona to hold the dedicated Chrome profile.

```
archivebox persona create personal
```

Then install/resolve Chrome and launch the projected browser with that profile dir:

```
archivebox install chrome
./lib/env/bin/chromium --user-data-dir="$PWD/personas/personal/chrome_profile"
```

Once it's open, log in to all the sites you want to be logged in to for archiving, then close/quit Chrome.

✅ Chrome-based extractors (e.g. Screenshot, PDF, DOM, Singlefile) use that profile whenever you archive with `--persona=personal`.

Directly logging in through this profile does not generate a `cookies.txt` for non-Chrome extractors. If those extractors need the same login state, use the recommended [`archivebox persona create --import=chrome personal`](https://github.com/ArchiveBox/ArchiveBox/wiki/Personas) workflow with a dedicated host browser profile instead; the import copies the Chrome profile and exports its cookies together.

### Non-Docker Setup (Remote Host)

[Permalink: Non-Docker Setup (Remote Host)](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#non-docker-setup-remote-host)

You must set up the profile using the exact same version of Chrome that ArchiveBox is running. Run `archivebox install chrome` and `archivebox version` on each machine so `abxpkg` selects and validates the browser.

**General steps:**

1. Make sure you are running the same OS and have the same version of Chrome installed as the host running ArchiveBox
2. Follow the `Non-Docker Setup (Local Host)` steps above to create the `personal` persona and Chrome profile locally
3. Create the same persona from the ArchiveBox data directory on the remote host: `archivebox persona create personal`
4. Rsync the persona's Chrome profile from your local collection into the matching remote persona: `rsync --archive ~/archivebox/data/personas/personal/chrome_profile/ remotehost:~/archivebox/data/personas/personal/chrome_profile/`

You may need to run `chown -R archivebox ~/archivebox/data/personas/personal/chrome_profile` on the remote host to make the profile editable by the `archivebox` user on that machine.

✅ Chrome-based extractors (e.g. Screenshot, PDF, DOM, Singlefile) use that profile whenever you archive with `--persona=personal`.

If non-Chrome extractors need the same login state, prefer importing a dedicated host browser profile with `archivebox persona create --import=chrome personal` so the persona receives both the Chrome profile and an exported `cookies.txt`.

* * *

## More Info & Troubleshooting

[Permalink: More Info & Troubleshooting](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#more-info--troubleshooting)

- [https://github.com/ArchiveBox/ArchiveBox/issues/952](https://github.com/ArchiveBox/ArchiveBox/issues/952)
- [https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview#archiving-private-content](https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview#archiving-private-content)
- [https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview#%EF%B8%8F-things-to-watch-out-for-%EF%B8%8F](https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview#%EF%B8%8F-things-to-watch-out-for-%EF%B8%8F)
- [https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview#publishing](https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview#publishing)
- [https://plugins.archivebox.io/#chrome](https://plugins.archivebox.io/#chrome) (CHROME\_USER\_DATA\_DIR, CHROME\_BINARY, etc.)
- [https://github.com/ArchiveBox/ArchiveBox/wiki/Configuration#cookies\_file](https://github.com/ArchiveBox/ArchiveBox/wiki/Configuration#cookies_file)

[✏️ Help improve our documentation...](https://github.com/ArchiveBox/ArchiveBox/issues/new?template=3-documentation_change.yml)

![](https://camo.githubusercontent.com/37d166331e5a3b56dad04cae9c5bfaaa7042f811daa8cab543454055d49ad2f8/68747470733a2f2f696d6775722e7a6572766963652e696f2f38793668765a612e706e67)

[![](https://private-user-images.githubusercontent.com/511499/294299399-acffcee3-d1ec-439d-8278-e481101c3d0d.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTA2MzE1NTcsIm5iZiI6MTc5MDYzMTI1NywicGF0aCI6Ii81MTE0OTkvMjk0Mjk5Mzk5LWFjZmZjZWUzLWQxZWMtNDM5ZC04Mjc4LWU0ODExMDFjM2QwZC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwOTI4JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDkyOFQyMTM0MTdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT01YzQ4MTM0YjE1YzdlZWI4ODEyNzdmMGI3NjRmMTYyYjA5ODliYzhjMTQwZjRmOWVjMWYwZmYyZTI2MzQ0MDc3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZwbmcifQ.vEzxpjstLZvzBBaXF4fLuCqPflZbAeIYXmnNE_c42zc)](https://github.com/ArchiveBox/ArchiveBox/wiki/Home)

# [Getting Started](https://github.com/ArchiveBox/ArchiveBox/wiki/Quickstart)

[Permalink: Getting Started](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#getting-started)

- 🔢 [Quickstart](https://github.com/ArchiveBox/ArchiveBox/wiki/Quickstart)
- 🖥️ [Install](https://github.com/ArchiveBox/ArchiveBox/wiki/Install)
- 🐳 [Docker](https://github.com/ArchiveBox/ArchiveBox/wiki/Docker)
- ➡️ [Supported Sources](https://github.com/ArchiveBox/ArchiveBox/wiki/Quickstart#2-get-your-list-of-urls-to-archive)
- ⬅️ [Supported Outputs](https://github.com/ArchiveBox/ArchiveBox#output-formats)

# [Usage](https://github.com/ArchiveBox/ArchiveBox/wiki/Usage)

[Permalink: Usage](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#usage)

- ﹩ [Command Line](https://github.com/ArchiveBox/ArchiveBox/wiki/Usage#cli-usage)
- 🌐 [Web UI](https://github.com/ArchiveBox/ArchiveBox/wiki/Usage#ui-usage)
- 🧩 [Browser Extension](https://github.com/ArchiveBox/ArchiveBox/wiki/Usage#browser-extension-usage)
- 👾 [REST API](https://github.com/ArchiveBox/ArchiveBox/issues/496#issuecomment-2080174235) / [Webhooks](https://github.com/ArchiveBox/ArchiveBox/pull/1418)
- 📸 [UI Screenshots](https://github.com/ArchiveBox/ArchiveBox/wiki/Screenshots)
- 📜 [Python API](https://docs.archivebox.io/dev/apidocs/index.html) / [REPL](https://github.com/ArchiveBox/ArchiveBox/wiki/Usage#python-shell-usage) / [SQL API](https://github.com/ArchiveBox/ArchiveBox/wiki/Usage#sql-shell-usage)

# Reference

[Permalink: Reference](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#reference)

- ⚙️ [Configuration](https://github.com/ArchiveBox/ArchiveBox/wiki/Configuration)
- 📦 [Dependencies](https://github.com/ArchiveBox/ArchiveBox#dependencies)
- 💿 [Disk Layout](https://github.com/ArchiveBox/ArchiveBox#archive-layout)
- 🔒 [Security Overview](https://github.com/ArchiveBox/ArchiveBox/wiki/Security-Overview)
- 📝 [Developer Documentation](https://github.com/ArchiveBox/ArchiveBox#archivebox-development)

# Guides

[Permalink: Guides](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#guides)

- [Upgrading](https://github.com/ArchiveBox/ArchiveBox/wiki/Upgrading)
- [Setting up Storage](https://github.com/ArchiveBox/ArchiveBox/wiki/Setting-Up-Storage) (NFS/SMB/S3/etc)

- [Setting up Authentication](https://github.com/ArchiveBox/ArchiveBox/wiki/Setting-up-Authentication) (SSO/LDAP/etc)

- [Setting up Search](https://github.com/ArchiveBox/ArchiveBox/wiki/Setting-up-Search) (rg/sonic/etc)

- [Scheduled Archiving](https://github.com/ArchiveBox/ArchiveBox/wiki/Scheduled-Archiving)
- [Publishing Your Archive](https://github.com/ArchiveBox/ArchiveBox/wiki/Publishing-Your-Archive)
- [Chromium Install](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install)
- [Cookies & Sessions Setup](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#setting-up-a-chromium-user-profile)
- [Merging Collections](https://github.com/ArchiveBox/ArchiveBox/wiki/Merging-Collections)
- [Troubleshooting](https://github.com/ArchiveBox/ArchiveBox/wiki/Troubleshooting)

# More Info

[Permalink: More Info](https://github.com/ArchiveBox/ArchiveBox/wiki/Chromium-Install#more-info)

- ⭐️ [Web Archiving Community](https://github.com/ArchiveBox/ArchiveBox/wiki/Web-Archiving-Community)
- [Background & Motivation](https://github.com/ArchiveBox/ArchiveBox#background--motivation)
- [Comparison to Other Tools](https://github.com/ArchiveBox/ArchiveBox#comparison-to-other-projects)
- [Architecture Diagram](https://github.com/ArchiveBox/ArchiveBox/wiki/ArchiveBox-Architecture-Diagrams)
- [Changelog](https://github.com/ArchiveBox/ArchiveBox/releases) & [Roadmap](https://github.com/ArchiveBox/ArchiveBox/wiki/Roadmap)

* * *

[![](https://private-user-images.githubusercontent.com/511499/294299947-fd4d3161-3860-4b31-a4e9-251c05f75cdf.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTA2MzE1NTcsIm5iZiI6MTc5MDYzMTI1NywicGF0aCI6Ii81MTE0OTkvMjk0Mjk5OTQ3LWZkNGQzMTYxLTM4NjAtNGIzMS1hNGU5LTI1MWMwNWY3NWNkZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwOTI4JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDkyOFQyMTM0MTdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02ZDE0ODMxMmZlZjM4Nzk2NjZjN2U2ZjQ5MWYxYjMyZjJkYTM1ZjkzMDZmNDk1ZjgxMzVlOTRiZTEyMWRmN2UyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZwbmcifQ.bTQ4c_UihXb0NDiuSQrL61PZWeAOhi2slf0tr3uXVKE)](https://archivebox.io/)

[![](https://camo.githubusercontent.com/9c31b0413289bed9283599fc577ebc244d961d56691ab0f639db67fab1a53702/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f41726368697665426f782f41726368697665426f782e7376673f6c6f676f3d676974687562266c6162656c3d5374617273266c6f676f436f6c6f723d626c7565)](https://github.com/ArchiveBox/ArchiveBox)[![](https://camo.githubusercontent.com/71f0042cf5b1e9360ad1340cd0c56a650ed0474340e0deeb8368c5a4711ff1a2/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d657263682d2532333930333835312e737667)](https://archivebox-shop.fourthwall.com/)

[![](https://camo.githubusercontent.com/945af403d82c6728486305e4897ec0de10ef213ec9284c2a6ac30c5e9ce87baa/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4469726563746c792d2531334445354432362e737667)](https://hcb.hackclub.com/donations/start/archivebox)[![](https://camo.githubusercontent.com/b283cda5ebf3169f54bc33767fe263ae2cb6a158ff6120fb9e58bb611b410fcd/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4769746875625f53706f6e736f72732d2532334237434446452e737667)](https://github.com/sponsors/pirate)

[![](https://camo.githubusercontent.com/e36bcd9c733c5d8856b820f5985ddf4e1141c55c46499141805685ad3f15e268/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f436f6d6d756e6974795f436861745f466f72756d2d5a756c69702d2532333238413734352e737667)](https://zulip.archivebox.io/)

### Clone this wiki locally

You can’t perform that action at this time.
