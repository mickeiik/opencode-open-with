# opencode-open-with

An [OpenCode](https://opencode.ai) CLI (TUI) plugin that adds an **Open with VSCodium** action to the session sidebar footer, right under the working directory path.

Clicking the row opens the session's working directory in VSCodium (`codium <directory>`).

## Install

Add the plugin to `~/.config/opencode/cli.json`:

```jsonc
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": [
    {
      "package": "git+https://github.com/mickeiik/opencode-open-with.git",
      "options": { "command": "codium", "title": "Open with VSCodium" }
    }
  ]
}
```

Restart OpenCode. OpenCode installs the plugin from GitHub into its plugin cache on first load, and the row appears beneath the working directory path at the bottom of the sidebar.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `command` | `codium` | Executable to launch with the working directory as its only argument. |
| `title` | `Open with VSCodium` | Label shown in the sidebar. |

Any editor with a CLI (`code`, `zed`, `cursor`, ...) works the same way.

## Requirements

- OpenCode 2.0.x with CLI plugin support (`@opencode/plugin/tui`).
- The configured command available on `PATH`.

## How it works

The plugin claims the `sidebar.footer` slot and appends a clickable row. Clicking it spawns the configured command detached from the TUI process.

## Notes

- OpenCode's built-in "Working directory" menu (Copy path / Open folder / Workspaces) is not extensible through the plugin API, so this plugin adds its own row under the directory path instead of a menu entry.
- To remove the plugin, delete the entry from `cli.json`.

## Development

`src/tui.tsx` is the entire plugin. Syntax-check it with:

```sh
bun build src/tui.tsx --target=bun \
  --external '@opencode/plugin/tui' --external solid-js --external '@opentui/solid' \
  --outfile /tmp/open-with-check.js
```
