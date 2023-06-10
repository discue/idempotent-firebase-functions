const { verifyEventHasNotBeenHandled } = require("./idempotent-function-lease.js")

/**
 * Calls the given function only if the event id has not been recorded yet.
 *
 * @name handleEventIdOnlyOnce
 * @param {Function} actualFunction the target function
 * @returns {Promise.<any>}
 * 
 * @example
 * import { onDocumentWritten } from 'firebase-functions/v2/firestore';
 * import { idempotentFunction } from '@discue/idempotent-firebase-functions';
 * import handler from './handler.js'
 * const DOCUMENT_PATH = 'api_clients/{apiClientId}/queues/{queueId}/messages/{messageId}'
 * export const written = onDocumentWritten(DOCUMENT_PATH, idempotentFunction(handler))
 * 
 */
module.exports = function handleEventIdOnlyOnce(actualFunction) {
    return async (snapshot, context) => {
        let eventId
        if (!context && snapshot.id) {
            eventId = snapshot.id
        } else {
            eventId = context.eventId
        }
        const notHandled = await verifyEventHasNotBeenHandled(eventId)
        if (notHandled) {
            return actualFunction(snapshot, context)
        } else {
            return true
        }
    }
}