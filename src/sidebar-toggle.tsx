/** @jsxImportSource @opentui/solid */
import { createSignal, Show } from "solid-js"
import { MouseButton } from "@opentui/core"
import type { Context } from "@opencode/plugin/tui/context"

export function registerSidebarToggle(context: Context) {
  const [hovered, setHovered] = createSignal(false)
  const label = () => {
    const command = context.keymap.commands().find((item) => item.id === "session.sidebar.toggle")
    if (command?.title === "Hide sidebar") return "◨ hide sidebar"
    if (command?.title === "Show sidebar") return "◨ show sidebar"
    return "◨ sidebar"
  }

  return context.ui.slot({
    append: "prompt.footer",
    render: (input) => (
      <Show when={isRootSession(context, input.sessionID)}>
        <box
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
          onMouseUp={(event) => {
            if (event.button === MouseButton.LEFT) context.keymap.dispatch("session.sidebar.toggle")
          }}
        >
          <text fg={hovered() ? context.theme.text.base : context.theme.text.muted} wrapMode="none">
            {label()}
          </text>
        </box>
      </Show>
    ),
  })
}

function isRootSession(context: Context, sessionID: string | undefined) {
  if (!sessionID) return false
  const session = context.data.session.get(sessionID)
  return Boolean(session) && !session?.parentID
}
