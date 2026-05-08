import { describe, test } from 'mocha'
import { merge, catchError, lastValueFrom } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

import { checkOk } from '@sourcegraph/shared/src/backend/fetch'
import { getConfig } from '@sourcegraph/shared/src/testing/config'

describe('Native integrations regression test suite', () => {
    const { sourcegraphBaseUrl } = getConfig('sourcegraphBaseUrl')
    test('Native integration assets are served by the instance', async () => {
        const assets = [
            '/.assets/extension/scripts/integration.bundle.js',
            '/.assets/extension/scripts/phabricator.bundle.js',
            '/.assets/extension/scripts/extensionHostWorker.bundle.js',
            '/.assets/extension/css/style.bundle.css',
            '/.assets/extension/extensionHostFrame.html',
        ]
        await lastValueFrom(merge(
            ...assets.map(asset =>
                fromFetch(new URL(asset, sourcegraphBaseUrl).href, { selector: response => [checkOk(response)] }).pipe(
                    catchError(() => {
                        throw new Error('Error fetching native integration asset: ' + asset)
                    })
                )
            )
        ))
    })
})
