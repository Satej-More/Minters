import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/image-generator';
import sharp from 'sharp';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    console.log('[API] /api/generate-image hit');
    try {
        const { prompt, walletAddress, email } = await request.json();

        if (!prompt || !walletAddress) {
            return NextResponse.json(
                { error: 'Prompt and wallet address are required' },
                { status: 400 }
            );
        }

        // Check usage limits (last 24 hours only)
        const generationsRef = collection(db, 'image_generations');
        const allDocs: any[] = [];

        // Calculate timestamp for 24 hours ago
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

        // Check by wallet address
        const qWallet = query(
            generationsRef,
            where('walletAddress', '==', walletAddress)
        );
        const snapshotWallet = await getDocs(qWallet);
        snapshotWallet.forEach(doc => {
            const data = doc.data();
            const docTimestamp = new Date(data.timestamp).getTime();
            // Only count if within last 24 hours
            if (docTimestamp >= twentyFourHoursAgo) {
                allDocs.push({ id: doc.id, ...data });
            }
        });

        // Check by email if provided
        if (email) {
            const qEmail = query(
                generationsRef,
                where('email', '==', email)
            );
            const snapshotEmail = await getDocs(qEmail);
            snapshotEmail.forEach(doc => {
                const data = doc.data();
                const docTimestamp = new Date(data.timestamp).getTime();
                // Only count if within last 24 hours
                if (docTimestamp >= twentyFourHoursAgo) {
                    // Avoid duplicates
                    if (!allDocs.find(d => d.id === doc.id)) {
                        allDocs.push({ id: doc.id, ...data });
                    }
                }
            });
        }

        if (allDocs.length >= 2) {
            return NextResponse.json(
                { error: 'Limit reached. You can only generate 2 images.' },
                { status: 403 }
            );
        }

        // Generate image with Gemini/Pollinations
        console.log(`[API] Generating image for prompt: ${prompt}`);
        const imageBuffer = await generateImage(prompt);
        console.log(`[API] Received image buffer, size: ${imageBuffer.length}`);

        // Resize to square dimensions (512x512) for NFT standards
        let squareBuffer;
        try {
            console.log("[API] Starting Sharp processing...");
            squareBuffer = await sharp(imageBuffer)
                .resize(512, 512, { fit: 'cover', position: 'center' })
                .png({ quality: 90 })
                .toBuffer();
            console.log("[API] Sharp processing complete.");
        } catch (sharpError: any) {
            console.error("[API] Sharp processing failed:", sharpError);
            throw new Error(`Image processing failed: ${sharpError.message}`);
        }

        // Record usage
        await addDoc(collection(db, 'image_generations'), {
            walletAddress,
            email: email || null,
            prompt,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            imageBuffer: squareBuffer.toString('base64')
        });
    } catch (error: any) {
        console.error('Error generating image:', error);

        // Debug logging to file
        try {
            const fs = require('fs');
            fs.writeFileSync('debug_error.txt', `Error: ${error.message}\nStack: ${error.stack}\nTime: ${new Date().toISOString()}\n`);
        } catch (e) {
            console.error('Failed to write debug log', e);
        }

        return NextResponse.json(
            { error: 'Failed to generate image', details: error.message },
            { status: 500 }
        );
    }
}