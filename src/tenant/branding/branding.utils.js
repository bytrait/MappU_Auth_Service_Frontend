export function applyTitle(name) {
  document.title = name || "ByTrait"
}

/**
 * Replace every icon / apple-touch-icon link so hardcoded HTML defaults
 * (and multi-size icon tags) do not keep showing the wrong brand.
 */
export function applyFavicon(path) {
  if (!path) return

  const existing = document.querySelectorAll(
    "link[rel='icon'], link[rel='shortcut icon'], link[rel*='icon']"
  )
  existing.forEach((node) => node.remove())

  const icon = document.createElement("link")
  icon.rel = "icon"
  icon.href = path
  if (path.endsWith(".svg")) icon.type = "image/svg+xml"
  document.head.appendChild(icon)

  const apple = document.createElement("link")
  apple.rel = "apple-touch-icon"
  apple.href = path
  document.head.appendChild(apple)
}
