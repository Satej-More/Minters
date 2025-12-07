import axios from "axios";
import FormData from "form-data";

// Choose your image generation provider
const PROVIDER = process.env.IMAGE_PROVIDER || "huggingface"; // Options: "stability", "huggingface"

/**
 * Generate an image using Hugging Face (FREE)
 */
async function generateImageHuggingFace(prompt: string): Promise<Buffer> {
    const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";
    console.log(`Using HF Model: ${API_URL}`);
    console.log(`Has HF Key: ${!!process.env.HUGGINGFACE_API_KEY}`);

    try {
        const response = await axios.post(
            API_URL,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                responseType: "arraybuffer",
            }
        );

        if (response.status === 200) {
            return Buffer.from(response.data);
        } else {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }
    } catch (error: any) {
        console.error('Error generating image with Hugging Face:', error);
        throw error;
    }
}

/**
 * Generate an image using Stability AI (PAID)
 */
async function generateImageStability(prompt: string): Promise<Buffer> {
    try {
        const payload = {
            prompt: prompt,
            output_format: "png",
        };

        const response = await axios.postForm(
            `https://api.stability.ai/v2beta/stable-image/generate/core`,
            axios.toFormData(payload, new FormData()),
            {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                    Accept: "image/*",
                },
            }
        );

        if (response.status === 200) {
            return Buffer.from(response.data);
        } else {
            throw new Error(`Stability AI API error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error generating image with Stability AI:', error);
        throw error;
    }
}

/**
 * Generate an image using Pollinations.ai (No Key Required, Free)
 */
async function generateImagePollinations(prompt: string): Promise<Buffer> {
    try {
        // Pollinations works by just appending the prompt to the URL
        // We encode the prompt to ensure it's URL safe
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=turbo`;

        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            // timeout removed to allow indefinite wait
        });

        if (response.status === 200) {
            return Buffer.from(response.data);
        } else {
            throw new Error(`Pollinations API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error generating image with Pollinations:', error);
        throw error;
    }
}

/**
 * Main function - automatically selects provider based on available API keys
 */
export async function generateImage(prompt: string): Promise<Buffer> {
    // Auto-detect which provider to use based on available API keys
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY;
    const hasStability = !!process.env.STABILITY_API_KEY;

    // Use Hugging Face if available (it's free!)
    if (hasHuggingFace && PROVIDER === "huggingface") {
        console.log("🎨 Generating image with Hugging Face (FREE)");
        try {
            return await generateImageHuggingFace(prompt);
        } catch (error) {
            console.error("❌ Hugging Face failed, falling back to Pollinations.ai", error);
            console.log("🎨 Generating image with Pollinations.ai (Fallback)");
            return await generateImagePollinations(prompt);
        }
    }

    // Fall back to Stability AI
    if (hasStability && PROVIDER === "stability") {
        console.log("🎨 Generating image with Stability AI");
        return generateImageStability(prompt);
    }

    // If Hugging Face key exists, use it as default
    if (hasHuggingFace) {
        console.log("🎨 Generating image with Hugging Face (FREE)");
        try {
            return await generateImageHuggingFace(prompt);
        } catch (error) {
            console.error("❌ Hugging Face failed, falling back to Pollinations.ai", error);
            console.log("🎨 Generating image with Pollinations.ai (Fallback)");
            return await generateImagePollinations(prompt);
        }
    }

    // Last resort: try Stability
    if (hasStability) {
        console.log("🎨 Generating image with Stability AI");
        return generateImageStability(prompt);
    }

    // If no keys, try Pollinations directly
    console.log("🎨 No tokens found. Generating image with Pollinations.ai");
    return generateImagePollinations(prompt);
}