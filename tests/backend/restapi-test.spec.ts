import { test, expect } from '@playwright/test';
import { URL } from '../../constants/urls';
import { TEST_USER_DETAILS } from "../../constants/user-details";
import { API_CONSTANTS } from "../../constants/api-constants";

/**
 * API Testing with Playwright for REST API's
 */
test.describe('API Testing with Playwright', () => {
    let userId: number; // Variable to store the user ID

    /**
     * Pre requisite Test case to cleanup data if previous execution failed and residue data is left in system.
     * GET /public/v2/users & DELETE
     */
    test.beforeAll(`GET & DELETE /public/v2/users?email=${TEST_USER_DETAILS.primary.email} should delete user if existed`, async ({ request }) => {
        // Check if a user with the specified email already exists
        const getUserResponse = await request.get(`${URL.API_BASE_URL}/public/v2/users?email=${encodeURIComponent(TEST_USER_DETAILS.primary.email)}`, {
            headers: API_CONSTANTS.HEADERS,
        });

        // Log the response details
        console.log(`GET Response Status: ${getUserResponse.status()}`);
        const responseBody = await getUserResponse.json();

        // If user exists, delete the user
        if (responseBody && responseBody.length > 0) {
            userId = responseBody[0].id; // Get the user Id
            console.log(`User found with ID: ${userId}, deleting...`);

            const deleteResponse = await request.delete(`${URL.API_BASE_URL}/public/v2/users/${userId}`, {
                headers: API_CONSTANTS.HEADERS,
            });

            console.log(`DELETE Response Status: ${deleteResponse.status()}`);
            
            // Expect a 204 No Content response
            expect(deleteResponse.status(),`Deletion Successful and status 204`).toBe(204);
        } else {
            console.log('No existing user found with the specified email.');
        }
    });

    /**
     * Test case to create a new user.
     * POST /public/v2/users
     */
    test('POST /public/v2/users should create a user', async ({ request }) => {
        const endpoint = '/public/v2/users';
        const requestURL = URL.API_BASE_URL + endpoint;

        // Prepare the request body
        const requestBody = TEST_USER_DETAILS.primary;

        // Set the request headers
        const headers = API_CONSTANTS.HEADERS;

        // Logging Request details
        console.log(`Request: POST ${requestURL}`);
        console.log(`Request Headers: ${JSON.stringify(headers, null, 2)}`);
        console.log(`Request Body: ${JSON.stringify(requestBody, null, 2)}`);

        // Start measuring response time
        const startTime = Date.now();

        // Make the POST request
        const response = await request.post(requestURL, {
            headers: headers,
            data: requestBody
        });

        // End measuring response time
        const duration = Date.now() - startTime;

        // Log the response details
        console.log(`Response Status: ${response.status()}`);
        const responseBody = await response.json();
        console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

        // Validate the response status and body
        expect(response.status(), `Expected response status 201`).toBe(201);
        // User creation should return a 201 status code
        expect(responseBody, `Expected response body to have parameter 'id'`).toHaveProperty('id'); // Check if the ID is present

        // Validate that the response contains the expected properties
        expect(responseBody.name, `Expected response to have Parameter Name as : ${requestBody.name}`).toBe(requestBody.name);
        expect(responseBody.gender, `Expected response to have Parameter Gender as : ${requestBody.gender}`).toBe(requestBody.gender);
        expect(responseBody.email, `Expected response to have Parameter email as : ${requestBody.email}`).toBe(requestBody.email);
        expect(responseBody.status, `Expected response to have Parameter status as : ${requestBody.status}`).toBe(requestBody.status);

        // Assert that the response time is within an acceptable range
        expect(duration, `Expected response time to be under : ${API_CONSTANTS.EXPECTED_RESPONSE_TIME}`).toBeLessThan(API_CONSTANTS.EXPECTED_RESPONSE_TIME);

        // Store the user ID for use in subsequent tests
        userId = responseBody.id;
    });

    /**
     * Test case to retrieve the created user.
     * GET /public/v2/users/{userId}
     */
    test('GET /public/v2/users/{userId} should retrieve the user', async ({ request }) => {
        await wait(API_CONSTANTS.USER_CREATION_WAIT_TIME); // Wait for a short duration to ensure the POST request has completed
        expect(userId).toBeDefined(); // Ensure userId is set

        const endpoint = `/public/v2/users/${userId}`;
        const requestURL = URL.API_BASE_URL + endpoint;
        const headers = API_CONSTANTS.HEADERS;

        // Logging Request details
        console.log(`Request: GET ${requestURL}`);
        console.log(`Request Headers: ${JSON.stringify(headers, null, 2)}`);

        const response = await request.get(requestURL, { headers });

        // Log the response details
        console.log(`Response Status: ${response.status()}`);
        const responseBody = await response.json();
        console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

        // Validate the response status and body
        expect(response.status(), `Expected response status 200`).toBe(200); // Check if user is retrieved
        expect(responseBody, `Expected response body to have parameter 'id' and value is ${userId}`).toHaveProperty('id', userId); // Verify the user ID matches
        expect(responseBody, `Expected response body to have parameter 'name' and value is ${TEST_USER_DETAILS.primary.name}`).toHaveProperty('name', TEST_USER_DETAILS.primary.name); // Check other properties
    });

    /**
     * Test case to update the user.
     * PUT /public/v2/users/{userId}
     */
    test('PUT /public/v2/users/{userId} should update the user', async ({ request }) => {
        await wait(API_CONSTANTS.USER_CREATION_WAIT_TIME); // Wait for a short duration to ensure the POST request has completed
        expect(userId).toBeDefined(); // Ensure userId is set

        const endpoint = `/public/v2/users/${userId}`;
        const requestURL = URL.API_BASE_URL + endpoint;
        const headers = API_CONSTANTS.HEADERS;

        const requestBody = TEST_USER_DETAILS.updated; // Define updated user details

        // Logging Request details
        console.log(`Request: PUT ${requestURL}`);
        console.log(`Request Headers: ${JSON.stringify(headers, null, 2)}`);
        console.log(`Request Body: ${JSON.stringify(requestBody, null, 2)}`);

        const response = await request.put(requestURL, { headers, data: requestBody });

        // Log the response details
        console.log(`Response Status: ${response.status()}`);
        const responseBody = await response.json();
        console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

        // Validate the response status and body
        expect(response.status(), `Expected response status 200`).toBe(200); // Check if the update was successful
        expect(responseBody, `Expected response body to have parameter 'id' and value is ${userId}`).toHaveProperty('id', userId); // Verify the user ID matches
        expect(responseBody, `Expected response body to have parameter 'name' and value is ${TEST_USER_DETAILS.updated.name}`).toHaveProperty('name', TEST_USER_DETAILS.updated.name); // Check updated properties
        expect(responseBody, `Expected response body to have parameter 'email' and value is ${TEST_USER_DETAILS.updated.email}`).toHaveProperty('email', TEST_USER_DETAILS.updated.email); // Check updated properties
    });

    /**
     * Test case to delete the user.
     * DELETE /public/v2/users/{userId}
     */
    test('DELETE /public/v2/users/{userId} should delete a user', async ({ request }) => {
        await wait(API_CONSTANTS.USER_CREATION_WAIT_TIME); // Wait for a short duration to ensure the POST request has completed
        expect(userId).toBeDefined(); // Ensure the userId has been set from the previous tests

        const endpoint = `/public/v2/users/${userId}`;
        const deleteRequestURL = URL.API_BASE_URL + endpoint;

        // Set the request headers
        const headers = API_CONSTANTS.HEADERS;

        // Logging DELETE Request details
        console.log(`Request: DELETE ${deleteRequestURL}`);
        console.log(`Request Headers: ${JSON.stringify(headers, null, 2)}`);

        // Make the DELETE request
        const deleteResponse = await request.delete(deleteRequestURL, { headers });

        // Log the DELETE response details
        console.log(`DELETE Response Status: ${deleteResponse.status()}`);

        // Validate the DELETE response status
        expect(deleteResponse.status(), `Expected response status 204`).toBe(204); // Assuming successful deletion returns a 204 status code

        // Optionally, check that the user has been deleted by trying to GET the user
        const getResponse = await request.get(deleteRequestURL);
        expect(getResponse.status(), `Expected response status 404 on recheck`).toBe(404); // The user should not be found
        console.log(`DELETE Response Status after Rerun: ${getResponse.status()}`);
    });

    /**
     * Helper function to wait for a specified duration.
     * @param {number} ms - The duration to wait in milliseconds.
     * @returns {Promise<void>}
     */
    async function wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

});