"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/components/wallet-provider";
import {
  Home,
  Upload,
  PlusSquare,
  Wallet,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { wallet, connectWallet } = useWalletContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setAvatarUrl(userDoc.data().avatarUrl);
        }
      } else {
        setUser(null);
        setAvatarUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/generate", label: "Generate", icon: PlusSquare },
    { href: "/mint", label: "Mint", icon: Upload },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    {
      href: "/prompt-generator",
      label: "Commander",
      icon: Sparkles,
    },
    {
      href: "/ipr-repository",
      label: "IPR Hub",
      icon: Wallet,
    },
  ];

  if (user) {
    navLinks.push({ href: "/profile", label: "Profile", icon: UserIcon });
  }

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${scrolled
          ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-sm"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-300" />
              <Logo className="relative w-8 h-8" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Minters
              <span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1 items-center bg-secondary/30 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-background/50 rounded-full group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:block">
              {wallet.isConnected ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-white/5 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-sm font-mono text-muted-foreground">
                      {wallet.address?.slice(0, 6)}...
                      {wallet.address?.slice(-4)}
                    </span>
                  </div>
                  {avatarUrl && (
                    <Link href="/profile">
                      <Avatar className="w-10 h-10 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  )}
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  size="sm"
                  variant="default"
                  className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
            <button
              className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-50" />
            </div>

            <nav className="flex flex-col gap-6 text-center z-10 w-full max-w-sm">
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants} className="w-full">
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between w-full p-4 text-xl font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-background/50 group-hover:bg-background transition-colors">
                        <link.icon className="w-6 h-6" />
                      </div>
                      {link.label}
                    </span>
                    <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div variants={itemVariants} className="mt-12 z-10">
              {wallet.isConnected ? (
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/50 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-mono text-muted-foreground">
                    {wallet.address?.slice(0, 6)}...
                    {wallet.address?.slice(-4)}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                  size="lg"
                  className="rounded-full w-full px-12 shadow-xl shadow-primary/20"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
