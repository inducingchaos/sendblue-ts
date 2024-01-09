# Sendblue for Node.js

## Overview

"sendblue-ts" is a Typescript-friendly Node.js wrapper for the Sendblue API, providing a seamless interface for sending and receiving messages.

### Prerequisites

Before using this library, you need to get your API keys from Sendblue by signing up for an account [here](https://sendblue.co/).

### Installation

Install the `sendblue-ts` package using your favourite package manager:

```bash
pnpm add @rileybarabash/sendblue-ts
```

## Usage

### Initialization

Initialize a new `Sendblue` instance with your API keys. You can do so in separate file and import it as a module, or directly in your code.

```typescript
import { env } from "process"
import Sendblue from "@rileybarabash/sendblue-ts"

/**
 * Initialize a Sendblue instance.
 */
export const sendblue: Sendblue = new Sendblue(env.SENDBLUE_PK ?? "", env.SENDBLUE_SK ?? "")
```

### Send Message

[Sends a message](https://sendblue.co/docs/outbound) to a single recipient.

```typescript
const response: SendMessageResponse = await sendblue.sendMessage({
    number: "+19998887777",
    content: "Hello from Sendblue!",
    sendStyle: "invisible",
    mediaUrl: "https://source.unsplash.com/random.png",
    statusCallback: "https://example.com/callback"
})
```

### Send Group Message

[Sends a message to a group](https://sendblue.co/docs/groups) of recipients.

```typescript
const response: SendblueAPIResponse = await sendblue.sendGroupMessage({
    numbers: ["+19998887777", "+19998887778"],
    content: "Hello from Sendblue!",
    sendStyle: "invisible",
    mediaUrl: "https://source.unsplash.com/random.png",
    statusCallback: "https://example.com/callback"
})
```

### Get Message

Gets the message associated with the provided ID.

```typescript
const response: SendblueAPIResponse = await sendblue.getMessage({ id: "messageId" })
```

### Modify Group

[Modifies a message group](https://sendblue.co/docs/groups). Currently only supports adding recipients.

```typescript
const response: SendblueAPIResponse = await sendblue.modifyGroup({
    groupId: "groupId",
    modifyType: "add_recipient",
    number: "+19998887777"
})
```

### Lookup Number

[Checks](https://sendblue.co/docs/lookup-api) if a number is registered with iMessage.

```typescript
const response: SendblueAPIResponse = await sendblue.lookup({ number: "+19998887777" })
```

### Send Typing Indicator

[Sends a typing indicator](https://sendblue.co/docs/typing-indicator) to the specified recipient.

```typescript
const response: SendblueAPIResponse = await sendblue.sendTypingIndicator({ number: "+19998887777" })
```

### Get Contacts

[Retrieves a list of contacts](https://sendblue.co/docs/get-contacts) associated with the Sendblue account.

```typescript
const response: SendblueAPIResponse = await sendblue.getContacts()
```

### Create Contact

[Creates a contact](https://sendblue.co/docs/create-contact) from a recipient's contact details.

```typescript
const response: SendblueAPIResponse = await sendblue.createContact({
    number: "+19998887777",
    firstName: "First Name",
    lastName: "Last Name",
    companyName: "Company Name"
})
```

### Delete Contact

Deletes a contact with the specified ID.

```typescript
const response: SendblueAPIResponse = await sendblue.deleteContact({ id: "contactId" })
```

### Get Messages

[Gets all of the messages](https://sendblue.co/docs/get-messages) associated with a contact.

```typescript
const response: SendblueAPIResponse = await sendblue.getMessages({ contactId: "contactId" })
```

---

For more details and options, refer to the [Sendblue API Documentation](https://sendblue.co/docs).

Made with <3 in YEG `<Edmonton, Alberta>`
