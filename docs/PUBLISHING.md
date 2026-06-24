# Publishing MTPX To PyPI

This guide documents the release workflow for the `mtpx` package.

## Prerequisites

- PyPI account
- Project ownership for `mtpx` on PyPI
- Build tools:

```bash
python -m pip install --upgrade build twine
```

## Build

From repository root:

```bash
python -m build
```

Artifacts:
- `dist/*.whl`
- `dist/*.tar.gz`

## Validate Distributions

```bash
python -m twine check dist/*
```

## Publish To TestPyPI (Recommended First)

```bash
python -m twine upload --repository testpypi dist/*
```

Install test package:

```bash
pip install --index-url https://test.pypi.org/simple/ mtpx
```

## Publish To PyPI

```bash
python -m twine upload dist/*
```

After upload:

```bash
pip install mtpx
```

## Releasing A New Version

1. Update version in `pyproject.toml`.
2. Update `CHANGELOG.md`.
3. Verify optional dependency extras are current and valid.
4. Rebuild and validate.
5. Publish with Twine.

Versioning policy uses semantic versioning:
- Patch: bug fixes
- Minor: backward-compatible features
- Major: breaking changes

## Suggested Release Checklist

```bash
# update pyproject.toml version first
python -m pytest tests/test_packaging_extras.py
python -m pip install -e ".[all]"
python -m build
python -m twine check dist/*
python -m twine upload dist/*
```

Optional git tagging:

```bash
git tag v0.1.4
git push origin v0.1.4
```

## Troubleshooting

- `File already exists`
  - Version already published. Bump version and rebuild.
- `403 Forbidden`
  - Invalid or expired PyPI token.
- `Invalid distribution`
  - Remove old artifacts and build again.

## Notes

- Core package import remains `import mtp`.
- Package name for installation is `mtpx`.
- Provider SDKs and database drivers are optional and installed separately.


# Step 1: Clean old build files
Remove-Item -Recurse -Force dist, build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src\*.egg-info -ErrorAction SilentlyContinue

# Step 2: Build the package
python -m build

# Step 3: Validate the package
python -m twine check dist/*

# Step 4: Upload to PyPI
python -m twine upload dist/mtpx-0.1.33*


pip install -e .