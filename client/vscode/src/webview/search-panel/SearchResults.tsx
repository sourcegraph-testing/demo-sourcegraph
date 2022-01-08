import classNames from 'classnames'
import ShareOutlineIcon from 'mdi-react/ShareOutlineIcon'
import React, { useCallback } from 'react'

import { StreamingSearchResultsList } from '@sourcegraph/branded/src/search/results/StreamingSearchResultsList'
import { fetchHighlightedFileLineRanges } from '@sourcegraph/shared/src/backend/file'
import { FetchFileParameters } from '@sourcegraph/shared/src/components/CodeExcerpt'
import {
    AggregateStreamingSearchResults,
    CommitMatch,
    ContentMatch,
    PathMatch,
    RepositoryMatch,
    SearchMatch,
    SymbolMatch,
} from '@sourcegraph/shared/src/search/stream'
import { Settings, SettingsCascadeOrError } from '@sourcegraph/shared/src/settings/settings'

import { SourcegraphUri } from '../../file-system/SourcegraphUri'
import {
    CommitSearchResultFields,
    FileMatchFields,
    FileNamesVariables,
    RepositoryFields,
    SearchResult,
} from '../../graphql-operations'
import { WebviewPageProps } from '../platform/context'

import styles from './SearchResults.module.scss'

import { useQueryState } from '.'
interface SearchResultsProps extends WebviewPageProps {
    settings: SettingsCascadeOrError<Settings>
    instanceHostname: Promise<string>
    fullQuery: string
    getFiles: (variables: FileNamesVariables) => void
}

export const SearchResults = React.memo<SearchResultsProps>(
    ({ platformContext, theme, sourcegraphVSCodeExtensionAPI, settings, instanceHostname, fullQuery, getFiles }) => {
        const executedQuery = useQueryState(({ state }) => state.queryToRun.query)
        const searchResults = useQueryState(({ state }) => state.searchResults)
        const searchActions = useQueryState(({ actions }) => actions)
        const fetchHighlightedFileLineRangesWithContext = useCallback(
            (parameters: FetchFileParameters) => fetchHighlightedFileLineRanges({ ...parameters, platformContext }),
            [platformContext]
        )

        if (!searchResults) {
            // TODO this component should only be rendered when there are results, update props.
            return null
        }
        // TODO memoize (after above comment is resolved)
        const matches = convertGQLSearchToSearchMatches(searchResults)

        // TODO error state
        const results: AggregateStreamingSearchResults = {
            state: 'complete',
            results: matches,
            filters: searchResults.search?.results.dynamicFilters ?? [],
            progress: {
                matchCount: searchResults.search?.results.matchCount ?? 0,
                durationMs: searchResults.search?.results.elapsedMilliseconds ?? 0,
                repositoriesCount: searchResults.search?.results.repositoriesCount ?? 0,
                skipped: [],
            },
        }

        /**
         * Opens a SearchMatch in VS Code.
         */
        const onSelect = (result: SearchMatch): void => {
            ;(async () => {
                const host = await instanceHostname

                switch (result.type) {
                    case 'commit': {
                        return sourcegraphVSCodeExtensionAPI.openFile(`sourcegraph://${host}${result.url}`)
                    }
                    // TODO ensure component always calls this for VSCE (usually a link)
                    case 'path': {
                        const sourcegraphUri = SourcegraphUri.fromParts(host, result.repository, {
                            revision: result.commit,
                            path: result.path,
                        })
                        return sourcegraphVSCodeExtensionAPI.openFile(sourcegraphUri.uri)
                    }
                    case 'repo': {
                        searchActions.setQuery({ query: `repo:^${result.repository}$` })
                        getFiles({ repository: result.repository, revision: 'HEAD' })
                        return sourcegraphVSCodeExtensionAPI.openFile(`sourcegraph://${host}/${result.repository}`)
                    }
                    // TODO ensure component always calls this for VSCE (usually a link)
                    case 'symbol': {
                        // Incorporate commit OID in URI
                        const commit = result.commit!
                        const url = result.symbols[0].url

                        const { path, position } = SourcegraphUri.parse(`https:/${url}`, window.URL)
                        const sourcegraphUri = SourcegraphUri.fromParts(host, result.repository, {
                            revision: commit,
                            path,
                            position,
                        })
                        return sourcegraphVSCodeExtensionAPI.openFile(
                            sourcegraphUri.uri + sourcegraphUri.positionSuffix()
                        )
                    }
                    case 'content': {
                        // TODO we will have to pass SearchMatch to onSelect from within the FileMatchChildren component
                        // to be able to determine which line match to open to.
                        // For preview we open the first match.

                        const { lineNumber, offsetAndLengths } = result.lineMatches[0]
                        const [start] = offsetAndLengths[0]

                        const sourcegraphUri = SourcegraphUri.fromParts(host, result.repository, {
                            revision: result.commit,
                            path: result.path,
                            position: {
                                line: lineNumber,
                                character: start,
                            },
                        })
                        const uriToOpen = sourcegraphUri.uri + sourcegraphUri.positionSuffix()

                        console.log({ uriToOpen, result })

                        return sourcegraphVSCodeExtensionAPI.openFile(uriToOpen)
                    }
                }
            })().catch(error => {
                console.log(error)
                // TODO error handling
            })
        }

        const onShareResultsClick = (): void => {
            ;(async () => {
                const host = await instanceHostname
                const finalUri = host + '/search?q=' + encodeURIComponent(fullQuery)
                return sourcegraphVSCodeExtensionAPI.copyLink(finalUri)
            })().catch(error => {
                console.log(error)
                // TODO error handling
            })
        }

        return (
            <div className={styles.streamingSearchResultsContainer}>
                {/* TODO: This is a temporary searchResultsInfoBar */}
                <div className={classNames('flex-grow-1 result-container', styles.searchResultsInfoBar)}>
                    <div className={styles.row}>
                        <small>{results?.results.length} results found</small>
                        <div className={styles.expander} />
                        <ul className="nav align-items-center">
                            <li className={styles.divider} aria-hidden="true" />
                            <li className={classNames('mr-2', styles.navItem)} data-tooltip="Share results link">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary text-decoration-none"
                                    onClick={onShareResultsClick}
                                >
                                    <ShareOutlineIcon className="icon-inline mr-1" />
                                    <small>Share</small>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <StreamingSearchResultsList
                    fetchHighlightedFileLineRanges={fetchHighlightedFileLineRangesWithContext}
                    isLightTheme={theme === 'theme-light'}
                    executedQuery={executedQuery}
                    settingsCascade={settings}
                    telemetryService={platformContext.telemetryService}
                    // Default to false until we implement <SearchResultsInfoBar>, which is where this value is set.
                    allExpanded={false}
                    isSourcegraphDotCom={false}
                    searchContextsEnabled={true}
                    showSearchContext={true}
                    platformContext={platformContext}
                    results={results}
                    onSelect={onSelect}
                    // TODO "no results" video thumbnail assets
                    // In build, copy ui/assets/img folder to dist/
                    assetsRoot="https://raw.githubusercontent.com/sourcegraph/sourcegraph/main/ui/assets"
                />

                {searchResults.search?.results.limitHit && (
                    <div className="alert alert-info d-flex m-3">
                        <p className="m-0">
                            <strong>Result limit hit.</strong> Modify your search with <code>count:</code> to return
                            additional items.
                        </p>
                    </div>
                )}
            </div>
        )
    }
)

export function convertGQLSearchToSearchMatches(searchResult: SearchResult): SearchMatch[] {
    return (
        searchResult.search?.results.results.map(result => {
            switch (result.__typename) {
                case 'FileMatch': {
                    return convertFileMatch(result)
                }
                case 'CommitSearchResult':
                    return convertCommitSearchResult(result)
                case 'Repository':
                    return convertRepository(result)
            }
        }) ?? []
    )
}

function convertFileMatch(
    result: {
        __typename: 'FileMatch'
    } & FileMatchFields
): ContentMatch | SymbolMatch | PathMatch {
    if (result.symbols.length > 0) {
        const symbolMatch: SymbolMatch = {
            type: 'symbol',
            path: result.file.path,
            repository: result.repository.name,
            symbols: result.symbols.map(symbol => ({ ...symbol, containerName: symbol.containerName ?? '' })),
            repoStars: result.repository.stars,
            commit: result.file.commit.oid,
        }
        return symbolMatch
    }
    if (result.lineMatches.length > 0) {
        const lines = result.file.content.split('\n')

        const lineMatchesWithLine = result.lineMatches.map(match => {
            const line = lines[match.lineNumber]

            return {
                line,
                ...match,
            }
        })

        const contentMatch: ContentMatch = {
            type: 'content',
            path: result.file.path,
            repository: result.repository.name,
            lineMatches: lineMatchesWithLine,
            repoStars: result.repository.stars,
            commit: result.file.commit.oid,
        }

        return contentMatch
    }
    // TODO: Doesn't necessarily make this a patch match (just no line matches?)
    const pathMatch: PathMatch = {
        type: 'path',
        path: result.file.path,
        repository: result.repository.name,
        repoStars: result.repository.stars,
        commit: result.file.commit.oid,
    }
    return pathMatch
}

function convertCommitSearchResult(
    result: {
        __typename: 'CommitSearchResult'
    } & CommitSearchResultFields
): CommitMatch {
    let content: string | undefined
    const ranges: number[][] = []
    for (const match of result.matches) {
        content = match.body.text
        for (const highlight of match.highlights) {
            ranges.push([highlight.line, highlight.character, highlight.length])
        }
    }

    const commitMatch: CommitMatch = {
        type: 'commit',
        label: result.label.text,
        url: result.commit.url,
        detail: result.detail.text,
        repository: result.commit.repository.name,
        repoStars: result.commit.repository.stars,
        content: content || result.commit.message,
        ranges,
    }

    return commitMatch
}

function convertRepository(
    result: {
        __typename: 'Repository'
        description: string
    } & RepositoryFields
): RepositoryMatch {
    const repositoryMatch: RepositoryMatch = {
        type: 'repo',
        repository: result.name,
        repoStars: result.stars,
        description: result.description,
    }

    return repositoryMatch
}