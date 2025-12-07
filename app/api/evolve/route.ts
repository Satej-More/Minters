import { NextRequest, NextResponse } from 'next/server';
import { getServerStoryClient } from '@/lib/story-protocol';
import { uploadToIPFS } from '@/lib/pinata';
import { createHash } from 'crypto';
import { db } from '@/lib/firebase';
import { updateDoc, arrayUnion, doc } from 'firebase/firestore';

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
            description,
            attributes,
            creators,
            userId,
            parentIpId,
            licenseTermsId,
            mintLicenseAmount
        } = await request.json();

        if (
            !imageBuffer ||
            !imageName ||
            !prompt ||
            !walletAddress ||
            !userId ||
            !parentIpId ||
            !licenseTermsId
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

        // Upload Image
        const buffer = Buffer.from(imageBuffer, 'base64');
        const imageCid = await uploadToIPFS(buffer, `${imageName}.png`);
        const imageUrl = getGatewayUrl(imageCid);
        const imageHash = createHash('sha256').update(buffer).digest('hex');

        // IP Metadata
        const ipMetadata = {
            title: imageName,
            description: description || `Evolution of ${parentIpId}`,
            createdAt: Math.floor(Date.now() / 1000).toString(),
            image: imageUrl,
            imageHash: `0x${imageHash}`,
            mediaUrl: imageUrl,
            mediaHash: `0x${imageHash}`,
            mediaType: "image/png",
            creators: creators,
            parentIpId: parentIpId,
        };

        // NFT Metadata
        const nftMetadata = {
            name: imageName,
            description: description || `Evolution of ${parentIpId}`,
            image: imageUrl,
            attributes: attributes || [
                { key: "Type", value: "Evolution" },
                { key: "Parent IP", value: parentIpId },
            ],
        };

        const ipMetadataCid = await uploadToIPFS(ipMetadata, `${imageName}_ip_metadata.json`);
        const ipMetadataHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');

        const nftMetadataCid = await uploadToIPFS(nftMetadata, `${imageName}_nft_metadata.json`);
        const nftMetadataHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

        const storyClient = await getServerStoryClient();

        const derivData = {
            parentIpIds: [parentIpId as `0x${string}`],
            licenseTermsIds: [licenseTermsId],
        };

        const response = await storyClient.ipAsset.registerDerivativeIpAsset({
            nft: {
                type: 'mint',
                spgNftContract: '0x999a2ED3461366630231adb28ffBDdEb73f3D2E1',
            },
            derivData,
            ipMetadata: {
                ipMetadataURI: getGatewayUrl(ipMetadataCid),
                ipMetadataHash: `0x${ipMetadataHash}`,
                nftMetadataURI: getGatewayUrl(nftMetadataCid),
                nftMetadataHash: `0x${nftMetadataHash}`,
            },
        });

        // If user wants to mint license tokens
        if (mintLicenseAmount && mintLicenseAmount > 0) {
            try {
                // 1. Register and Attach License Terms to the new Derivative IP
                const { commercialRemixTerms } = await import('@/lib/story-protocol');
                const attachResponse = await storyClient.license.registerPilTermsAndAttach({
                    ipId: response.ipId as `0x${string}`,
                    licenseTermsData: [{ terms: commercialRemixTerms }]
                });

                if (attachResponse.licenseTermsIds && attachResponse.licenseTermsIds.length > 0) {
                    // 2. Mint License Tokens
                    await storyClient.license.mintLicenseTokens({
                        licenseTermsId: attachResponse.licenseTermsIds[0],
                        licensorIpId: response.ipId as `0x${string}`,
                        receiver: walletAddress as `0x${string}`,
                        amount: mintLicenseAmount,
                        maxMintingFee: BigInt(0),
                        maxRevenueShare: 100
                    });
                }
            } catch (mintError) {
                console.error("Error minting license tokens for derivative:", mintError);
                // Continue execution, don't fail the whole request
            }
        }

        const explorerUrl = `https://aeneid.explorer.story.foundation/ipa/${response.ipId}`;

        // Create a structured object for the registered IP
        const registeredIp = {
            ipId: response.ipId,
            explorerUrl: explorerUrl,
            imageUrl: imageUrl,
            txHash: response.txHash,
            imageName: imageName,
            prompt: prompt,
            licenseType: "Evolution", // Custom type for UI
            registeredAt: new Date().toISOString(),
            parentIpId: parentIpId,
        };

        // Update user document in Firestore
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            registeredIps: arrayUnion(registeredIp)
        });

        return NextResponse.json({
            success: true,
            txHash: response.txHash,
            ipId: response.ipId,
            explorerUrl,
            imageCid,
            ipMetadataCid,
            nftMetadataCid,
        });

    } catch (error: any) {
        console.error('Error evolving IP:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to evolve IP' },
            { status: 500 }
        );
    }
}
