/** @jsxImportSource @opentui/solid */
import { Plugin } from "@opencode/plugin/tui"
import { createSignal, For, Show } from "solid-js"
import { spawn } from "node:child_process"
import { MouseButton } from "@opentui/core"

type Item = { command: string; title: string }

const defaultItems: Item[] = [{ command: "codium", title: "Open with VSCodium" }]

function parseItems(value: unknown): Item[] {
  if (!Array.isArray(value)) return defaultItems
  const items = value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return []
    const item = entry as { command?: unknown; title?: unknown }
    if (typeof item.command !== "string") return []
    return [{ command: item.command, title: typeof item.title === "string" ? item.title : item.command }]
  })
  return items.length > 0 ? items : defaultItems
}

export default Plugin.define({
  id: "opencode-open-with",
  setup(context) {
    // The item list lives in plugin storage; the cli.json `items` option seeds it
    // and is what "Reset" restores. Right-clicking a row edits the stored list.
    const [settings, updateSettings] = context.storage.store("items", {
      initial: { list: parseItems(context.options.items) },
    })
    const [hovered, setHovered] = createSignal<string>()

    function launch(item: Item) {
      const directory = context.location?.directory
      if (!directory) return
      const child = spawn(item.command, [directory], { detached: true, stdio: "ignore" })
      child.on("error", () =>
        context.ui.toast.show({
          title: item.title,
          message: `Could not launch ${item.command}`,
          variant: "error",
        }),
      )
      child.unref()
    }

    async function addItem() {
      const command = await context.ui.dialog.prompt({ title: "Command", placeholder: "codium" })
      if (!command) return
      const fallback = `Open with ${command}`
      const title = await context.ui.dialog.prompt({ title: "Label", value: fallback })
      if (title === undefined) return
      await updateSettings((draft) => {
        draft.list.push({ command, title: title || fallback })
      })
    }

    async function configure() {
      const choice = await context.ui.dialog.select({
        title: "Open with",
        options: [
          { title: "Add app…", value: "add", description: "command and label" },
          ...settings.list.map((item, index) => ({
            title: item.title,
            value: `remove:${index}`,
            description: `remove — ${item.command}`,
          })),
          { title: "Reset", value: "reset", description: "restore the cli.json/default items" },
        ],
      })
      if (choice === undefined) return
      if (choice === "add") return addItem()
      if (choice === "reset") {
        await updateSettings((draft) => {
          draft.list = parseItems(context.options.items)
        })
        return
      }
      const index = Number(choice.slice("remove:".length))
      const item = settings.list[index]
      if (!item) return
      const confirmed = await context.ui.dialog.confirm({ title: "Remove", message: item.title })
      if (!confirmed) return
      await updateSettings((draft) => {
        draft.list.splice(index, 1)
      })
    }

    context.ui.slot({
      prepend: "sidebar.footer",
      render: () => (
        <Show when={context.location?.directory}>
          <box flexDirection="column">
            <For each={settings.list}>
              {(item) => (
                <box
                  onMouseOver={() => setHovered(item.title)}
                  onMouseOut={() => setHovered(undefined)}
                  onMouseUp={(event) => {
                    if (event.button === MouseButton.RIGHT) {
                      configure()
                      return
                    }
                    if (event.button === MouseButton.LEFT) launch(item)
                  }}
                >
                  <text fg={hovered() === item.title ? context.theme.text.base : context.theme.text.muted}>
                    {item.title}
                  </text>
                </box>
              )}
            </For>
          </box>
        </Show>
      ),
    })
  },
})
