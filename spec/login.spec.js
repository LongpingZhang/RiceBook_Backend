require('es6-promise').polyfill(); // Polyfill for ES6 Promises
require('isomorphic-fetch'); // Fetch for HTTP requests

const baseUrl = 'http://localhost:3001'; // Update to match your app's base URL

describe('Backend Tests', () => {
    let testUserId;
    let testUserPassword = '123';
    let cookies;
    let newArticleId;

    // Register a new user
    it('should register a new user', async () => {
        testUserId = 'testUser' + new Date().getTime();  // Create a unique user ID

        const userPayload = {
            username: testUserId,
            email: testUserId + '@example.com',
            dob: 987654321000,
            phone: '555-555-5555',
            zipcode: '90210',
            password: testUserPassword
        };

        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userPayload)
        });

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.result).toBe('success');
    });

    // Log in as the new user
    it('should log in as the new user', async () => {
        const loginPayload = {
            username: testUserId,
            password: testUserPassword
        };

        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginPayload)
        });

        expect(response.status).toBe(200);

        const cookiesData = response.headers.get('set-cookie'); // Get the Set-Cookie header
        cookies = cookiesData;

        const body = await response.json();
        expect(body.result).toBe('success');
    });

    // Create a new article
    it('should create a new article', async () => {
        const prevArticlesResp = await fetch(`${baseUrl}/articles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            }
        })
        const numPrevArticles = await prevArticlesResp.json().then(
            data => data.articles.length
        );

        const articlePayload = {
            text: 'This is a test article by ' + testUserId
        };

        const response = await fetch(`${baseUrl}/article`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            body: JSON.stringify(articlePayload)
        });

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.articles.length).toBeGreaterThan(numPrevArticles);
        expect(body.articles[0].body).toBe(articlePayload.text);
        newArticleId = body.articles[0].id; // Store the ID of the created article
    });

    // Update the headline
    it('should update the status headline', async () => {
        const headlinePayload = {
            headline: 'Updated headline for ' + testUserId
        };

        const response = await fetch(`${baseUrl}/headline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
            body: JSON.stringify(headlinePayload)
        });

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.headline).toBe(headlinePayload.headline);
    });

    // Log out the user
    it('should log out the user', async () => {
        const response = await fetch(`${baseUrl}/logout`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            }
        });

        expect(response.status).toBe(200);

        // Check sessionId has been deleted from the cookie
        const setCookieHeader = response.headers.get('set-cookie');
        // The Set-Cookie header should clear the sessionId
        expect(setCookieHeader).toContain('sid=');

        const body = await response.json();
        expect(body.result).toBe('success');
    });
});
