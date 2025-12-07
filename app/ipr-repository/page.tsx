"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/app-layout";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { countries } from "@/lib/countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import { CheckCircle, Shield, ThumbsUp, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface IprInfo {
  country: string;
  clarity: string;
  propertiesAndLaws: {
    introduction: string;
    types: {
      name: string;
      description: string;
      keyLaws: string[];
    }[];
  };
  enforcement: {
    introduction: string;
    authorities: string[];
    penalties: string;
  };
  protectionAndLoss: {
    protectionBenefits: string;
    lossConsequences: string;
  };
  conservationProcess: {
    introduction: string;
    steps: {
      step: number;
      title: string;
      description: string;
    }[];
  };
}

interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const IprRepositoryPage = () => {
  const [country, setCountry] = useState("");
  const [iprInfo, setIprInfo] = useState<IprInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } else {
        setUser(null);
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFetchIprInfo = async () => {
    if (!country) {
      setError("Please select a country.");
      return;
    }
    const toastId = toast.loading("🔍 Scanning blockchain... Retrieving IP registry data...");
    setLoading(true);
    setError(null);
    setIprInfo(null);
    try {
      const response = await fetch("/api/ipr-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch IPR information. Please try again.");
      }
      const data = await response.json();
      setIprInfo(data);
      setChatHistory([
        {
          sender: "bot",
          message: `Here is the IPR information for ${data.country}. How can I help you further?`,
        },
      ]);
      toast.success("✅ IP REGISTRY SYNCED! All assets loaded.", { id: toastId });
    } catch (err: any) {
      setError(err.message);
      toast.error("⚠️ " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim() || !iprInfo) return;

    setIsChatting(true);
    const newChatHistory: ChatMessage[] = [
      ...chatHistory,
      { sender: "user", message: chatInput },
    ];
    setChatHistory(newChatHistory);
    const currentChatInput = chatInput;
    setChatInput("");
    const toastId = toast.loading("🧠 AI analyzing... Processing query...");

    try {
      const response = await fetch("/api/ipr-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: iprInfo.country,
          question: currentChatInput,
          context: iprInfo,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }
      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: data.answer },
      ]);
      toast.dismiss(toastId);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          message: "Sorry, I am having trouble responding right now.",
        },
      ]);
      toast.error("⚠️ System malfunction detected. Please retry.", { id: toastId });
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-4 text-center"
      >
        <h1 className="text-5xl font-bold tracking-tight text-glow neo-gradient-text">
          {userName ? `Welcome, ${userName}` : "IPR Intelligence Hub"}
        </h1>
        <p className="text-lg text-muted-foreground">
          Your global guide to Intellectual Property Rights. Select a country to
          begin.
        </p>
      </motion.div>

      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="mt-8 flex justify-center"
      >
        <div className="w-full max-w-md flex items-center space-x-2 glass-panel p-2 rounded-full">
          <Select onValueChange={setCountry}>
            <SelectTrigger className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 text-white placeholder:text-muted-foreground">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleFetchIprInfo}
            disabled={loading}
            className="bg-primary text-black rounded-full hover:bg-primary/90"
          >
            {loading ? (
              "Searching..."
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-red-500 text-center glass-panel p-4 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {iprInfo && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-4xl mx-auto"
          >
            <div className="space-y-8">
              <motion.div variants={item}>
                <Card className="glass-panel box-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-2xl neo-gradient-text">
                      <span>IPR Landscape for {iprInfo.country}</span>
                      <Badge
                        className="ml-2 bg-primary text-black"
                        variant="default"
                      >
                        {iprInfo.clarity}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {iprInfo.propertiesAndLaws.introduction}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </motion.div>

              {iprInfo.propertiesAndLaws.types.map((type, index) => (
                <motion.div variants={item} key={index}>
                  <Card className="glass-panel">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield size={24} className="text-primary" />
                        {type.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <ReactMarkdown>{type.description}</ReactMarkdown>
                      <h4 className="font-bold mt-4">Key Laws:</h4>
                      <ul className="list-disc pl-5">
                        {type.keyLaws.map((law, i) => (
                          <li key={i}>{law}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <motion.div variants={item}>
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle size={24} className="text-primary" />
                      Enforcement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {iprInfo.enforcement.introduction}
                    </ReactMarkdown>
                    <h4 className="font-bold mt-4">Authorities:</h4>
                    <ul className="list-disc pl-5">
                      {iprInfo.enforcement.authorities.map((auth, i) => (
                        <li key={i}>{auth}</li>
                      ))}
                    </ul>
                    <h4 className="font-bold mt-4">Penalties:</h4>
                    <ReactMarkdown>
                      {iprInfo.enforcement.penalties}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp size={24} className="text-primary" />
                      Protection vs. Loss
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <h4 className="font-bold">Benefits of Protection:</h4>
                    <ReactMarkdown>
                      {iprInfo.protectionAndLoss.protectionBenefits}
                    </ReactMarkdown>
                    <h4 className="font-bold mt-4">Consequences of Loss:</h4>
                    <ReactMarkdown>
                      {iprInfo.protectionAndLoss.lossConsequences}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThumbsUp size={24} className="text-primary" />
                      How to Protect Your IP
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {iprInfo.conservationProcess.introduction}
                    </ReactMarkdown>
                    {iprInfo.conservationProcess.steps.map((step) => (
                      <div key={step.step} className="mt-4">
                        <h4 className="font-bold flex items-center gap-2">
                          <Badge className="bg-primary text-black">
                            {step.step}
                          </Badge>{" "}
                          {step.title}
                        </h4>
                        <ReactMarkdown>{step.description}</ReactMarkdown>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={item} className="mt-8">
              <Card className="glass-panel h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="neo-gradient-text">
                    IPR Chat Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div
                    ref={chatContainerRef}
                    className="h-full flex-grow overflow-y-auto border border-white/10 rounded-md p-4 space-y-4"
                  >
                    {chatHistory.map((chat, index) => (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          x: chat.sender === "user" ? 20 : -20,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${chat.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                          }`}
                      >
                        <div
                          className={`max-w-2xl rounded-lg px-4 py-2 prose prose-invert ${chat.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50"
                            }`}
                        >
                          <ReactMarkdown>{chat.message}</ReactMarkdown>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleChatSubmit}
                    className="mt-4 flex space-x-2"
                  >
                    <Input
                      type="text"
                      placeholder="Ask a follow-up..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      disabled={!iprInfo || isChatting}
                    />
                    <Button
                      type="submit"
                      disabled={!iprInfo || !chatInput.trim() || isChatting}
                      className="bg-primary text-black rounded-full hover:bg-primary/90"
                    >
                      Send
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IprRepositoryPage;