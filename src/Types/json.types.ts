export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONObject
	| JSONValue[];

export interface JSONObject {
	[key: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}
