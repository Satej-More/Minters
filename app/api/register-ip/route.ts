import { NextRequest, NextResponse } from 'next/server';
import { getServerStoryClient, commercialRemixTerms, creativeCommonsTerms } from '@/lib/story-protocol';
import { uploadToIPFS } from '@/lib/pinata';
import { createHash } from 'crypto';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        if (!process.env.WALLET_PRIVATE_KEY) throw new Error('WALLET_PRIVATE_KEY is missing');
        if (!process.env.NEXT_PUBLIC_PINATA_JWT) throw new Error('NEXT_PUBLIC_PINATA_JWT is missing');
        if (!process.env.NEXT_PUBLIC_PINATA_GATEWAY) throw new Error('NEXT_PUBLIC_PINATA_GATEWAY is missing');

        const {
            imageBuffer,
            imageName,
            prompt,
            walletAddress,
            existingImageUrl,
            description,
            attributes,
            creators, // New field for multiple creators
            licenseType,
            userId,
            mintLicenseAmount // New field for auto-minting
        } = await request.json();

        if (
            (!imageBuffer && !existingImageUrl) ||
            !imageName ||
            !prompt ||
            !walletAddress ||
            !userId ||
            !creators ||
            creators.length === 0
        ) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const getGatewayUrl = (cid: string) => {
            let gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || '';
            if (!gateway.startsWith('http')) {
                gateway = `https://${gateway}`;
            }
            if (gateway.endsWith('/')) {
                gateway = gateway.slice(0, -1);
            }
            return `${gateway}/ipfs/${cid}`;
        };

        let imageUrl = existingImageUrl;
        let imageCid = '';
        let imageHash = '';

        if (!imageUrl) {
            const buffer = Buffer.from(imageBuffer, 'base64');
            imageCid = await uploadToIPFS(buffer, `${imageName}.png`);
            imageUrl = getGatewayUrl(imageCid);
            imageHash = createHash('sha256').update(buffer).digest('hex');
        } else {
            const response = await fetch(imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            imageHash = createHash('sha256').update(buffer).digest('hex');
            const matches = imageUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/);
            imageCid = matches ? matches[1] : '';
        }

        const ipMetadata = {
            title: imageName,
            description: description || `AI generated image: ${prompt}`,
            createdAt: Math.floor(Date.now() / 1000).toString(),
            image: imageUrl,
            imageHash: `0x${imageHash}`,
            mediaUrl: imageUrl,
            mediaHash: `0x${imageHash}`,
            mediaType: "image/png",
            creators: creators, // Use the provided creators array
        };

        const nftMetadata = {
            name: imageName,
            description: description || `AI generated NFT: ${prompt}`,
            image: imageUrl,
            attributes: attributes || [
                { key: "Model", value: " Stability AI" },
                { key: "Prompt", value: prompt },
                { key: "Generator", value: "Intellect Protocol" },
            ],
        };

        const ipMetadataCid = await uploadToIPFS(ipMetadata, `${imageName}_ip_metadata.json`);
        const ipMetadataHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');

        const nftMetadataCid = await uploadToIPFS(nftMetadata, `${imageName}_nft_metadata.json`);
        const nftMetadataHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

        const selectedTerms = licenseType === 'creative-commons' ? creativeCommonsTerms : commercialRemixTerms;

        const storyClient = await getServerStoryClient();

        const response = await storyClient.ipAsset.registerIpAsset({
            nft: {
                type: 'mint',
                spgNftContract: '0x999a2ED3461366630231adb28ffBDdEb73f3D2E1',
            },
            licenseTermsData: [{ terms: selectedTerms }],
            ipMetadata: {
                ipMetadataURI: getGatewayUrl(ipMetadataCid),
                ipMetadataHash: `0x${ipMetadataHash}`,
                nftMetadataURI: getGatewayUrl(nftMetadataCid),
                nftMetadataHash: `0x${nftMetadataHash}`,
            },
        });

        const explorerUrl = `https://aeneid.explorer.story.foundation/ipa/${response.ipId}`;

        // Create a structured object for the registered IP
        const registeredIp = {
            ipId: response.ipId,
            explorerUrl: explorerUrl,
            imageUrl: imageUrl,
            txHash: response.txHash,
            imageName: imageName,
            prompt: prompt,
            licenseType: licenseType,
            licenseTermsIds: response.licenseTermsIds?.map(id => id.toString()) || [],
            registeredAt: new Date().toISOString(),
        };

        // Update user document in Firestore
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            registeredIps: arrayUnion(registeredIp)
        });

        let mintTxHash = '';
        let licenseTokenIds: string[] = [];

        // Auto-mint license tokens if requested
        if (mintLicenseAmount && mintLicenseAmount > 0 && response.licenseTermsIds && response.licenseTermsIds.length > 0 && response.ipId) {
            try {
                const mintResponse = await storyClient.license.mintLicenseTokens({
                    licenseTermsId: response.licenseTermsIds[0],
                    licensorIpId: response.ipId as `0x${string}`,
                    receiver: walletAddress as `0x${string}`,
                    amount: mintLicenseAmount,
                    maxMintingFee: BigInt(0), // disabled
                    maxRevenueShare: 100, // default
                });
                mintTxHash = mintResponse.txHash || '';
                licenseTokenIds = mintResponse.licenseTokenIds?.map(id => id.toString()) || [];
            } catch (mintError) {
                console.error("Error auto-minting licenses:", mintError);
                // We don't fail the whole request if minting fails, just log it
            }
        }

        return NextResponse.json({
            success: true,
            txHash: response.txHash,
            ipId: response.ipId,
            explorerUrl,
            imageCid,
            ipMetadataCid,
            nftMetadataCid,
            mintTxHash,
            licenseTokenIds
        });

    } catch (error: any) {
        console.error('Error registering IP:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to register IP' },
            { status: 500 }
        );
    }
}
