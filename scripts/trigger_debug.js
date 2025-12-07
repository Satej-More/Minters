const http = require('http');

const randomId = Math.floor(Math.random() * 1000000);
const randomWallet = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const randomEmail = `test${randomId}@example.com`;

console.log("Using random wallet:", randomWallet);
console.log("Using random email:", randomEmail);

const data = JSON.stringify({
    prompt: 'test prompt',
    walletAddress: randomWallet,
    email: randomEmail
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
