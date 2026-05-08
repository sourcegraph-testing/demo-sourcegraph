import { useContext, useState } from 'react'

import { PlatformContextProps } from '@sourcegraph/shared/src/platform/context'
import { ErrorLike, asError } from '@sourcegraph/shared/src/util/errors'

import { InsightsApiContext } from '../../../../../../core/backend/api-provider'
import { removeDashboardFromSettings } from '../../../../../../core/settings-action/dashboards'
import { SettingsBasedInsightDashboard } from '../../../../../../core/types'
import { lastValueFrom } from 'rxjs'

export interface UseDeleteDashboardHandlerProps extends PlatformContextProps<'updateSettings'> {
    dashboard: SettingsBasedInsightDashboard
    onSuccess: () => void
}

export interface useDeleteDashboardHandlerResult {
    loadingOrError: undefined | boolean | ErrorLike
    handler: () => Promise<void>
}

/**
 * Deletes dashboard from the settings subject (owner).
 */
export function useDeleteDashboardHandler(props: UseDeleteDashboardHandlerProps): useDeleteDashboardHandlerResult {
    const { dashboard, platformContext, onSuccess } = props
    const { getSubjectSettings, updateSubjectSettings } = useContext(InsightsApiContext)

    const [loadingOrError, setLoadingOrError] = useState<undefined | boolean | ErrorLike>()

    const handler = async (): Promise<void> => {
        setLoadingOrError(true)

        try {
            const settings = await lastValueFrom(getSubjectSettings(dashboard.owner.id))

            const updatedSettings = removeDashboardFromSettings(settings.contents, dashboard.settingsKey)

            await lastValueFrom(updateSubjectSettings(platformContext, dashboard.owner.id, updatedSettings))

            setLoadingOrError(false)
            onSuccess()
        } catch (error: unknown) {
            setLoadingOrError(asError(error))
        }
    }

    return { handler, loadingOrError }
}
