import classNames from 'classnames'
import * as React from 'react'

import { Link } from '@sourcegraph/wildcard'

export const DirectImportRepoAlert: React.FunctionComponent<{ className?: string }> = ({ className = '' }) => (
    <>
        {['dev', 'docker-container'].includes(window.context.deployType) && (
            <div className={classNames('alert alert-info', className)}>
                Very large repository? See{' '}
                <Link to="/help/admin/repo/pre_load_from_local_disk#add-repositories-already-cloned-to-disk">
                    how to reuse an existing local clone
                </Link>{' '}
                to speed this up.
            </div>
        )}
    </>
)
