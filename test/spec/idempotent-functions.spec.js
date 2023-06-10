const { expect } = require('chai')
const { nanoid } = require('nanoid')
const { idempotentFunction } = require('../../lib/index.js')

describe('IdempotentFunction', () => {
    it('calls callback if event id has not been recorded', async () => {
        const eventId = nanoid()
        let calls = 0
        const callback = idempotentFunction(() => {
            calls++
        })
        await callback(null, { eventId })
        await callback(null, { eventId })
        await callback(null, { eventId })
        await callback(null, { eventId })
        expect(calls).to.equal(1)
    })
    it('can also deal with v2 functions event handler', async () => {
        const eventId = nanoid()
        let calls = 0
        const callback = idempotentFunction(() => {
            calls++
        })
        await callback({ id: eventId })
        await callback({ id: eventId })
        await callback({ id: eventId })
        await callback({ id: eventId })
        expect(calls).to.equal(1)
    })
    it('records all given event ids and calls callback exactly once per id', async () => {
        let calls = {}
        const callback = idempotentFunction((_, { eventId }) => {
            if (!calls[eventId]) {
                calls[eventId] = 0
            }
            calls[eventId]++
        })
        for (let i = 0, n = 50; i < n; i++) {
            const eventId = nanoid()
            await callback(null, { eventId })
            await callback(null, { eventId })
        }
        expect(Object.keys(calls)).to.have.length(50)
        Object.values(calls).forEach((value) => {
            expect(value).to.equal(1)
        })
    })
    it('returns true if event id was already handled', async () => {
        const eventId = nanoid()
        const callback = idempotentFunction(() => { })
        await callback(null, { eventId })
        const handled = await callback(null, { eventId })
        expect(handled).to.be.true
    })
})
