export function asString(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0]
  }
  return ''
}

export function firstQueryValue(value: unknown): string | undefined {
  const v = asString(value)
  return v || undefined
}
