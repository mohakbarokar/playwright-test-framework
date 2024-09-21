import { test, expect } from '@playwright/test';
import { URL } from "../../constants/urls";
import { API_CONSTANTS } from "../../constants/api-constants";
import { GRAPHQL_QUERIES } from '../../constants/graphql-queries';

/**
 * Test suite for GraphQL API Testing using Playwright.
 * The suite tests the `/public/v2/graphql` API, querying for users' data,
 * pagination info, and validating the structure of response fields.
 */
test.describe('GraphQL API Testing with Playwright', () => {

    /**
     * Test to validate the GraphQL query fetching user details with pagination.
     * The query requests user data including pageInfo (pagination details),
     * total count of users, and individual user details (id, name, email, gender, status).
     */
    test('GraphQL API query should return users with pagination and node details', async ({ request }) => {
        // Endpoint for the GraphQL API
        const graphqlEndpoint = '/public/v2/graphql';
        const requestURL = URL.API_BASE_URL + graphqlEndpoint;

        // GraphQL query to fetch users' data with pagination and node details
        const graphqlQuery = {
            query: GRAPHQL_QUERIES.GET_USERS_QUERY
        };

        // Set the request headers with authorization and content type
        const headers = API_CONSTANTS.HEADERS

        // Log GraphQL Request details for debugging purposes
        console.log(`Request: POST ${requestURL}`);
        console.log(`Request Headers: ${JSON.stringify(headers, null, 2)}`);
        console.log(`Request Body: ${JSON.stringify(graphqlQuery, null, 2)}`);

        // Make the POST request to the GraphQL endpoint
        const response = await request.post(requestURL, {
            headers,
            data: graphqlQuery
        });

        // Log the response details for debugging purposes
        console.log(`Response Status: ${response.status()}`);
        const responseBody = await response.json();
        console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

        // Assert that the response status is 200 (success)
        expect(response.status(), 'Expecting status 200 for successful request').toBe(200);

        // Assert that the response body contains a 'data' field
        expect(responseBody, 'Expecting the response body to contain data').toHaveProperty('data');

        // Extract users data from the response body
        const usersData = responseBody.data.users;

        // Assert that 'pageInfo' exists and contains all required pagination fields
        expect(usersData, 'Expecting users data to have pageInfo field').toHaveProperty('pageInfo');
        expect(usersData.pageInfo, 'Expecting pageInfo to have endCursor field').toHaveProperty('endCursor');
        expect(usersData.pageInfo, 'Expecting pageInfo to have startCursor field').toHaveProperty('startCursor');
        expect(usersData.pageInfo, 'Expecting pageInfo to have hasNextPage field').toHaveProperty('hasNextPage');
        expect(usersData.pageInfo, 'Expecting pageInfo to have hasPreviousPage field').toHaveProperty('hasPreviousPage');

        // Assert that 'totalCount' exists and that there is at least 1 user
        expect(usersData, 'Expecting users data to have totalCount field').toHaveProperty('totalCount');
        expect(usersData.totalCount, 'Expecting totalCount to be greater than 0').toBeGreaterThan(0);

        // Assert that 'nodes' exists and contains a list of user objects
        expect(usersData, 'Expecting users data to have nodes field').toHaveProperty('nodes');
        expect(usersData.nodes.length, 'Expecting nodes to contain at least one user').toBeGreaterThan(0);

        // Loop through each user node and validate its structure
        usersData.nodes.forEach((user: any) => {
            expect(user, 'Expecting user to have id field').toHaveProperty('id');
            expect(user, 'Expecting user to have name field').toHaveProperty('name');
            expect(user, 'Expecting user to have email field').toHaveProperty('email');
            expect(user, 'Expecting user to have gender field').toHaveProperty('gender');
            expect(user, 'Expecting user to have status field').toHaveProperty('status');
        });
    });
});