import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { URL, API_CONSTANTS } from './load-test-constants.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

/**
 * K6 Load Test Script for REST API User Management
 *
 * This script performs a load test on a REST API endpoint for user management with 
 * random user data.
 *
 * The following operations are included in the load test:
 * - POST: Create a new user
 * - GET: Retrieve the created user
 * - PUT: Update the user details
 * - DELETE: Remove the user from the system
 *
 * Configuration:
 * - Stages for ramping up and down the number of virtual users.
 * - Thresholds to evaluate performance metrics.
 *
 */

// Define trends to track performance metrics
let postUserTrend = new Trend('POST_users');
let getUserTrend = new Trend('GET_users');
let putUserTrend = new Trend('PUT_users');
let deleteUserTrend = new Trend('DELETE_users');

// Constant configuration
const API_BASE_URL = URL.API_BASE_URL;
const HEADERS = API_CONSTANTS.HEADERS;

// Load test scenario
export let options = {
    stages: [
        { duration: '20s', target: 5 },     // simulate ramp-up of traffic from 0 to 5 users over 20 seconds
        { duration: '30s', target: 10 },    // stay at 10 users for 30 seconds
        { duration: '20s', target: 0 },     // ramp-down to 0 users over 20 seconds
    ],
    thresholds: {
        http_req_duration: ['p(99)<500'],   // 99% of requests must complete within 500ms
        http_req_failed: ['rate<0.01'],     // request failure rate must be below 1%
    },
};

// Function to generate a random email
function generateRandomEmail() {
    const timestamp = Date.now();
    return `testuser${timestamp}@testmail.com`;
}

// Load test logic for REST API's for random user generated
export default function () {
    // Generate unique user details
    const USER_DETAILS = {
        primary: {
            name: `Test User ${Math.floor(Math.random() * 1000)}`,
            gender: "male",
            email: generateRandomEmail(),
            status: "active",
        },
        updated: {
            name: `Test User Update ${Math.floor(Math.random() * 1000)}`,
            email: generateRandomEmail(),
            status: "active",
        },
    };

    // POST request - create a user
    let postResponse = http.post(`${API_BASE_URL}/public/v2/users`, JSON.stringify(USER_DETAILS.primary), { headers: HEADERS });
    postUserTrend.add(postResponse.timings.duration);
    let postUserId = JSON.parse(postResponse.body).id;

    // Check POST response
    check(postResponse, {
        'POST status is 201': (r) => r.status === 201,
        'POST response time is acceptable': (r) => r.timings.duration < 2000,
    });

    sleep(2);

    // GET request - retrieve the user
    let getResponse = http.get(`${API_BASE_URL}/public/v2/users/${postUserId}`, { headers: HEADERS });
    getUserTrend.add(getResponse.timings.duration);

    // Check GET response
    check(getResponse, {
        'GET status is 200': (r) => r.status === 200,
        'GET response contains user ID': (r) => JSON.parse(r.body).id === postUserId,
    });

    sleep(2);

    // PUT request - update the user
    let putResponse = http.put(`${API_BASE_URL}/public/v2/users/${postUserId}`, JSON.stringify(USER_DETAILS.updated), { headers: HEADERS });
    putUserTrend.add(putResponse.timings.duration);

    // Check PUT response
    check(putResponse, {
        'PUT status is 200': (r) => r.status === 200,
        'PUT response contains updated email': (r) => JSON.parse(r.body).email === USER_DETAILS.updated.email,
    });

    sleep(2);

    // DELETE request - delete the user
    let deleteResponse = http.del(`${API_BASE_URL}/public/v2/users/${postUserId}`, null, { headers: HEADERS });
    deleteUserTrend.add(deleteResponse.timings.duration);

    // Check DELETE response
    check(deleteResponse, {
        'DELETE status is 204': (r) => r.status === 204,
    });

    sleep(2);
}

export function handleSummary(data) {
    return {
        "load-test-summary.json": JSON.stringify(data),
        "load-test-result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}