# Version preservation and release record

## Previous public version retained for review

- Instrument: Quick v1.0.
- Web display: v1.2-rc.1 (package version 1.2.0-rc.1).
- Fixed commit: `d470d06d836e529db96fd4d77ce4aaa0a02e6fce`.
- Preservation branch: `archive/web-v1.2-rc.1-review-20261023`.
- Source: https://github.com/shinyu-kise/wpti-quick-web/tree/d470d06d836e529db96fd4d77ce4aaa0a02e6fce
- Production page read back on 2026-10-23: https://wpti-quick-web.vercel.app/

An offline source archive and complete Git history bundle have been retained by the author, with SHA-256 records. The combined local archive covers 26 recorded commits, including unfinished and unpublished states, not 26 formal public releases.

The previous public commit was restored to a new directory from its saved bundle. With Node.js 24.19.0 and npm 10.9.4 on macOS arm64, locked dependency installation, all 13 tests, and a production build passed. The restored home and fictional 30+30+0=60 example were checked in a browser. This is source reconstruction evidence; it does not promise preservation of every hosting setting or every historical deployment.

To inspect the old source without overwriting current work:

```sh
git worktree add --detach ../wpti-quick-web-v1.2-review d470d06d836e529db96fd4d77ce4aaa0a02e6fce
```

Rebuilding or serving this version keeps its original wording and Vercel Analytics integration. No research data, manuscript, participant records, credentials or ethics documents are stored in the public application repository.

## Version and study-period boundaries

The previous version is the public version observed on the submission date. The professional questionnaire (June 19–30), access-count period (June 24–July 17), and implementation history through October 17 refer to their own recorded versions. Do not describe the new dialogue prototype as the version evaluated in those earlier periods.

## New release authorization

On 2026-10-23 the author authorized publishing Web 1.3.0-dialogue-rc.1 after completing remaining display/print checks while preserving the old public version. Quick instrument scoring remains v1.0; dialogue support is 1.0-prototype. Technical QA and public availability do not establish scientific validity, clinical thresholds or demonstrated usefulness.

The pull request and deployment status identify the actual published commit. A source commit, approval, or successful local build alone is not a deployment receipt.

## Dialogue releases retained before Web 1.4.0

- Web `1.3.0-dialogue-rc.1`: fixed commit `acd646b253e673301e7ad6ac837e3706d0568de6`; preservation branch `archive/web-v1.3.0-dialogue-rc.1-20261023`.
- Latest Web `1.3.1-dialogue-rc.1`: fixed commit `052b67bcd9f9a3aa28024b066403c655dd080246`; preservation branch `archive/web-v1.3.1-dialogue-rc.1-20261023`.

Both retain Quick instrument v1.0 and Dialogue 1.0-prototype. These source restoration points are separate from the Web v1.2-rc.1 review archive above; that commit and preservation branch are not overwritten by Web 1.4.0. A preserved source branch identifies reconstructible code, not every historical hosting setting or an independently verified deployment event.

Restore into a separate directory, keeping the current working tree intact:

```sh
git worktree add --detach ../wpti-quick-web-v1.3.0 acd646b253e673301e7ad6ac837e3706d0568de6
git worktree add --detach ../wpti-quick-web-v1.3.1 052b67bcd9f9a3aa28024b066403c655dd080246
```

See [the Web 1.4.0 design record](design-1.4.0.md) for the new interaction changes and their validation limits. Do not attribute those features to the earlier study or submission-date version.
