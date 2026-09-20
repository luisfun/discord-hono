import type { Simplify, TypedResponse } from '../types'

interface InspectOptions {
  depth?: number
  errorDepth?: number
  codeBlock?: boolean
}

interface InspectResult<R extends Response | TypedResponse<any>> {
  json: (ReturnType<R['json']> extends Promise<infer U> ? U : ReturnType<R['json']>) | undefined
  text: string
  message: string
}

const collectResponseErrors = (errors: Record<string, unknown>, path: string): string[] =>
  Object.entries(errors).flatMap(([key, child]) => {
    const childPath = path ? `${path}.${key}` : key
    if (key === '_errors' && Array.isArray(child)) {
      return child.flatMap(item =>
        typeof item === 'object' && item !== null && 'message' in item && typeof item.message === 'string'
          ? [`${path}: ${item.message}`]
          : [],
      )
    }
    if (typeof child === 'object' && child !== null && !Array.isArray(child)) {
      return collectResponseErrors(child as Record<string, unknown>, childPath)
    }
    return []
  })

const formatResponseError = (value: unknown): string => {
  if (typeof value !== 'object' || value === null) return String(value)

  const error = value as {
    code?: number | string
    message?: string
    errors?: Record<string, unknown>
  }
  const lines = [error.code !== undefined && error.message ? `${error.code}: ${error.message}` : error.message].filter(
    (line): line is string => Boolean(line),
  )
  return lines.concat(error.errors ? collectResponseErrors(error.errors, '') : []).join('\n')
}

const summarize = (value: unknown, depth: number): unknown => {
  if (typeof value !== 'object' || value === null || Object.keys(value).length === 0) return value
  if (depth <= 0) {
    const len = Object.keys(value).length
    return Array.isArray(value) ? `[...+${len}]` : `{...+${len}}`
  }
  if (Array.isArray(value)) return value.map(item => summarize(item, depth - 1))
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      key.toLowerCase().includes('token') ? '***' : summarize(child, depth - 1),
    ]),
  )
}

/**
 * @beta
 * @param response The Response object to debug.
 * @param options `{ depth?: number, errorDepth?: number, codeBlock?: boolean }`
 * @returns `Promise<{ json: any | undefined, text: string, message: string }>`
 */
export const inspectResponse = async <R extends Response | TypedResponse<any>>(
  response: R,
  options?: InspectOptions,
): Promise<Simplify<InspectResult<R>>> => {
  const res = response.clone()
  try {
    const json = await res.json()
    const text = JSON.stringify(summarize(json, res.ok ? (options?.depth ?? 1) : (options?.errorDepth ?? 10)), null, 2)
    const message = res.ok ? 'Success' : formatResponseError(json)
    return { json, text: options?.codeBlock ? `\`\`\`json\n${text}\n\`\`\`` : text, message }
  } catch {
    return { json: undefined, text: 'JSON parse error', message: 'JSON parse error' }
  }
}
