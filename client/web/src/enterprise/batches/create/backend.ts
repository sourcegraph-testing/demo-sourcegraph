import { dataOrThrowErrors, gql } from '@sourcegraph/shared/src/graphql/graphql'

import { requestGraphQL } from '../../../backend/graphql'
import {
    BatchSpecExecutionCreateFields,
    CreateBatchSpecExecutionResult,
    CreateBatchSpecExecutionVariables,
    Scalars,
} from '../../../graphql-operations'
import { lastValueFrom } from 'rxjs'

export async function createBatchSpecExecution(
    spec: string,
    namespace: Scalars['ID']
): Promise<BatchSpecExecutionCreateFields> {
    const result = await lastValueFrom(requestGraphQL<CreateBatchSpecExecutionResult, CreateBatchSpecExecutionVariables>(
        gql`
            mutation CreateBatchSpecExecution($spec: String!, $namespace: ID) {
                createBatchSpecExecution(spec: $spec, namespace: $namespace) {
                    ...BatchSpecExecutionCreateFields
                }
            }

            fragment BatchSpecExecutionCreateFields on BatchSpecExecution {
                id
                namespace {
                    url
                }
            }
        `,
        { spec, namespace }
    ))
    return dataOrThrowErrors(result).createBatchSpecExecution
}
