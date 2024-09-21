export const GRAPHQL_QUERIES = {
    GET_USERS_QUERY: `query {
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