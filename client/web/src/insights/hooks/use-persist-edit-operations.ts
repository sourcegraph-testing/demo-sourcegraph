import { groupBy } from 'lodash'
import { useCallback, useContext } from 'react'

import { PlatformContextProps } from '@sourcegraph/shared/src/platform/context'

import { InsightsApiContext } from '../core/backend/api-provider'
import { applyEditOperations, SettingsOperation } from '../core/settings-action/edits'
import { lastValueFrom } from 'rxjs'

interface UsePersistEditOperationsProps extends PlatformContextProps<'updateSettings'> {}

interface UsePersistEditOperationsOutput {
    persist: (operations: SettingsOperation[]) => Promise<void>
}

/**
 * This react hook simplifies persist (update logic) over the settings cascade subject's setting file.
 */
export function usePersistEditOperations(props: UsePersistEditOperationsProps): UsePersistEditOperationsOutput {
    const { platformContext } = props
    const { getSubjectSettings, updateSubjectSettings } = useContext(InsightsApiContext)

    const persist = useCallback(
        async (operations: SettingsOperation[]) => {
            const subjectsToUpdate = groupBy(operations, operation => operation.subjectId)

            const subjectUpdateRequests = Object.keys(subjectsToUpdate).map(subjectId => {
                async function updateSettings(): Promise<void> {
                    const editOperations = subjectsToUpdate[subjectId]

                    // Get jsonc subject settings file.
                    const settings = await lastValueFrom(getSubjectSettings(subjectId))

                    // Modify this jsonc file according to this subject's operations
                    const nextSubjectSettings = applyEditOperations(settings.contents, editOperations)

                    // Call the async update mutation for the new subject's settings file
                    await lastValueFrom(updateSubjectSettings(platformContext, subjectId, nextSubjectSettings))
                }

                return updateSettings()
            })

            await Promise.all(subjectUpdateRequests)
        },
        [platformContext, getSubjectSettings, updateSubjectSettings]
    )

    return { persist }
}
