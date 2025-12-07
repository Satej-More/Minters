const https = require('https');

const models = [
    '', // Default (Flux usually)
    'flux',
    'turbo',
    'unity',
    'midjourney',
    'deliberate'
];

async function checkModel(model) {
    const prompt = 'a cute robot';
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}${model ? '?model=' + model : ''}`;

    console.log(`Testing model: '${model || 'DEFAULT'}' ...`);
    const start = Date.now();

    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            const time = Date.now() - start;
            console.log(`  Model: ${model || 'DEFAULT'} | Status: ${res.statusCode} | Time: ${time}ms`);

            // Consume data to clear buffer
            res.on('data', () => { });
            res.on('end', () => resolve());
        });

        req.on('error', (e) => {
            console.log(`  Model: ${model || 'DEFAULT'} | Error: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    console.log("Checking Pollinations models speed...");
    for (const m of models) {
        await checkModel(m);
    }
}

run();
