const sharp = require('sharp');

async function testSharp() {
    try {
        console.log("Testing sharp...");
        // Create a simple red image
        const buffer = await sharp({
            create: {
                width: 100,
                height: 100,
                channels: 4,
                background: { r: 255, g: 0, b: 0, alpha: 1 }
            }
        })
            .png()
            .toBuffer();

        console.log("Sharp created buffer successfully, size:", buffer.length);

        // Test resizing
        const resized = await sharp(buffer)
            .resize(50, 50)
            .toBuffer();

        console.log("Sharp resized buffer successfully, size:", resized.length);
    } catch (e) {
        console.error("Sharp failed:", e);
    }
}

testSharp();
