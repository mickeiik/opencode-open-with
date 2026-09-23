/** @jsxImportSource @opentui/solid */
import { Plugin } from "@opencode/plugin/tui"
import { createSignal, For, Show } from "solid-js"
import { spawn } from "node:child_process"

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
    const items = parseItems(context.options.items)
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

    context.ui.slot({
      prepend: "sidebar.footer",
      render: () => (
        <Show when={context.location?.directory}>
          <box flexDirection="column">
            <For each={items}>
              {(item) => (
                <box
                  onMouseOver={() => setHovered(item.title)}
                  onMouseOut={() => setHovered(undefined)}
                  onMouseUp={() => launch(item)}
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
