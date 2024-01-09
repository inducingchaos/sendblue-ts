/**
 * @file Defines an error class to use as a base for constructing custom application errors.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

export interface CustomErrorOptions<ErrorName> {
    /**
     * The name of the error.
     */
    name: ErrorName

    /**
     * A detailed description of the error.
     */
    message: string

    /**
     * Additional data related to the error.
     */
    cause?: unknown
}

/**
 * A custom error class base. Useful for constructing custom application errors.
 */
export class CustomError<ErrorName extends string> extends Error {
    /**
     * The name of the error.
     */
    name: ErrorName

    /**
     * A detailed description of the error.
     */
    message: string

    /**
     * Additional data related to the error.
     */
    cause: unknown

    constructor({ name, message, cause }: CustomErrorOptions<ErrorName>) {
        super()
        this.name = name
        this.message = message
        this.cause = cause
    }
}
