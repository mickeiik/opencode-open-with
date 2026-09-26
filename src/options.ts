export type Item = { command: string; title: string }

export type ParsedOptions = {
  openWith: Item[]
  sidebarToggle: boolean
  unknown: string[]
}

const knownKeys = new Set(["openWith", "sidebarToggle"])

export function parseOptions(options: Readonly<Record<string, unknown>> | undefined): ParsedOptions {
  return {
    openWith: parseItems(options?.openWith),
    sidebarToggle: options?.sidebarToggle === true,
    unknown: Object.keys(options ?? {}).filter((key) => !knownKeys.has(key)),
  }
}

function parseItems(value: unknown): Item[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return []
    const item = entry as { command?: unknown; title?: unknown }
    if (typeof item.command !== "string") return []
    const command = item.command.trim()
    if (!command) return []
    const title = typeof item.title === "string" ? item.title.trim() : ""
    return [{ command, title: title || command }]
  })
}
