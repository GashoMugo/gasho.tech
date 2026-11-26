import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

import { services } from "../data/services.ts"

/**
 * The /services grid used to look icons up by `service.icon.name` — a name that
 * only survives bundling by luck — so every card fell back to the same gear.
 * The page must render each service's own icon component.
 */

test("every service carries a distinct icon component", () => {
  assert.ok(services.length > 1, "expected the public service list")
  assert.equal(new Set(services.map((service) => service.icon)).size, services.length, "two services share an icon component")
  for (const service of services) {
    assert.ok(service.icon, `${service.id} has no icon component`)
  }
})

test("/services renders service.icon instead of a name-keyed lookup", () => {
  const page = readFileSync(new URL("../app/services/page.tsx", import.meta.url), "utf8")
  assert.match(page, /const Icon = service\.icon\b/, "page must use the service's own icon")
  assert.doesNotMatch(page, /iconMap\[[^\]]*\.icon\.name\]/, "name-keyed icon lookup is the bug")
})
