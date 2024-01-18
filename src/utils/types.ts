type JSONPrimitive = string | boolean | number | null | undefined
type JSONArray = (JSONPrimitive | JSONObject | JSONArray)[]
type JSONObject = { [key: string]: JSONPrimitive | JSONArray | JSONObject | object }
export type JSONValue = JSONObject | JSONArray | JSONPrimitive
