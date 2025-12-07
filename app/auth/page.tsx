"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import { useWalletContext } from "@/components/wallet-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User as UserIcon, Wallet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Step = "signin" | "setUsername" | "connectWallet" | "completed";

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("signin");
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { wallet, connectWallet, switchToStoryNetwork } = useWalletContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef).then((docSnap) => {
          if (docSnap.exists() && docSnap.data().walletAddress) {
            router.push("/");
          } else if (docSnap.exists() && !docSnap.data().username) {
            setStep("setUsername");
          } else if (docSnap.exists()) {
            setStep("connectWallet");
          } else {
            setStep("setUsername");
          }
        });
      } else {
        setUser(null);
        setStep("signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (wallet.address && user && step === "connectWallet") {
      const userDocRef = doc(db, "users", user.uid);
      setDoc(userDocRef, { walletAddress: wallet.address }, { merge: true })
        .then(() => {
          setStep("completed");
          setTimeout(() => router.push("/"), 2000);
        })
        .catch((e) => {
          console.error("Error saving wallet address:", e);
          setError("⛓️ Blockchain link unstable. Retrying handshake...");
        });
    }
  }, [wallet.address, user, step, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError("🚫 Authentication matrix disrupted. Retry connection sequence.");
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (username.length < 3) {
      setError("⚠️ Identity signature too short. Minimum 3 characters required.");
      return;
    }
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          username: username,
        },
        { merge: true }
      );
      setStep("connectWallet");
      setError(null);
    } catch (error) {
      console.error("Error setting username:", error);
      setError("❌ Profile initialization failed. Recalibrating systems...");
    }
  };

  const handleConnect = async () => {
    if (wallet.chainId !== 1315) {
      await switchToStoryNetwork();
    }
    await connectWallet();
  };

  const renderStep = () => {
    switch (step) {
      case "signin":
        return (
          <motion.div key="signin" variants={stepVariants}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                Join Minters
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-4 h-auto rounded-full font-bold"
                size="lg"
              >
                <FaGoogle className="w-6 h-6 mr-3 text-black" />
                Sign in with Google
              </Button>
            </CardContent>
          </motion.div>
        );
      case "setUsername":
        return (
          <motion.div key="setUsername" variants={stepVariants}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <UserIcon className="w-8 h-8 text-primary" />
                Create Your Profile
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Set a unique username to represent you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={user?.displayName || ""}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-4 h-auto rounded-full font-bold"
                  size="lg"
                >
                  Set Username
                </Button>
              </form>
            </CardContent>
          </motion.div>
        );
      case "connectWallet":
        return (
          <motion.div key="connectWallet" variants={stepVariants}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <Wallet className="w-8 h-8 text-primary" />
                Connect Your Wallet
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                The final step to secure your creative assets on-chain.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                onClick={handleConnect}
                className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-4 h-auto rounded-full font-bold"
                size="lg"
              >
                <Wallet className="w-6 h-6 mr-3" />
                Connect Wallet
              </Button>
            </CardContent>
          </motion.div>
        );
      case "completed":
        return (
          <motion.div
            key="completed"
            variants={stepVariants}
            className="text-center"
          >
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
              </motion.div>
              <CardTitle className="text-3xl font-bold mt-6">
                Setup Complete!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Welcome to the new era of IP. Redirecting you now...
              </CardDescription>
            </CardHeader>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      <Card className="neo-card w-full max-w-md border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 transition-colors">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        {error && (
          <p className="p-4 text-destructive text-center mb-4">{error}</p>
        )}
      </Card>
    </div>
  );
}
