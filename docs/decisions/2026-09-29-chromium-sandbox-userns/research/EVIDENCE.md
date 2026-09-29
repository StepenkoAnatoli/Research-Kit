# Evidence

One row per fetched page. `Raw` points at the cached page text under `research/raw/`,
which is what makes the claim checkable - a row without raw evidence fails preflight.

The `Finding` cell arrives as an auto-extracted summary. Rewrite it into a real claim:
what the page actually establishes, with the quote or number that proves it.

| ID | Retrieved | Type | URL | Finding | Raw |
|---|---|---|---|---|---|
| E-01 | 2026-09-29 | P | https://ubuntu.com/blog/ubuntu-23-10-restricted-unprivileged-user-namespaces | Ubuntu (Canonical): from 23.10, AppArmor decides per application whether an unprivileged process may create user namespaces; an application needs a profile with the userns rule, and Ubuntu ships such profiles for the programs it surveyed, Chrome among them. [quote: AppArmor can be used to selectively allow and disallow unprivileged user namespaces] [quote: This change impacts some programs like Firefox, Chrome, and many more] | research/raw/2026-09-29-restricted-unprivileged-user-namespaces--ubuntu-74bc0c9c.md |
| E-02 | 2026-09-29 | P | https://raw.githubusercontent.com/chromium/chromium/main/docs/security/apparmor-userns-restrictions.md | Chromium's own doc (the one its 'No usable sandbox!' FATAL points to): Ubuntu's AppArmor profile covers Chrome stable at /opt/google/chrome/chrome only; other builds need the sysctl turned off (disables the feature globally), their own profile, or the setuid helper via CHROME_DEVEL_SANDBOX=/opt/google/chrome/chrome-sandbox (the safest); --no-sandbox disables critical security features and must never be used on the open web. [quote: Ubuntu ships with an AppArmor profile that applies to Chrome stable binaries] [quote: should never be used when browsing the open web] [quote: the setuid sandbox helper (the old version of the sandbox) is available at] | research/raw/2026-09-29-apparmor-userns-restrictions-md-githubusercontent-3b4914a9.md |
