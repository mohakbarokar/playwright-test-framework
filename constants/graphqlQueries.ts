export const graphqlQueries = {
    getUsersQuery: `query {
      users {
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
        nodes {
          id
          name
          email
          gender
          status
        }
      }
    }`
};