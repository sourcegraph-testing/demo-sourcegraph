import { isEqual } from 'lodash'
import { fromEvent, Observable, distinctUntilChanged, map } from 'rxjs'

import { Selection } from '@sourcegraph/extension-api-types'
import { lprToSelectionsZeroIndexed, parseHash } from '@sourcegraph/shared/src/util/url'

export function getSelectionsFromHash(): Selection[] {
    return lprToSelectionsZeroIndexed(parseHash(window.location.hash))
}

export function observeSelectionsFromHash(): Observable<Selection[]> {
    return fromEvent(window, 'hashchange').pipe(
        map(getSelectionsFromHash),
        distinctUntilChanged((a, b) => isEqual(a, b))
    )
}
