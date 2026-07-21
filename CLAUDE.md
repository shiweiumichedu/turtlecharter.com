# Code Quality Rules (SonarQube verification)

1. You MUST verify all generated code before asking me to push.

2. To verify code, run the `sonar-scanner` command from the repo root.
   The project is configured in `sonar-project.properties`
   (projectKey: shiweiumichedu_turtlecharter.com).

3. When running the scanner, use the `SONAR_TOKEN`, which I will have
   exported in the session.

4. After scanning, use your SonarQube MCP tools to check the Quality Gate
   status or read the scanner output to identify issues.

5. If SonarQube reports bugs or smells, fix them and re-scan. You may
   attempt a maximum of 3 fix-scan cycles.

6. If issues persist after 3 cycles, stop and report the remaining issues
   to me with your analysis of why they are recurring. Do not keep looping.

7. When fixing issues, refactor holistically — do not fix rules one at a
   time in isolation. Consider how your fix affects the broader module
   and component design.

8. If low test coverage is causing a failed quality gate, treat this as a
   blocking issue requiring code generation (unit tests in `tests/`).

9. Only recommend pushing when the Quality Gate PASSES.