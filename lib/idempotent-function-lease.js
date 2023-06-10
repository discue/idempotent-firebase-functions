const { Firestore } = require("firebase-admin/firestore")
const firestore = new Firestore()

async function runWithDatabase(callback) {
    return callback.call(null, firestore)
}

async function runWithTransaction(callback) {
    return runWithDatabase((firestore) => {
        return firestore.runTransaction(callback)
    })
}

async function getDbRef(ids, collectionName = '_firestore_events') {
    return runWithDatabase(database => {
        return database.collection(collectionName).doc(ids)
    })
}

/**
 * Creates a lease and calls the callback only if lease was aquired. 
 * Will also remove the lease after callback finished
 *
 * @name runOnlyIfLeaseIsNotActive
 * @param {String} identifier the resource identifier
 * @param {Function} callback the target function
 * @returns {Promise.<any>}
 */
module.exports.runOnlyIfLeaseIsNotActive = async function (identifier, callback) {
    const leased = await module.exports.leaseResource(identifier)
    if (!leased) {
        return null
    }

    try {
        const result = await callback()
        return result
    } finally {
        await module.exports.unleaseResource(identifier)
    }
}

/**
 * Deletes the lease of the current resource to make it available for processing again.
 *
 * @name unleaseResource
 * @param {String} identifier the resource identifier
 * @returns {Promise.<any>}
 */
module.exports.unleaseResource = async function (identifier) {
    const ref = await getDbRef(identifier, '_firestore_leases')

    return runWithTransaction(transaction => {
        return transaction.get(ref).then(document => {
            if (document.exists) {
                transaction.delete(ref)
            }
            return true
        })
    })
}

/**
 * Returns true if the current lease does not exist or does exist and is not active. 
 * Registers the current id and stores it with a lease time.
 *
 * @name leaseResource
 * @param {String} [identifier] the resource identifier
 * @param {Number} [leaseTimeMillis=60_000] how long the lease should be active
 * @returns {Promise.<any>}
 */
module.exports.leaseResource = async function (identifier, minleaseTimeMillis = 60 * 1000) {
    const ref = await getDbRef(identifier, '_firestore_leases')

    return runWithTransaction(transaction => {
        return transaction.get(ref).then(document => {
            if (document.exists) {
                const now = Date.now()
                const lease = document.data().lease
                if (now < lease)
                    return false
            }
            transaction.set(
                ref, { lease: Date.now() + minleaseTimeMillis })
            return true
        })
    })
}

/**
 * Returns true if the given event was not handled before. 
 * Registers the current id and stores it with a lease time.
 *
 * @name verifyEventHasNotBeenHandled
 * @param {String} [eventId] the function's event id
 * @param {Number} [leaseTimeMillis=60_000] how long the lease should be active
 * @returns {Promise.<any>}
 */
module.exports.verifyEventHasNotBeenHandled = async function (eventId, leaseTimeMillis = 60 * 1000) {
    const ref = await getDbRef(eventId)

    return runWithTransaction(transaction => {
        return transaction.get(ref).then(document => {
            if (document.exists) {
                return false
            }
            transaction.set(
                ref, { lease: Date.now() + leaseTimeMillis })
            return true
        })
    })
}
