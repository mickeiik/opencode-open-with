# opencode-open-with

An [OpenCode](https://opencode.ai) CLI (TUI) plugin that adds an **Open with VSCodium** action to the session sidebar footer, right above the working directory path.

Clicking the row opens the session's working directory in VSCodium (`codium <directory>`).

## Install

Clone the repo into OpenCode's global plugins directory:

```sh
git clone https://github.com/mickeiik/opencode-open-with.git ~/.config/opencode/plugins/open-with
```

Restart OpenCode. The row appears beneath the working directory path at the bottom of the session sidebar.

To update:

```sh
git -C ~/.config/opencode/plugins/open-with pull
```

## Options

The defaults are fine for VSCodium. To override them, also list the plugin in `~/.config/opencode/cli.json`:

```jsonc
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": [
    { "package": "./plugins/open-with", "options": { "command": "codium", "title": "Open with VSCodium" } }
  ]
}
```

| Option | Default | Description |
| --- | --- | --- |
| `command` | `codium` | Executable to launch with the working directory as its only argument. |
| `title` | `Open with VSCodium` | Label shown in the sidebar. |

Any editor with a CLI (`code`, `zed`, `cursor`, ...) works the same way.

## Requirements

- OpenCode 2.0.x with CLI plugin support.
- The configured command available on `PATH`.

## How it works

The plugin claims the `sidebar.footer` slot and prepends a clickable row above the directory path. Clicking it spawns the configured command detached from the TUI process.

## Notes

- OpenCode's built-in "Working directory" menu (Copy path / Open folder / Workspaces) is not extensible through the plugin API, so this plugin adds its own row above the directory path instead of a menu entry.
- Installing the package through `cli.json` as a git dependency (`"git+https://github.com/mickeiik/opencode-open-with.git"`) resolves and downloads, but the host CLI (2.0.12) cannot load JSX plugins from `node_modules`: they are compiled outside OpenTUI's Solid transform and the generated JSX runtime import does not resolve. Local plugins, as installed above, are transformed correctly.
- To remove the plugin, delete `~/.config/opencode/plugins/open-with`.

## Development

`tui.tsx` is the entire plugin. Syntax-check it with:

```sh
bun build tui.tsx --target=bun --external '@opencode/plugin/tui' --external solid-js --external '@opentui/solid' --outfile /tmp/open-with-check.js
```
