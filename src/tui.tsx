/** @jsxImportSource @opentui/solid */
import { Plugin } from "@opencode/plugin/tui"
import { createSignal, Show } from "solid-js"
import { spawn } from "node:child_process"

export default Plugin.define({
  id: "opencode-open-with",
  setup(context) {
    const command = typeof context.options.command === "string" ? context.options.command : "codium"
    const title = typeof context.options.title === "string" ? context.options.title : "Open with VSCodium"
    const [hovered, setHovered] = createSignal(false)

    context.ui.slot({
      append: "sidebar.footer",
      render: () => (
        <Show when={context.location?.directory}>
          <box
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            onMouseUp={() => {
              const directory = context.location?.directory
              if (!directory) return
              const child = spawn(command, [directory], { detached: true, stdio: "ignore" })
              child.on("error", () =>
                context.ui.toast.show({
                  title,
                  message: `Could not launch ${command}`,
                  variant: "error",
                }),
              )
              child.unref()
            }}
          >
            <text fg={hovered() ? context.theme.text.base : context.theme.text.muted}>{title}</text>
          </box>
        </Show>
      ),
    })
  },
})
