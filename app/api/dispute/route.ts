import { NextRequest, NextResponse } from 'next/server';
import { getServerStoryClient } from '@/lib/story-protocol';
import { uploadToIPFS } from '@/lib/pinata';
import { DisputeTargetTag } from '@story-protocol/core-sdk';
import { parseEther } from 'viem';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Resend } from "resend";

export async function POST(request: NextRequest) {
    try {
        if (!process.env.WALLET_PRIVATE_KEY) throw new Error('WALLET_PRIVATE_KEY is missing');
        if (!process.env.NEXT_PUBLIC_PINATA_JWT) throw new Error('NEXT_PUBLIC_PINATA_JWT is missing');
        if (!process.env.NEXT_PUBLIC_PINATA_GATEWAY) throw new Error('NEXT_PUBLIC_PINATA_GATEWAY is missing');

        const {
            targetIpId,
            targetTag,
            evidence,
            walletAddress,
            creatorAddress // Added creatorAddress to find the owner
        } = await request.json();

        if (!targetIpId || !targetTag || !evidence || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Upload evidence to IPFS
        const evidenceData = {
            title: "Dispute Evidence",
            description: evidence,
            createdAt: new Date().toISOString(),
            targetIpId,
            targetTag,
            liveness: 2592000, // 30 days
            bond: "0.1 IP",
            counterEvidence: "Pending",
            appealed: "No"
        };

        const evidenceCid = await uploadToIPFS(evidenceData, `dispute_evidence_${targetIpId}.json`);

        const storyClient = await getServerStoryClient();

        const response = await storyClient.dispute.raiseDispute({
            targetIpId: targetIpId as `0x${string}`,
            cid: evidenceCid,
            targetTag: targetTag as DisputeTargetTag,
            bond: parseEther("0.1"), // 0.1 IP/ETH bond
            liveness: 2592000, // 30 days in seconds
        });

        const disputeId = response.disputeId ? response.disputeId.toString() : undefined;

        // Save dispute to Firestore
        try {
            await addDoc(collection(db, "disputes"), {
                disputeId,
                targetIpId,
                targetTag,
                evidence,
                evidenceCid,
                raiserAddress: walletAddress,
                creatorAddress,
                txHash: response.txHash,
                createdAt: new Date().toISOString(),
                status: "Raised"
            });

            // Send Email to Creator
            if (creatorAddress) {
                console.log('\x1b[36m%s\x1b[0m', '🔍 Looking up creator details for address:', creatorAddress);
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("walletAddress", "==", creatorAddress));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0].data();
                    const creatorEmail = userDoc.email;
                    console.log('\x1b[32m%s\x1b[0m', '✅ Creator found:', userDoc.username);

                    if (creatorEmail) {
                        console.log('\x1b[33m%s\x1b[0m', '📧 Preparing to send email to:', creatorEmail);
                        const disputeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://intellect-protocol.vercel.app'}/disputes/${disputeId}`;

                        // Send email directly using Resend
                        if (process.env.RESEND_API_KEY && process.env.NEXT_PUBLIC_SENDER_EMAIL) {
                            console.log('\x1b[34m%s\x1b[0m', '🚀 Initializing Resend...');
                            const resend = new Resend(process.env.RESEND_API_KEY);

                            try {
                                await resend.emails.send({
                                    from: `Team Intellect Protocol <${process.env.NEXT_PUBLIC_SENDER_EMAIL}>`,
                                    to: creatorEmail,
                                    subject: `Action Required: Dispute Raised Against Your IP ${targetIpId}`,
                                    html: `
                                    <h1>Dispute Notification</h1>
                                    <p>A dispute has been raised against your IP Asset <strong>${targetIpId}</strong>.</p>
                                    <p><strong>Reason:</strong> ${targetTag}</p>
                                    <p><strong>Evidence:</strong> ${evidence}</p>
                                    <p><strong>Dispute ID:</strong> ${disputeId}</p>
                                    <p>Please review the dispute details immediately.</p>
                                    <a href="${disputeUrl}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dispute</a>
                                `
                                });
                                console.log('\x1b[32m%s\x1b[0m', '✨ Email sent successfully to:', creatorEmail);
                            } catch (emailError) {
                                console.error('\x1b[31m%s\x1b[0m', '❌ Failed to send email:', emailError);
                            }
                        } else {
                            console.warn('\x1b[33m%s\x1b[0m', '⚠️ RESEND_API_KEY or NEXT_PUBLIC_SENDER_EMAIL missing');
                        }
                    } else {
                        console.log('\x1b[33m%s\x1b[0m', '⚠️ Creator has no email registered');
                    }
                } else {
                    console.log('\x1b[33m%s\x1b[0m', '⚠️ Creator not found in database');
                }
            }
        } catch (dbError) {
            console.error("Error saving dispute or sending email:", dbError);
        }

        return NextResponse.json({
            success: true,
            txHash: response.txHash,
            disputeId,
            evidenceCid
        });

    } catch (error: any) {
        console.error('Error raising dispute:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to raise dispute' },
            { status: 500 }
        );
    }
}
