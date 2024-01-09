/**
 * @file A Typescript wrapper for the Sendblue API.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { SendblueError } from "./error"
import { keysToCamelCase, type SnakeToCamelCase } from "~/utils"

/**
 * The signature of a the `SendBlue.api` utility used for fetching from Sendblue's API.
 */
export type SendblueAPI = (method: "post" | "get" | "delete", pathname: string, payload?: unknown) => Promise<SendblueAPIResponse>

/**
 * The expected response when sending a message to a single recipient.
 */
export interface SendMessageRawResponse {
    /**
     * Associated account email.
     */
    accountEmail: string

    /**
     * Message content.
     */
    content: string

    /**
     * True if the message is sent, false if the message is received.
     */
    is_outbound: boolean

    /**
     * A CDN link to the image that you sent to our servers.
     */
    media_url: string

    /**
     * The current status of the message.
     */
    status: string

    /**
     * Error code (null if no error).
     */
    error_code: null | string

    /**
     * Descriptive error message (null if no error).
     */
    error_message: null | string

    /**
     * Sendblue message handle.
     */
    message_handle: string

    /**
     * "ISO 8601" formatted date string of the date this message was created.
     */
    date_sent: string

    /**
     * "ISO 8601" formatted date string of the date this message was last updated.
     */
    date_updated: string

    /**
     * "E.164" formatted phone number string of the message dispatcher.
     */
    from_number: string

    /**
     * "E.164" formatted phone number string of your end-user (not the Sendblue-provided phone number).
     */
    number: string

    /**
     * "E.164" formatted phone number string of the message recipient.
     */
    to_number: string

    /**
     * True if the end user does not support iMessage, false otherwise.
     */
    was_downgraded: boolean | null

    /**
     * Value of the Sendblue account plan.
     */
    plan: string

    /**
     * The type of message (e.g., 'message').
     */
    message_type: string

    /**
     * Group ID associated with the message.
     */
    group_id: string

    /**
     * Array of participant phone numbers.
     */
    participants: string[]

    /**
     * Style of the message send (e.g., "slam").
     */
    send_style: string

    /**
     * True if the user has opted out, false otherwise.
     */
    opted_out: boolean

    /**
     * Additional details about the error (null if no error).
     */
    error_detail: null | string
}

/**
 * A camelCased implementation of `SendMessageRawResponse`.
 */
export type SendMessageResponse = { [Key in keyof SendMessageRawResponse as SnakeToCamelCase<Key>]: SendMessageRawResponse[Key] }

/**
 * The expected response when sending a typing indicator to a recipient.
 */
export interface SendTypingIndicatorRawResponse {
    /**
     * The number the typing indicator was sent to.
     */
    number: string

    /**
     * The status of the typing indicator you tried to send (this will either be SENT or ERROR).
     */
    status: string

    /**
     * The error message if the status is ERROR.
     */
    error_message: null | string

    /**
     * The HTTP status code of the response.
     */
    status_code: number
}

/**
 * A camelCased implementation of `SendTypingIndicatorRawResponse`.
 */
export type SendTypingIndicatorResponse = { [Key in keyof SendTypingIndicatorRawResponse as SnakeToCamelCase<Key>]: SendTypingIndicatorRawResponse[Key] }

/**
 * An error response from the Sendblue API.
 */
export interface ErrorResponse {
    /**
     * A message indicating the cause of the error.
     */
    message: string
}

/**
 * A response from the Sendblue API.
 * @remarks Being implemented on a per-use basis.
 */
export type SendblueRawAPIResponse = SendMessageRawResponse | ErrorResponse

/**
 * An API response from Sendblue with camelCased keys.
 * @remarks Created on each `SendblueRawAPIResponse` implementation.
 */
export type SendblueAPIResponse = SendMessageResponse | SendTypingIndicatorResponse | ErrorResponse

/**
 * The style of iMessage effect to send the message with. Default is `invisible`.
 */
export type MessageSendStyle = "celebration" | "shooting_star" | "fireworks" | "lasers" | "love" | "confetti" | "balloons" | "spotlight" | "echo" | "invisible" | "gentle" | "loud" | "slam"

/**
 * A Typescript wrapper for interacting with the Sendblue API.
 */
export default class Sendblue {
    /**
     * The base URL for the Sendblue API.
     */
    public static sendblueBaseUrl: string = "https://api.sendblue.co"

    /**
     * A simplified fetch utility for querying Sendblue's API.
     */
    public api: SendblueAPI

    /**
     * Creates a new instance of the Sendblue class.
     */
    public constructor(publicKey: string, secretKey: string) {
        this.api = async (method, pathname, payload) => {
            //  Make a request to the Sendblue server

            const response: Response = await fetch(`${Sendblue.sendblueBaseUrl}${pathname}`, {
                method: method.toUpperCase(),
                body: payload ? JSON.stringify(payload) : null,
                headers: {
                    "sb-api-key-id": publicKey,
                    "sb-api-secret-key": secretKey,
                    "Content-Type": "application/json"
                }
            })

            //  Get the response body

            const responseBody = keysToCamelCase(await response.json()) as SendblueAPIResponse

            //  Throw an error if the response is not ok

            if (!response.ok)
                throw new SendblueError({
                    name: "API_REQUEST_FAILURE",
                    message: `Error fetching data from Sendblue on route "${pathname}"`,
                    cause: { request: JSON.stringify(payload), response: { code: response.status, message: (responseBody as ErrorResponse).message } }
                })

            //  Return the response

            return responseBody
        }
    }

    /**
     * Sends an message to a single recipient.
     */
    public async sendMessage({ number, content, ...opts }: { number: string; content: string; sendStyle?: MessageSendStyle; mediaUrl?: string; statusCallback?: string }): Promise<SendMessageResponse> {
        //  Make a request to the "/api/send-message" endpoint

        return (await this.api("post", "/api/send-message", {
            number,
            content,
            send_style: opts.sendStyle,
            media_url: opts.mediaUrl,
            status_callback: opts.statusCallback
        })) as SendMessageResponse
    }

    /**
     * Sends a message to a group of recipients.
     */
    public async sendGroupMessage({ numbers, content, ...opts }: { numbers: string[]; content: string; groupId?: string; sendStyle?: MessageSendStyle; mediaUrl?: string; statusCallback?: string }): Promise<SendblueAPIResponse> {
        //  Make a request to the "/api/send-group-message" endpoint

        return this.api("post", "/api/send-group-message", {
            numbers,
            group_id: opts.groupId,
            content,
            send_style: opts.sendStyle,
            media_url: opts.mediaUrl,
            status_callback: opts.statusCallback
        })
    }

    /**
     * Gets the message associated with the provided ID.
     */
    public async getMessage(opts: { id: string }): Promise<SendblueAPIResponse> {
        //  Make a request to the "/api/message" endpoint with the message ID as a dynamic route segment

        return this.api("get", `/api/message/${opts.id}`)
    }

    /**
     * Modifies a message group.
     * @remarks Currently only supports adding recipients.
     */
    public async modifyGroup({ number, ...opts }: { groupId: string; modifyType: "add_recipient"; number: string }): Promise<SendblueAPIResponse> {
        //  Make a request to the "/modify-group" endpoint

        return this.api("post", "/modify-group", {
            group_id: opts.groupId,
            modify_type: opts.modifyType,
            number
        })
    }

    /**
     * Checks if a number is registered with iMessage.
     */
    public async lookup(opts: { number: string }): Promise<SendblueAPIResponse> {
        //  Make a request to the "/api/lookup" endpoint with the number as a query param

        return this.api("get", `/api/evaluate-service?number=${opts.number}`)
    }

    /**
     * Sends a typing indicator to the specified recipient.
     */
    public async sendTypingIndicator(opts: { number: string }): Promise<SendTypingIndicatorResponse> {
        //  Make a request to the "/api/send-typing-indicator" endpoint with the number as a query param

        return (await this.api("post", `/api/send-typing-indicator?number=${opts.number}`, { ...opts })) as SendTypingIndicatorResponse
    }

    /**
     * Retrieves a list of contacts associated with the Sendblue account.
     */
    public async getContacts(): Promise<SendblueAPIResponse> {
        //  Make a request to the "/accounts/contacts" endpoint

        return this.api("get", "/accounts/contacts")
    }

    /**
     * Creates a contact from a recipient's contact details.
     */
    public async createContact({ number, firstName, lastName, companyName }: { number: string; firstName?: string; lastName?: string; companyName?: string }) {
        //  Make a request to the "/accounts/contacts" endpoint

        return this.api("post", "/accounts/contacts", {
            number,
            firstName,
            lastName,
            companyName
        })
    }

    /**
     * Deletes a contact with the specified ID.
     */
    public async deleteContact(opts: { id: string }): Promise<SendblueAPIResponse> {
        //  Make a request to the "/accounts/contacts" endpoint with the contact ID as a dynamic route segment

        return this.api("delete", `/accounts/contacts/${opts.id}`)
    }

    /**
     * Gets all of the messages associated with a contact.
     */
    public async getMessages(opts: { contactId: string }): Promise<SendblueAPIResponse> {
        //  Make a request to the "/accounts/messages" endpoint with the contact ID as a query param

        return this.api("get", `/accounts/messages?cid=${opts.contactId}`)
    }
}
