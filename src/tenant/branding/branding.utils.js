export function applyTitle(name) {
  document.title = name || "Bytrait"
}

export function applyFavicon(path) {
  let link = document.querySelector("link[rel*='icon']")

  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    document.head.appendChild(link)
  }

  link.href = path
}