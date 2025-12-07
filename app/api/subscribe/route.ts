import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
        }

        const subscriptionsRef = collection(db, 'subscriptions');
        const q = query(subscriptionsRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 409 });
        }

        await addDoc(subscriptionsRef, {
            email: email,
            subscribedAt: serverTimestamp(),
        });

        return NextResponse.json({ success: true, message: 'Thank you for subscribing!' });

    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to subscribe' },
            { status: 500 }
        );
    }
}
