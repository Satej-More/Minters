"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, User as UserIcon, Mail, Wallet, Link as LinkIcon, Image as ImageIcon, LogOut } from "lucide-react";

interface RegisteredIp {
    ipId: string;
    explorerUrl: string;
    imageUrl: string;
    txHash: string;
    imageName: string;
    prompt: string;
    licenseType: string;
    registeredAt: string;
}

interface UserData {
    name: string;
    email: string;
    username: string;
    walletAddress: string;
    avatarUrl?: string;
    registeredIps?: RegisteredIp[];
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data() as UserData;
                    if (!data.avatarUrl) {
                        const avatarUrl = `https://robohash.org/${user.uid}`;
                        await updateDoc(userDocRef, { avatarUrl });
                        data.avatarUrl = avatarUrl;
                    }
                    setUserData(data);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
      await signOut(auth);
      // No need to redirect here, AuthGuard will handle it.
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !userData) {
        return (
            <div className="text-center">
                <p>Please log in to view your profile.</p>
                <Link href="/auth">
                    <Button>Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pt-6 pb-12 relative">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8 justify-between"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                    <AvatarFallback>
                        <UserIcon className="w-16 h-16" />
                    </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold">{userData.name}</h1>
                    <p className="text-xl text-muted-foreground">@{userData.username}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                           <Mail className="w-4 h-4 text-primary" /> 
                           <span>{userData.email}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Wallet className="w-4 h-4 text-primary" />
                           <span className="font-mono">{`${userData.walletAddress.slice(0, 6)}...${userData.walletAddress.slice(-4)}`}</span>
                        </div>
                    </div>
                </div>
              </div>
              <Button onClick={handleLogout} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>

            <Separator />

            {/* Minted IPs Section */}
            <div>
                <h2 className="text-3xl font-bold mb-6">My Registered IPs</h2>
                {userData.registeredIps && userData.registeredIps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userData.registeredIps.map((ip) => (
                            <motion.div
                                key={ip.ipId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="neo-card overflow-hidden">
                                    <CardHeader className="p-0">
                                        <div className="relative aspect-square">
                                            <img src={ip.imageUrl} alt={ip.imageName} className="object-cover w-full h-full" />
                                            <div className="absolute bottom-2 right-2">
                                                <Badge variant="secondary">{ip.licenseType}</Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <CardTitle>{ip.imageName}</CardTitle>
                                        <p className="text-sm text-muted-foreground truncate" title={ip.prompt}>{ip.prompt}</p>
                                        <Button asChild variant="outline" className="w-full">
                                            <a href={ip.explorerUrl} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon className="mr-2" /> View on Story Explorer
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
                         <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">No IPs Registered Yet</h3>
                        <p className="text-muted-foreground mt-2">Start creating and register your first IP!</p>
                        <Link href="/generate">
                           <Button className="mt-6">Generate New IP</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
