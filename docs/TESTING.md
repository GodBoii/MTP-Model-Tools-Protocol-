# Testing

This project separates tests into tiers so mixed environments are more reliable.

## Test tiers

- fast unit tests: deterministic, local-only, no live provider requirements
- integration tests: transport/socket/conformance style tests
- live tests: real external provider/network credentials (opt-in)

Markers:

- `integration`
- `live`

## Recommended local commands

Run fast tests only:

```bash
pytest -q -m "not integration and not live"
```

Run integration tests:

```bash
pytest -q -m "integration and not live"
```

Run everything except live:

```bash
pytest -q -m "not live"
```

## Reliability notes

- `pytest.ini` enforces:
  - `--strict-markers`
  - workspace-local base temp root (`tmp/pytest_tmp`)
  - collection hygiene (`norecursedirs` ignores transient and lock-prone paths)
- tests should prefer workspace temp roots (`tmp/...`) over OS global temp paths
- cleanup logic should be permission-aware and retry-safe on Windows/sandboxed filesystems
- network/server startup checks should use wait loops instead of fixed sleeps where possible

## CI parity

CI runs:

- fast tests on `ubuntu`, `windows`, `macos`
- integration tests on representative `ubuntu` + `windows`

This catches common path/permission/socket differences early.

