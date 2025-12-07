const https = require('https');

const prompt = "Generate a creative image prompt for a cyberpunk city";
const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;

console.log("Testing Pollinations Text API...");

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${data}`);
    });
}).on('error', (e) => {
    console.error(e);
});
