import { fetchRepositoriesBySearch } from '../requests/fetch-repositories-by-search'
import { lastValueFrom } from 'rxjs'

/**
 * Get list of resolved repositories from the search API.
 *
 * @param query - search query
 */
export const getResolvedSearchRepositories = (query: string): Promise<string[]> =>
    lastValueFrom(fetchRepositoriesBySearch(query))
