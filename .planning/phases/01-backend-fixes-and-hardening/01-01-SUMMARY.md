---
phase: 01-backend-fixes-and-hardening
plan: 01
subsystem: testing, api
tags: [pytest, pydantic-settings, cors, env-config]

# Dependency graph
requires: []
provides:
  - "Working pytest infrastructure for backend tests"
  - "Environment-driven CORS configuration via CORS_ORIGINS env var"
  - ".env.example documenting all backend environment variables"
affects: [01-backend-fixes-and-hardening, 07-devops-and-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "pydantic-settings with SettingsConfigDict for env file auto-loading"
    - "Union[str, list[str]] type with field_validator for comma-separated env var parsing"

key-files:
  created:
    - "tokenizer-visualizer/backend/pytest.ini"
    - "tokenizer-visualizer/backend/conftest.py"
    - "tokenizer-visualizer/backend/.env.example"
  modified:
    - "tokenizer-visualizer/backend/config.py"

key-decisions:
  - "Used Union[str, list[str]] type annotation to work around pydantic-settings JSON parsing of list env vars"
  - "Belt-and-suspenders approach: both pytest.ini pythonpath and conftest.py sys.path insertion for import resolution"

patterns-established:
  - "pytest.ini with pythonpath=. for backend test import resolution"
  - "SettingsConfigDict with env_file='.env' for all backend settings"

# Metrics
duration: 4min
completed: 2026-03-09
---

# Phase 1 Plan 01: Fix Test Infrastructure & CORS Config Summary

**pytest import resolution via pythonpath + conftest.py, and env-driven CORS origins with pydantic-settings field_validator**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-09T07:31:50Z
- **Completed:** 2026-03-09T07:36:16Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- All 5 existing backend tests now pass without ModuleNotFoundError
- CORS origins are configurable via CORS_ORIGINS environment variable (comma-separated)
- .env.example documents all 5 environment variables (CORS_ORIGINS, HOST, PORT, LOG_LEVEL, HF_HOME)

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix pytest import resolution (BFIX-01)** - `6e1b569` (feat)
2. **Task 2: Environment-driven CORS config + .env.example (BFIX-02, DEVP-05)** - `d82d1c1` (feat)

## Files Created/Modified
- `tokenizer-visualizer/backend/pytest.ini` - pytest config with pythonpath=. and testpaths=tests
- `tokenizer-visualizer/backend/conftest.py` - sys.path insertion for belt-and-suspenders import resolution
- `tokenizer-visualizer/backend/config.py` - Enhanced Settings with env-driven CORS, host, port, log_level, hf_home
- `tokenizer-visualizer/backend/.env.example` - Documents all environment variables with defaults

## Decisions Made
- **Union[str, list[str]] for cors_origins:** pydantic-settings tries to JSON-decode env var values for complex types (list[str]) before field validators run. Using Union[str, list[str]] tells pydantic-settings to accept the raw string, then the field_validator splits it into a list.
- **Belt-and-suspenders import resolution:** Both pytest.ini (pythonpath=.) and conftest.py (sys.path.insert) ensure imports work regardless of how pytest is invoked.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pydantic-settings JSON parsing error for CORS_ORIGINS env var**
- **Found during:** Task 2 (Environment-driven CORS config)
- **Issue:** pydantic-settings tries to JSON-decode env var values for `list[str]` fields before field validators run, causing JSONDecodeError on comma-separated strings like `http://localhost:5173,http://127.0.0.1:5173`
- **Fix:** Changed cors_origins type from `list[str]` to `Union[str, list[str]]` so pydantic-settings accepts the raw string, then field_validator splits it
- **Files modified:** tokenizer-visualizer/backend/config.py
- **Verification:** CORS_ORIGINS env var correctly parsed; all 5 tests pass
- **Committed in:** d82d1c1 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Essential fix for correct env var parsing. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Test infrastructure working, ready for remaining Phase 1 plans (error handling, rate limiting)
- Config pattern established for future settings additions

## Self-Check: PASSED

- All 4 key files verified on disk
- Both task commits (6e1b569, d82d1c1) verified in git history

---
*Phase: 01-backend-fixes-and-hardening*
*Completed: 2026-03-09*
