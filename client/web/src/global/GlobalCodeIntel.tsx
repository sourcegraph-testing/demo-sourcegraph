import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import classNames from 'classnames'
import MenuUpIcon from 'mdi-react/MenuUpIcon'
import React, { useCallback } from 'react'
import { UncontrolledPopover } from 'reactstrap'

import { HoveredToken } from '@sourcegraph/codeintellify'
import { useQuery } from '@sourcegraph/http-client'
import { RepoFileLink } from '@sourcegraph/shared/src/components/RepoFileLink'
import { Resizable } from '@sourcegraph/shared/src/components/Resizable'
import {
    RepoSpec,
    RevisionSpec,
    FileSpec,
    ResolvedRevisionSpec,
    toPositionOrRangeQueryParameter,
    appendLineRangeQueryParameter,
} from '@sourcegraph/shared/src/util/url'
import { Button, LoadingSpinner, useLocalStorage } from '@sourcegraph/wildcard'

import { CoolCodeIntelReferencesResult, CoolCodeIntelReferencesVariables, Maybe } from '../graphql-operations'

import styles from './GlobalCodeIntel.module.scss'
import { FETCH_REFERENCES_QUERY } from './GlobalCodeIntelQueries'

const SHOW_COOL_CODEINTEL = localStorage.getItem('coolCodeIntel') !== null

export const GlobalCodeIntel: React.FunctionComponent<{
    hoveredToken?: HoveredToken & RepoSpec & RevisionSpec & FileSpec & ResolvedRevisionSpec
    showPanel: boolean
}> = props => {
    if (!SHOW_COOL_CODEINTEL) {
        return null
    }

    if (props.showPanel) {
        return <CoolCodeIntelResizablePanel {...props} />
    }

    return (
        <ul className={classNames('nav', styles.globalCodeintel)}>
            <li className="nav-item">
                <CoolCodeIntelPopover {...props} />
            </li>
        </ul>
    )
}

/** A button that toggles the visibility of the ExtensionDevTools element in a popover. */
export const CoolCodeIntelPopover = React.memo<{
    hoveredToken?: HoveredToken & RepoSpec & RevisionSpec & FileSpec & ResolvedRevisionSpec
}>(props => (
    <>
        <Button id="cool-code-intel-popover" className="text-decoration-none px-2" variant="link">
            <span className="text-muted">Cool Code Intel</span> <MenuUpIcon className="icon-inline" />
        </Button>
        <UncontrolledPopover
            placement="bottom-start"
            target="cool-code-intel-popover"
            hideArrow={true}
            popperClassName="border-0 rounded-0"
        >
            <CoolCodeIntel {...props} />
        </UncontrolledPopover>
    </>
))

const CoolCodeIntel: React.FunctionComponent<{
    hoveredToken?: HoveredToken & RepoSpec & RevisionSpec & FileSpec & ResolvedRevisionSpec
}> = props => {
    const [tabIndex, setTabIndex] = useLocalStorage(LAST_TAB_STORAGE_KEY, 0)
    const handleTabsChange = useCallback((index: number) => setTabIndex(index), [setTabIndex])

    return (
        <Tabs
            defaultIndex={tabIndex}
            className={classNames('card border-0 rounded-0', styles.coolCodeIntelTabs)}
            onChange={handleTabsChange}
        >
            <div className="tablist-wrapper w-100 align-items-center">
                <TabList>
                    {TABS.map(({ label, id }) => (
                        <Tab className="d-flex flex-1 justify-content-around" key={id} data-tab-content={id}>
                            {label}
                        </Tab>
                    ))}
                </TabList>
            </div>

            <TabPanels>
                {TABS.map(tab => (
                    <TabPanel key={tab.id}>
                        <tab.component hoveredToken={props.hoveredToken} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    )
}

export interface CoolCodeIntelPopoverTabProps {
    hoveredToken?: HoveredToken & RepoSpec & RevisionSpec & FileSpec & ResolvedRevisionSpec
}

const LAST_TAB_STORAGE_KEY = 'CoolCodeIntel.lastTab'

type CoolCodeIntelTabID = 'references' | 'token'

interface CoolCodeIntelToolsTab {
    id: CoolCodeIntelTabID
    label: string
    component: React.ComponentType<CoolCodeIntelPopoverTabProps>
}

export const TokenPanel: React.FunctionComponent<CoolCodeIntelPopoverTabProps> = props => (
    <>
        {props.hoveredToken ? (
            <code>
                Line: {props.hoveredToken.line}
                {'\n'}
                Character: {props.hoveredToken.character}
                {'\n'}
                Repo: {props.hoveredToken.repoName}
                {'\n'}
                Commit: {props.hoveredToken.commitID}
                {'\n'}
                Path: {props.hoveredToken.filePath}
                {'\n'}
            </code>
        ) : (
            <p>
                <i>No token</i>
            </p>
        )}
    </>
)

export const ReferencesPanel: React.FunctionComponent<CoolCodeIntelPopoverTabProps> = props => (
    <div className={styles.coolCodeIntelReferences}>
        {props.hoveredToken && <ReferencesList hoveredToken={props.hoveredToken} />}
    </div>
)

interface Reference {
    __typename?: 'Location' | undefined
    resource: {
        __typename?: 'GitBlob' | undefined
        path: string
        repository: {
            __typename?: 'Repository' | undefined
            name: string
        }
        commit: {
            __typename?: 'GitCommit' | undefined
            oid: string
        }
    }
    range: Maybe<{
        __typename?: 'Range' | undefined
        start: {
            __typename?: 'Position' | undefined
            line: number
            character: number
        }
        end: {
            __typename?: 'Position' | undefined
            line: number
            character: number
        }
    }>
}

export const ReferencesList: React.FunctionComponent<{
    hoveredToken: HoveredToken & RepoSpec & RevisionSpec & FileSpec & ResolvedRevisionSpec
}> = props => {
    const { data, error, loading } = useQuery<CoolCodeIntelReferencesResult, CoolCodeIntelReferencesVariables>(
        FETCH_REFERENCES_QUERY,
        {
            variables: {
                repository: props.hoveredToken.repoName,
                commit: props.hoveredToken.commitID,
                path: props.hoveredToken.filePath,
                // ATTENTION: Off by one ahead!!!!
                line: props.hoveredToken.line - 1,
                character: props.hoveredToken.character - 1,
                after: null,
            },
            // Cache this data but always re-request it in the background when we revisit
            // this page to pick up newer changes.
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'network-only',
        }
    )

    // If we're loading and haven't received any data yet
    if (loading && !data) {
        return (
            <>
                <LoadingSpinner className="mx-auto my-4" />
            </>
        )
    }

    // If we received an error before we had received any data
    if (error && !data) {
        throw new Error(error.message)
    }

    // If there weren't any errors and we just didn't receive any data
    if (!data || !data.repository?.commit?.blob?.lsif?.references) {
        return <>Nothing found</>
    }

    // TODO: can't we get the "displaying X out of Y references" data?
    const references = data.repository.commit?.blob?.lsif?.references.nodes

    const buildFileURL = (reference: Reference): string => {
        const path = `/${reference.resource.repository.name}/-/blob/${reference.resource.path}`

        if (reference.range !== null) {
            return appendLineRangeQueryParameter(
                path,
                toPositionOrRangeQueryParameter({
                    range: {
                        start: { line: reference.range.start.line + 1, character: reference.range.start.character + 1 },
                        end: { line: reference.range.end.line + 1, character: reference.range.end.character + 1 },
                    },
                })
            )
        }
        return path
    }

    return (
        <>
            <ul className="list-unstyled">
                {references?.map(reference => {
                    const fileURL = buildFileURL(reference)
                    return (
                        <li key={fileURL}>
                            <RepoFileLink
                                repoURL={`/${reference.resource.repository.name}`}
                                repoName={reference.resource.repository.name}
                                filePath={`${reference.resource.path} [Line ${
                                    reference.range?.start.line || 'undefined'
                                }]`}
                                fileURL={fileURL}
                            />
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

const TABS: CoolCodeIntelToolsTab[] = [
    { id: 'token', label: 'Token', component: TokenPanel },
    { id: 'references', label: 'References', component: ReferencesPanel },
]

interface CoolCodeIntelPanelProps {
    // fetchHighlightedFileLineRanges: (parameters: FetchFileParameters, force?: boolean) => Observable<string[][]>
    hoveredToken?: HoveredToken & RepoSpec & RevisionSpec & FileSpec & ResolvedRevisionSpec
}

export const CoolCodeIntelPanel = React.memo<CoolCodeIntelPanelProps>(props => {
    const [tabIndex, setTabIndex] = useLocalStorage(LAST_TAB_STORAGE_KEY, 0)
    const handleTabsChange = useCallback((index: number) => setTabIndex(index), [setTabIndex])

    return (
        <Tabs className={styles.panel} index={tabIndex} onChange={handleTabsChange}>
            <div className={classNames('tablist-wrapper d-flex justify-content-between sticky-top', styles.header)}>
                <TabList>
                    <div className="d-flex w-100">
                        {TABS.map(({ label, id }) => (
                            <Tab key={id}>
                                <span className="tablist-wrapper--tab-label" role="none">
                                    {label}
                                </span>
                            </Tab>
                        ))}
                    </div>
                </TabList>
            </div>
            <TabPanels className={styles.tabs}>
                {TABS.map(tab => (
                    <TabPanel key={tab.id} className={styles.tabsContent} data-testid="panel-tabs-content">
                        <tab.component hoveredToken={props.hoveredToken} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    )
})

export const CoolCodeIntelResizablePanel: React.FunctionComponent<CoolCodeIntelPanelProps> = props => (
    <Resizable
        className={styles.resizablePanel}
        handlePosition="top"
        defaultSize={350}
        storageKey="panel-size"
        element={<CoolCodeIntelPanel {...props} />}
    />
)
