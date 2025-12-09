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
        const allDocs: any[] = [];

        // Calculate timestamp for 24 hours ago
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

        // Check by wallet address if provided
        if (walletAddress) {
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
        }

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

        const count = allDocs.length;
        const limit = 2;
        const remaining = Math.max(0, limit - count);

        return NextResponse.json({
            count,
            remaining,
            limit
        });
    } catch (error: any) {
        console.error('Error fetching user usage:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return NextResponse.json(
            {
                error: 'Failed to fetch usage data',
                details: error.message,
                code: error.code
            },
            { status: 500 }
        );
    }
}
