import { expect, test } from "bun:test"
import { parseOptions } from "../src/options"

test("absent options enable nothing", () => {
  expect(parseOptions(undefined)).toEqual({ openWith: [], sidebarToggle: false, unknown: [] })
  expect(parseOptions({})).toEqual({ openWith: [], sidebarToggle: false, unknown: [] })
})

test("openWith keeps valid entries, defaults title, skips malformed", () => {
  const parsed = parseOptions({
    openWith: [
      { command: "codium", title: "Open with VSCodium" },
      { command: "zed" },
      { command: 42 },
      { title: "no command" },
      "nope",
      null,
    ],
  })
  expect(parsed.openWith).toEqual([
    { command: "codium", title: "Open with VSCodium" },
    { command: "zed", title: "zed" },
  ])
})

test("empty or non-array openWith is disabled", () => {
  expect(parseOptions({ openWith: [] }).openWith).toEqual([])
  expect(parseOptions({ openWith: [{}] }).openWith).toEqual([])
  expect(parseOptions({ openWith: "codium" }).openWith).toEqual([])
})

test("blank commands are skipped", () => {
  expect(parseOptions({ openWith: [{ command: "" }] }).openWith).toEqual([])
  expect(parseOptions({ openWith: [{ command: "   " }] }).openWith).toEqual([])
})

test("command and title are trimmed", () => {
  expect(parseOptions({ openWith: [{ command: " codium " }] }).openWith).toEqual([{ command: "codium", title: "codium" }])
  expect(parseOptions({ openWith: [{ command: "codium", title: "  " }] }).openWith).toEqual([{ command: "codium", title: "codium" }])
  expect(parseOptions({ openWith: [{ command: "codium", title: "" }] }).openWith).toEqual([{ command: "codium", title: "codium" }])
  expect(parseOptions({ openWith: [{ command: "codium", title: " Open " }] }).openWith).toEqual([{ command: "codium", title: "Open" }])
})

test("sidebarToggle is only enabled by true", () => {
  expect(parseOptions({ sidebarToggle: true }).sidebarToggle).toBe(true)
  expect(parseOptions({ sidebarToggle: false }).sidebarToggle).toBe(false)
  expect(parseOptions({ sidebarToggle: "yes" }).sidebarToggle).toBe(false)
  expect(parseOptions({}).sidebarToggle).toBe(false)
})

test("unknown keys are reported", () => {
  expect(parseOptions({ openwith: [] }).unknown).toEqual(["openwith"])
  expect(parseOptions({ openWith: [], sidebarToggle: true, foo: 1, bar: 2 }).unknown).toEqual(["foo", "bar"])
  expect(parseOptions({ openWith: [] }).unknown).toEqual([])
})
