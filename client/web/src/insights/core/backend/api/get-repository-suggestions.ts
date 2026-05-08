import { fetchRepositorySuggestions, RepositorySuggestion } from '../requests/fetch-repository-suggestions'
import { lastValueFrom } from 'rxjs'

/**
 * Returns array of repository suggestions.
 *
 * @param possibleRepositoryQuery - raw string with search value for repository
 */
export const getRepositorySuggestions = (possibleRepositoryQuery: string): Promise<RepositorySuggestion[]> =>
    lastValueFrom(fetchRepositorySuggestions(possibleRepositoryQuery))
