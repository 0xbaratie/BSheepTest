import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core'

const SHEEPUP_ENDPOINT =
	'https://api.studio.thegraph.com/query/47190/sheepup/version/latest'
const SHEEPUP_API_KEY = process.env.NEXT_PUBLIC_SHEEPUP_API_KEY

const client = new ApolloClient({
	uri: SHEEPUP_ENDPOINT,
	cache: new InMemoryCache(),
	headers: {
		Authorization: SHEEPUP_API_KEY || '',
	},
})

export async function GetAllSheepStatus(): Promise<any> {
	const query = gql`
		query SheepUp {
			sheepeneds {
				id
				level
				shippedAt
				blockNumber
			}
		}
	`

	const response = await client.query({
		query,
	})
	return response.data
}
