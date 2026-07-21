# Code Quality Rules (SonarQube verification)

This project is analyzed by **SonarCloud Automatic Analysis (AutoScan)**, not
by a locally-run scanner. AutoScan runs automatically on every push and
decorates pull requests with the Quality Gate. The project is
`shiweiumichedu_turtlecharter.com` (org `shiweiumichedu`), configured in
`sonar-project.properties`.

1. You MUST verify all generated code before asking me to push to `main`
   (i.e. before recommending a merge).

2. Do NOT run the `sonar-scanner` CLI on this project. While Automatic
   Analysis is enabled, CLI/CI analysis is blocked by SonarCloud (the
   scanner's `POST /analysis/analyses` returns 404, mislabeled as "Not
   authorized"). Verification happens through AutoScan instead.

3. To verify code, push the working branch and open (or update) a PR. This
   fires the GitHub → SonarCloud webhook and AutoScan analyzes the branch/PR.
   If a push happened during a SonarCloud outage it will NOT be retried —
   trigger a fresh analysis with an empty commit (`git commit --allow-empty`).

4. To read the result, use your SonarQube MCP tools (Quality Gate status) or
   the API with `SONAR_TOKEN` (which I will have exported in the session):
   `GET https://sonarcloud.io/api/qualitygates/project_status?projectKey=shiweiumichedu_turtlecharter.com&pullRequest=<PR#>`.
   Gate conditions apply to **new code**: new_reliability_rating,
   new_security_rating, new_maintainability_rating (all must be A) and
   new_security_hotspots_reviewed (100%).

5. If SonarQube reports bugs or smells, fix them and push again to
   re-analyze. You may attempt a maximum of 3 fix-and-reanalyze cycles.

6. If issues persist after 3 cycles, stop and report the remaining issues
   to me with your analysis of why they are recurring. Do not keep looping.

7. When fixing issues, refactor holistically — do not fix rules one at a
   time in isolation. Consider how your fix affects the broader module
   and component design.

8. If low test coverage is causing a failed quality gate, treat this as a
   blocking issue requiring code generation (unit tests in `tests/`).

9. Only recommend merging when the Quality Gate PASSES.

Note: the `sonar.autoscan.enabled` setting can only be toggled in the
SonarCloud UI (Project → Administration → Analysis Method); the settings API
rejects changes to it. If we ever switch to CI-based analysis, this file must
be updated and the project re-provisioned for CI ingestion.
