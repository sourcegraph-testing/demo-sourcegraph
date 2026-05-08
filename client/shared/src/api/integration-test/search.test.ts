import { take, lastValueFrom } from 'rxjs'

import { wrapRemoteObservable } from '../client/api/common'

import { integrationTestContext } from './testHelpers'

describe('search (integration)', () => {
    test('registers a query transformer', async () => {
        const { extensionAPI, extensionHostAPI } = await integrationTestContext()

        // Register the provider and call it
        extensionAPI.search.registerQueryTransformer({
            transformQuery: () => 'bar',
        })
        await extensionAPI.internal.sync()
        expect(
            await lastValueFrom(wrapRemoteObservable(extensionHostAPI.transformSearchQuery('foo')).pipe(take(1)))
        ).toEqual('bar')
    })

    test('unregisters a query transformer', async () => {
        const { extensionHostAPI, extensionAPI } = await integrationTestContext()

        // Register the provider and call it
        const subscription = extensionAPI.search.registerQueryTransformer({
            transformQuery: () => 'bar',
        })
        await extensionAPI.internal.sync()
        // Unregister the provider and ensure it's removed.
        subscription.unsubscribe()
        await extensionAPI.internal.sync()
        expect(
            await lastValueFrom(wrapRemoteObservable(extensionHostAPI.transformSearchQuery('foo')).pipe(take(1)))
        ).toEqual('foo')
    })

    test('supports multiple query transformers', async () => {
        const { extensionHostAPI, extensionAPI } = await integrationTestContext()

        // Register the provider and call it
        extensionAPI.search.registerQueryTransformer({ transformQuery: (query: string) => `${query} bar` })
        extensionAPI.search.registerQueryTransformer({ transformQuery: (query: string) => `${query} qux` })
        await extensionAPI.internal.sync()
        expect(
            await lastValueFrom(wrapRemoteObservable(extensionHostAPI.transformSearchQuery('foo')).pipe(take(1)))
        ).toEqual('foo bar qux')
    })
})
