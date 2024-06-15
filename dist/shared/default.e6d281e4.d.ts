type JSONValue = string | number | boolean | null | JSONObject | JSONValue[];
interface JSONObject {
    [key: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {
}

export type { JSONValue as J, JSONObject as a, JSONArray as b };
