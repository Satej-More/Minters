import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const walletAddress = searchParams.get('walletAddress');
        const email = searchParams.get('email');

        if (!walletAddress && !email) {
            return NextResponse.json(
                { error: 'Wallet address or email is required' },
                { status: 400 }
            );
        }

        const generationsRef = collection(db, 'image_generations');
        const uniqueIds = new Set<string>();

        // Check by wallet address if provided
        if (walletAddress) {
            const qWallet = query(generationsRef, where('walletAddress', '==', walletAddress));
            const snapshotWallet = await getDocs(qWallet);
            snapshotWallet.forEach(doc => uniqueIds.add(doc.id));
        }

        // Check by email if provided
        if (email) {
            const qEmail = query(generationsRef, where('email', '==', email));
            const snapshotEmail = await getDocs(qEmail);
            snapshotEmail.forEach(doc => uniqueIds.add(doc.id));
        }

        const count = uniqueIds.size;
        const limit = 2;
        const remaining = Math.max(0, limit - count);

        return NextResponse.json({
            count,
            remaining,
            limit
        });
    } catch (error) {
        console.error('Error fetching user usage:', error);
        return NextResponse.json(
            { error: 'Failed to fetch usage data' },
            { status: 500 }
        );
    }
}
