export function getCookieValue(cookieName: string) {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(cookieName))
    ?.split('=')[1]

  return value
}
