/** @jsxImportSource @opentui/solid */
import { createSignal, For, Show } from "solid-js"
import { spawn } from "node:child_process"
import { MouseButton } from "@opentui/core"
import type { Context } from "@opencode/plugin/tui/context"
import type { Item } from "./options"

export function registerOpenWith(context: Context, items: Item[]) {
  const [hovered, setHovered] = createSignal<number>()

  function launch(item: Item) {
    const directory = context.location?.directory
    if (!directory) return
    const child = spawn(item.command, [directory], { detached: true, stdio: "ignore" })
    child.on("error", () =>
      context.ui.toast.show({
        title: item.title,
        message: "Could not launch " + item.command,
        variant: "error",
      }),
    )
    child.unref()
  }

  return context.ui.slot({
    prepend: "sidebar.footer",
    render: () => (
      <Show when={context.location?.directory}>
        <box flexDirection="column">
          <For each={items}>
            {(item, index) => (
              <box
                onMouseOver={() => setHovered(index())}
                onMouseOut={() => setHovered(undefined)}
                onMouseUp={(event) => {
                  if (event.button === MouseButton.LEFT) launch(item)
                }}
              >
                <text fg={hovered() === index() ? context.theme.text.base : context.theme.text.muted}>
                  {item.title}
                </text>
              </box>
            )}
          </For>
        </box>
      </Show>
    ),
  })
}
