# Local Toolkits

MTP includes local/no-key toolkits inspired by common agent toolkit patterns:
- calculator
- file
- python
- shell

MTP also includes optional search/web-scrape toolkits inspired by Agno:
- wikipedia
- website
- newspaper
- newspaper4k
- crawl4ai

Use them with:

```python
from mtp import Agent

registry = Agent.ToolRegistry()
Agent.register_local_toolkits(registry, base_dir=".")
```

## Discovery + lazy loading

- Tool names are discoverable through loader spec preview.
- Handlers load only when a matching tool is called.

## Toolkit summary

## `calculator.*`
- `calculator.add`
- `calculator.subtract`
- `calculator.multiply`
- `calculator.divide`
- `calculator.sqrt`

## `file.*`
- `file.list_files`
- `file.read_file`
- `file.write_file`
- `file.search_in_files`

Paths are constrained to the configured `base_dir`.

## `python.*`
- `python.run_code`
- `python.run_file`

Execution uses isolated subprocess mode (`python -I`) with timeout. This is a constrained execution helper, not a security sandbox.

The legacy `allow_unsafe_exec` constructor argument is accepted for compatibility but no longer enables in-process `exec`.

## `shell.*`
- `shell.run_command`

Runs bare command names in `base_dir` with timeout and an allowlist (`echo`, `pwd`, `ls`, `dir` by default). Absolute or path-qualified executables are rejected even when their basename is allowlisted.
Use `allowed_commands=` to customize.

## Search + web-scrape toolkits

These are dependency-optional and lazily loaded. You can register them without installing packages, but the first call will fail with an install hint if dependencies are missing.

Install all web toolkit dependencies with one command:

```bash
pip install "mtpx[toolkits-web]"
```

## `wikipedia.*`
- `wikipedia.search_wikipedia`

Dependency:
- `pip install wikipedia`

## `website.*`
- `website.read_url`

Dependencies:
- `pip install requests beautifulsoup4`

`WebsiteToolkit` accepts only `http` and `https` URLs. By default it refuses
localhost, private, link-local, multicast, reserved, and unresolved targets to
reduce SSRF risk when agents can choose URLs. Use `allowed_hosts={...}` for a
public allowlist, or `allow_private_hosts=True` only in trusted local workflows.

## `newspaper.*`
- `newspaper.get_article_text`

Dependencies:
- `pip install newspaper3k lxml_html_clean`

## `newspaper4k.*`
- `newspaper4k.read_article`

Dependencies:
- `pip install newspaper4k lxml_html_clean`

## `crawl4ai.*`
- `crawl4ai.web_crawler`

Dependency:
- `pip install crawl4ai`

## Risk and policy

Default policy:
- read-only tools: allow
- write tools: allow
- destructive tools: ask

Customize with `RiskPolicy` when creating `ToolRegistry`.

Related:
- [Storage and Sessions](STORAGE.md)
