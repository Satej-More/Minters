import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        let allIps: any[] = [];

        snapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.registeredIps && Array.isArray(userData.registeredIps)) {
                const userIps = userData.registeredIps.map((ip: any) => ({
                    ...ip,
                    creatorName: userData.username || '@0xAnnonymous',
                    creatorAddress: userData.walletAddress || '',
                    creatorAvatar: userData.avatarUrl || null
                }));
                allIps = [...allIps, ...userIps];
            }
        });

        // Sort by registeredAt desc
        allIps.sort((a, b) => {
            return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
        });

        return NextResponse.json({ ips: allIps });
    } catch (error: any) {
        console.error('Error fetching gallery:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch gallery' },
            { status: 500 }
        );
    }
}
