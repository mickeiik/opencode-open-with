/** @jsxImportSource @opentui/solid */
import { Plugin } from "@opencode/plugin/tui"
import { setup } from "./src/setup"
export default Plugin.define({
  id: "opencode-tui-extras",
  setup: (context) => setup(context, context.options),
})
