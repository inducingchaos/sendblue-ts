/**
 * @file A custom error class for general Sendblue errors.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { CustomError } from "~/utils"

/**
 * @description There was an error fetching data from the Sendblue API.
 */
type APIRequestFailure = "API_REQUEST_FAILURE"

/**
 * @description A union of all Sendblue-related error labels.
 */
type SendblueErrorName = APIRequestFailure

/**
 * @description An custom error class for Sendblue-related errors.
 */
export class SendblueError extends CustomError<SendblueErrorName> {}
