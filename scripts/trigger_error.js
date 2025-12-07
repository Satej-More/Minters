const http = require('http');

const data = JSON.stringify({
    prompt: 'test prompt',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    email: 'test@example.com'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate-image',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
