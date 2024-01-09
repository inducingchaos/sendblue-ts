/**
 * @file A collection of helpers for doing string case transformations.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

/**
 * Converts a string type from snake_case to camelCase.
 */
export type SnakeToCamelCase<Value extends string> = Value extends `${infer Char}${"_"}${infer Rest}` ? `${Char}${Capitalize<SnakeToCamelCase<Rest>>}` : Value

/**
 * Converts the keys of an object to camelCase.
 */
export function keysToCamelCase(value: unknown): unknown {
    //  Check if the value is an object, is not an array, an is not a function

    if (value === Object(value) && !Array.isArray(value) && typeof value !== "function") {
        //  Initialize a new object to store the result

        const result: Record<string, unknown> = {}

        //  Iterate over the keys of the object

        Object.keys(value as Record<string, unknown>).forEach(key => {
            //  Assign the result of the processed value to the result object, using the original key converted to camelCase

            result[toCamelCase(key)] = keysToCamelCase((value as Record<string, unknown>)[key])
        })

        //  Return the new object

        return result
    } else if (Array.isArray(value)) {
        //  If the value is an array, recursively call the function on each element

        return value.map(index => keysToCamelCase(index))
    }

    //  Otherwise, return the value as is

    return value
}

/**
 * Converts a string to camelCase.
 */
export function toCamelCase(value: string): string {
    //  Removes all hyphens and underscores followed by a lowercase letter and uppercases the letter

    return value.replace(/([-_][a-z])/gi, $1 => $1.toUpperCase().replace("-", "").replace("_", ""))
}
