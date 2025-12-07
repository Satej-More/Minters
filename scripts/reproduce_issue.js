const fetch = require('node-fetch'); // Assuming node-fetch is available, or use http

async function run() {
    console.log("Triggering generation...");
    try {
        const response = await fetch('http://localhost:3001/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: 'test prompt',
                walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
                email: 'test@example.com'
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

// Simple fetch polyfill if needed for older node
if (!global.fetch) {
    const http = require('http');
    global.fetch = function (url, options) {
        return new Promise((resolve, reject) => {
            const req = http.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({
                    status: res.statusCode,
                    text: () => Promise.resolve(data),
                    json: () => Promise.resolve(JSON.parse(data))
                }));
            });
            req.on('error', reject);
            if (options.body) req.write(options.body);
            req.end();
        });
    }
}

run();
