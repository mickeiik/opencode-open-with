import type { Context } from "@opencode/plugin/tui/context"
import { parseOptions } from "./options"
import { registerOpenWith } from "./open-with"
import { registerSidebarToggle } from "./sidebar-toggle"

export function setup(context: Context, options: Readonly<Record<string, unknown>> | undefined) {
  const { openWith, sidebarToggle, unknown } = parseOptions(options)
  if (unknown.length > 0) {
    context.ui.toast.show({
      title: "opencode-tui-extras",
      message: `Unknown options: ${unknown.join(", ")} — configure features in cli.json`,
      variant: "warning",
    })
  }
  if (openWith.length > 0) registerOpenWith(context, openWith)
  if (sidebarToggle) registerSidebarToggle(context)
}
