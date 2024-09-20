import { test, expect } from '@playwright/test';
import { URL } from "../../constants/URLs";
import { testUserDetails } from "../../constants/userDetails";
import { apiConstants } from "../../constants/apiConstants";

/**
 * API Testing with Playwright for REST API's
 */
test.describe('API Testing with Playwright', () => {
    let userId: number; // Variable to store the user ID

    /**
     * Test case to create a new user.
     * POST /public/v2/users
     */
    test('POST /public/v2/users should create a user', async ({ request }) => {
        const endpoint = '/public/v2/users';
        const requestURL = URL.API_BASE_URL + endpoint;

        // Prepare the request body
        const requestBody = testUserDetails.primary;

        // Set the request headers
        const headers = apiConstants.headers;

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
        expect(duration, `Expected response time to be under : ${apiConstants.expectedResponseTime}`).toBeLessThan(apiConstants.expectedResponseTime);

        // Store the user ID for use in subsequent tests
        userId = responseBody.id;
    });

    /**
     * Test case to retrieve the created user.
     * GET /public/v2/users/{userId}
     */
    test('GET /public/v2/users/{userId} should retrieve the user', async ({ request }) => {
        await wait(2000); // Wait for a short duration to ensure the POST request has completed
        expect(userId).toBeDefined(); // Ensure userId is set

        const endpoint = `/public/v2/users/${userId}`;
        const requestURL = URL.API_BASE_URL + endpoint;
        const headers = apiConstants.headers;

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
        expect(responseBody, `Expected response body to have parameter 'name' and value is ${testUserDetails.primary.name}`).toHaveProperty('name', testUserDetails.primary.name); // Check other properties
    });

    /**
     * Test case to update the user.
     * PUT /public/v2/users/{userId}
     */
    test('PUT /public/v2/users/{userId} should update the user', async ({ request }) => {
        await wait(2000); // Wait for a short duration to ensure the POST request has completed
        expect(userId).toBeDefined(); // Ensure userId is set

        const endpoint = `/public/v2/users/${userId}`;
        const requestURL = URL.API_BASE_URL + endpoint;
        const headers = apiConstants.headers;

        const requestBody = testUserDetails.updated; // Define updated user details

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
        expect(responseBody, `Expected response body to have parameter 'name' and value is ${testUserDetails.updated.name}`).toHaveProperty('name', testUserDetails.updated.name); // Check updated properties
        expect(responseBody, `Expected response body to have parameter 'email' and value is ${testUserDetails.updated.email}`).toHaveProperty('email', testUserDetails.updated.email); // Check updated properties
    });

    /**
     * Test case to delete the user.
     * DELETE /public/v2/users/{userId}
     */
    test('DELETE /public/v2/users/{userId} should delete a user', async ({ request }) => {
        await wait(2000); // Wait for a short duration to ensure the POST request has completed
        expect(userId).toBeDefined(); // Ensure the userId has been set from the previous tests

        const endpoint = `/public/v2/users/${userId}`;
        const deleteRequestURL = URL.API_BASE_URL + endpoint;

        // Set the request headers
        const headers = apiConstants.headers;

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