export function focus (id) {
  waitForElement(id, (el) => el.focus())
}

export function pluralize (count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

export function waitForElement (id, callback = () => {}, retry = 180) {
  const el = document.getElementById(id)
  if (el) {
    return callback(el)
  }
  if (retry > 0) {
    window.requestAnimationFrame(() => waitForElement(id, callback, retry - 1))
  }
}
