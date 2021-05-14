import React, { useCallback } from 'react'

import { Link } from '@sourcegraph/shared/src/components/Link'
import { TelemetryProps } from '@sourcegraph/shared/src/telemetry/telemetryService'

import { SyntaxHighlightedSearchQuery } from '../../components/SyntaxHighlightedSearchQuery'
import { repogroupList } from '../../repogroups/HomepageConfig'

import { SignUpCta } from './SignUpCta'

const exampleQueries = [
    { query: 'repo:^github\\.com/sourcegraph/sourcegraph$@3.17 CONTAINER_ID', patternType: 'literal' },
    { query: 'repo:sourcegraph/sourcegraph type:diff after:"1 week ago"', patternType: 'literal' },
    {
        query: 'lang:TypeScript useState OR useMemo',
        patternType: 'literal',
    },
    { query: 'lang:Python return :[v.], :[v.]', patternType: 'structural' },
]

export interface LoggedOutHomepageProps extends TelemetryProps {}

export const LoggedOutHomepage: React.FunctionComponent<LoggedOutHomepageProps> = props => {
    const SearchExampleClicked = useCallback(
        (url: string) => (): void => props.telemetryService.log('ExampleSearchClicked', { url }),
        [props.telemetryService]
    )

    return (
        <>
            <div className="search-page__repogroup-content container">
                <div className="search-page__help-content row">
                    <div className="search-page__help-content-example-searches mr-2">
                        <h3 className="search-page__help-content-header my-3">Example searches</h3>
                        <div className="mt-2">
                            {exampleQueries.map(example => (
                                <div key={example.query} className="pb-2">
                                    <Link
                                        to={`/search?q=${encodeURIComponent(example.query)}&patternType=${
                                            example.patternType
                                        }`}
                                        className="search-query-link text-monospace mb-2"
                                        onClick={SearchExampleClicked(
                                            `/search?q=${encodeURIComponent(example.query)}&patternType=${
                                                example.patternType
                                            }`
                                        )}
                                    >
                                        <SyntaxHighlightedSearchQuery query={example.query} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="search-page__help-content-header my-3">Search basics</h3>
                        <div className="mt-2">
                            <div className="mb-2">
                                Search for code without escaping.{' '}
                                <span className="search-page__inline-code text-code bg-code p-1">console.log("</span>{' '}
                                results in:
                            </div>
                            <LiteralCodeSearchExample />
                        </div>
                    </div>
                </div>

                <div className="mt-5 d-flex justify-content-center">
                    <div className="d-flex align-items-center search-page__cta">
                        <SignUpCta />
                        <div className="mt-2">
                            Prefer a local installation?{' '}
                            <a href="https://docs.sourcegraph.com" target="_blank" rel="noopener noreferrer">
                                Install Sourcegraph locally.
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="d-flex align-items-baseline mt-5 mb-3">
                        <h3 className="search-page__help-content-header mr-2">Repository group pages</h3>
                        <small className="text-monospace font-weight-normal small">
                            <span className="search-filter-keyword">repogroup:</span>
                            <i>name</i>
                        </small>
                    </div>
                    <div className="search-page__repogroup-list-cards">
                        {repogroupList.map(repogroup => (
                            <div className="d-flex align-items-center" key={repogroup.name}>
                                <img
                                    className="search-page__repogroup-list-icon mr-2"
                                    src={repogroup.homepageIcon}
                                    alt={`${repogroup.name} icon`}
                                />
                                <Link
                                    to={repogroup.url}
                                    className="search-page__repogroup-listing-title font-weight-bold"
                                >
                                    {repogroup.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const LiteralCodeSearchExample = React.memo(() => (
    <div className="search-page__literal-search-code-excerpt">
        <code className="code-excerpt">
            <table>
                <tbody>
                    <tr>
                        <td className="line" data-line="12" />
                        <td className="code annotated">
                            <div>
                                <span className="hl-source hl-js hl-react">
                                    <span className="hl-meta hl-function-call hl-method hl-js">
                                        <span className="hl-variable hl-other hl-readwrite hl-js">
                                            <span>
                                                <span>
                                                    <span>
                                                        <span>wsServer</span>
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="hl-punctuation hl-accessor hl-js">
                                            <span>
                                                <span>
                                                    <span>
                                                        <span>.</span>
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="hl-variable hl-function hl-js">
                                            <span>
                                                <span>
                                                    <span>
                                                        <span>on</span>
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="hl-meta hl-group hl-js">
                                            <span className="hl-punctuation hl-section hl-group hl-begin hl-js">
                                                <span>
                                                    <span>
                                                        <span>
                                                            <span>(</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="hl-meta hl-string hl-js">
                                                <span className="hl-string hl-quoted hl-double hl-js">
                                                    <span className="hl-punctuation hl-definition hl-string hl-begin hl-js">
                                                        <span>
                                                            <span>
                                                                <span>
                                                                    <span>"</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span>
                                                            <span>
                                                                <span>connection</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="hl-punctuation hl-definition hl-string hl-end hl-js">
                                                        <span>
                                                            <span>
                                                                <span>
                                                                    <span>"</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="hl-punctuation hl-separator hl-comma hl-js">
                                                <span>
                                                    <span>
                                                        <span>
                                                            <span>,</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                            <span> </span>
                                            <span className="hl-meta hl-function hl-js" />
                                            <span className="hl-meta hl-function hl-declaration hl-js">
                                                <span className="hl-punctuation hl-section hl-group hl-begin hl-js">
                                                    <span>
                                                        <span>
                                                            <span>
                                                                <span>(</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span className="hl-meta hl-binding hl-name hl-js">
                                                    <span className="hl-variable hl-parameter hl-function hl-js">
                                                        <span>
                                                            <span>
                                                                <span>
                                                                    <span>ws</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span className="hl-punctuation hl-separator hl-parameter hl-function hl-js">
                                                    <span>
                                                        <span>
                                                            <span>
                                                                <span>,</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span> </span>
                                                <span className="hl-meta hl-binding hl-name hl-js">
                                                    <span className="hl-variable hl-parameter hl-function hl-js">
                                                        <span>
                                                            <span>
                                                                <span>
                                                                    <span>req</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span className="hl-punctuation hl-section hl-group hl-end hl-js">
                                                    <span>
                                                        <span>
                                                            <span>
                                                                <span>)</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                                <span> </span>
                                                <span className="hl-storage hl-type hl-function hl-arrow hl-js">
                                                    <span>
                                                        <span>
                                                            <span>
                                                                <span>=</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span>
                                                            <span>
                                                                <span>
                                                                    <span>&gt;</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="hl-meta hl-function hl-js">
                                                <span> </span>
                                                <span className="hl-meta hl-block hl-js">
                                                    <span className="hl-punctuation hl-section hl-block hl-begin hl-js">
                                                        <span>
                                                            <span>
                                                                <span>
                                                                    <span>&#123;</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span />
                                                </span>
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="line" data-line="13" />
                        <td className="code annotated">
                            <div>
                                <span className="hl-source hl-js hl-react">
                                    <span className="hl-meta hl-function-call hl-method hl-js">
                                        <span className="hl-meta hl-group hl-js">
                                            <span className="hl-meta hl-function hl-js">
                                                <span className="hl-meta hl-block hl-js">
                                                    <span> </span>
                                                    <span className="hl-meta hl-function-call hl-method hl-js">
                                                        <span className="hl-support hl-type hl-object hl-console hl-js selection-highlight">
                                                            <span>
                                                                <span>
                                                                    <span>
                                                                        <span>console</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span className="hl-punctuation hl-accessor hl-js selection-highlight">
                                                            <span>
                                                                <span>
                                                                    <span>
                                                                        <span>.</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span className="hl-support hl-function hl-console hl-js selection-highlight">
                                                            <span>
                                                                <span>
                                                                    <span>
                                                                        <span>log</span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                        <span className="hl-meta hl-group hl-js">
                                                            <span className="hl-punctuation hl-section hl-group hl-begin hl-js selection-highlight">
                                                                <span>
                                                                    <span>
                                                                        <span>
                                                                            <span>(</span>
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            <span className="hl-meta hl-string hl-js">
                                                                <span className="hl-string hl-quoted hl-double hl-js">
                                                                    <span className="hl-punctuation hl-definition hl-string hl-begin hl-js selection-highlight">
                                                                        <span>
                                                                            <span>
                                                                                <span>
                                                                                    <span>"</span>
                                                                                </span>
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                    <span>
                                                                        <span>
                                                                            <span>
                                                                                <span>Connected</span>
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                    <span className="hl-punctuation hl-definition hl-string hl-end hl-js">
                                                                        <span>
                                                                            <span>
                                                                                <span>
                                                                                    <span>"</span>
                                                                                </span>
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            <span className="hl-punctuation hl-section hl-group hl-end hl-js">
                                                                <span>
                                                                    <span>
                                                                        <span>
                                                                            <span>)</span>
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span className="hl-punctuation hl-terminator hl-statement hl-js">
                                                        <span>
                                                            <span>
                                                                <span>
                                                                    <span>;</span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                    <span />
                                                </span>
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="line" data-line="14" />
                        <td className="code annotated">
                            <div>
                                <span className="hl-source hl-js hl-react">
                                    <span className="hl-meta hl-function-call hl-method hl-js">
                                        <span className="hl-meta hl-group hl-js">
                                            <span className="hl-meta hl-function hl-js">
                                                <span className="hl-meta hl-block hl-js" />
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="line" data-line="15" />
                        <td className="code annotated">
                            <div>
                                <span className="hl-source hl-js hl-react">
                                    <span className="hl-meta hl-function-call hl-method hl-js">
                                        <span className="hl-meta hl-group hl-js">
                                            <span className="hl-meta hl-function hl-js">
                                                <span className="hl-meta hl-block hl-js">
                                                    <span />
                                                    <span className="hl-meta hl-function-call hl-method hl-js">
                                                        <span className="hl-variable hl-other hl-readwrite hl-js">
                                                            <span>
                                                                <span>ws</span>
                                                            </span>
                                                        </span>
                                                        <span className="hl-punctuation hl-accessor hl-js">
                                                            <span>
                                                                <span>.</span>
                                                            </span>
                                                        </span>
                                                        <span className="hl-variable hl-function hl-js">
                                                            <span>
                                                                <span>on</span>
                                                            </span>
                                                        </span>
                                                        <span className="hl-meta hl-group hl-js">
                                                            <span className="hl-punctuation hl-section hl-group hl-begin hl-js">
                                                                <span>
                                                                    <span>(</span>
                                                                </span>
                                                            </span>
                                                            <span className="hl-meta hl-string hl-js">
                                                                <span className="hl-string hl-quoted hl-double hl-js">
                                                                    <span className="hl-punctuation hl-definition hl-string hl-begin hl-js">
                                                                        <span>
                                                                            <span>"</span>
                                                                        </span>
                                                                    </span>
                                                                    <span>
                                                                        <span>message</span>
                                                                    </span>
                                                                    <span className="hl-punctuation hl-definition hl-string hl-end hl-js">
                                                                        <span>
                                                                            <span>"</span>
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            <span className="hl-punctuation hl-separator hl-comma hl-js">
                                                                <span>
                                                                    <span>,</span>
                                                                </span>
                                                            </span>
                                                            <span> </span>
                                                            <span className="hl-meta hl-function hl-js" />
                                                            <span className="hl-meta hl-function hl-declaration hl-js">
                                                                <span className="hl-punctuation hl-section hl-group hl-begin hl-js">
                                                                    <span>
                                                                        <span>(</span>
                                                                    </span>
                                                                </span>
                                                                <span className="hl-meta hl-binding hl-name hl-js">
                                                                    <span className="hl-variable hl-parameter hl-function hl-js">
                                                                        <span>
                                                                            <span>data</span>
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                                <span className="hl-punctuation hl-section hl-group hl-end hl-js">
                                                                    <span>
                                                                        <span>)</span>
                                                                    </span>
                                                                </span>
                                                                <span> </span>
                                                                <span className="hl-storage hl-type hl-function hl-arrow hl-js">
                                                                    <span>
                                                                        <span>=</span>
                                                                    </span>
                                                                    <span>
                                                                        <span>
                                                                            <span>&gt;</span>
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                            <span className="hl-meta hl-function hl-js">
                                                                <span> </span>
                                                                <span className="hl-meta hl-block hl-js">
                                                                    <span className="hl-punctuation hl-section hl-block hl-begin hl-js">
                                                                        <span>
                                                                            <span>&#123;</span>
                                                                        </span>
                                                                    </span>
                                                                    <span />
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </code>
    </div>
))
