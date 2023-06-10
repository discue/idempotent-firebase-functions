const { expect } = require('chai')
const { nanoid } = require('nanoid')
const { idempotentFunctionLeases } = require('../../lib/index.js')
const { leaseResource, runOnlyIfLeaseIsNotActive, unleaseResource, verifyEventHasNotBeenHandled } = idempotentFunctionLeases

const { Firestore } = require("firebase-admin/firestore")
const firestore = new Firestore()

describe('IdempotentFunctionEvents', () => {

    describe('.runOnlyIfLeaseIsNotActive', () => {
        it('returns the return value of the callback', async () => {
            const expected = '4815162342'
            const result = await runOnlyIfLeaseIsNotActive(nanoid(), () => expected)
            expect(result).to.equal(expected)
        })
        it('removes the lease afterward', async () => {
            const expected = '4815162342'
            const result = await runOnlyIfLeaseIsNotActive(nanoid(), () => expected)
            expect(result).to.equal(expected)

            const docs = await firestore.collection('_firestore_leases').listDocuments()
            expect(docs).to.have.length(0)
        })
        it('returns immediately if lease is active', async () => {
            const expected = '4815162342'
            const identifier = nanoid()

            runOnlyIfLeaseIsNotActive(identifier, () => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 5000)
                })
            })

            // wait a bit to ensure lock was leased
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const result = await runOnlyIfLeaseIsNotActive(identifier, () => expected)
            expect(result).to.equal(null)
        })
    })
    describe('.verifyEventHasNotBeenHandled', () => {
        it('return true if event was not handled yet', async () => {
            const id = nanoid()
            const handled = await verifyEventHasNotBeenHandled(id)
            expect(handled).to.be.true
        })
        it('returns false if it was handled', async () => {
            const id = nanoid()
            let handled = await verifyEventHasNotBeenHandled(id)
            expect(handled).to.be.true

            handled = await verifyEventHasNotBeenHandled(id)
            expect(handled).to.be.false
        })
    })
    describe('.leaseResource', () => {
        it('return true if event was not handled yet', async () => {
            const id = nanoid()
            const handled = await leaseResource(id)
            expect(handled).to.be.true
        })
        it('return false if event if lease is active', async () => {
            const id = nanoid()
            let handled = await leaseResource(id)
            expect(handled).to.be.true

            handled = await leaseResource(id)
            expect(handled).to.be.false
        })
        it('return true if event lease has expired', async () => {
            const id = nanoid()
            let handled = await leaseResource(id, 500)
            expect(handled).to.be.true

            await new Promise((resolve) => setTimeout(resolve, 2000))

            handled = await leaseResource(id)
            expect(handled).to.be.true
        })
    })
    describe('.unleaseResource', () => {
        it('returns true if no lease was stored before', async () => {
            const id = nanoid()
            const unleased = await unleaseResource(id)
            expect(unleased).to.be.true
        })
        it('returns true after event lease was deleted', async () => {
            const id = nanoid()
            let handled = await leaseResource(id)
            expect(handled).to.be.true

            handled = await leaseResource(id)
            expect(handled).to.be.false

            const unleased = await unleaseResource(id)
            expect(unleased).to.be.true

            handled = await leaseResource(id)
            expect(handled).to.be.true
        })
    })
})
