"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useWalletContext } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DisputePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { wallet } = useWalletContext();

  const ipId = params.ipId as string;
  const imageUrl = searchParams.get("imageUrl") || "";
  const imageName = searchParams.get("imageName") || "Unknown IP";
  const prompt = searchParams.get("prompt") || "";
  const creatorName = searchParams.get("creatorName") || "Unknown Creator";
  const creatorAddress = searchParams.get("creatorAddress") || "";
  const creatorAvatar = searchParams.get("creatorAvatar") || "";

  const [disputeType, setDisputeType] = useState("IMPROPER_REGISTRATION");
  const [evidence, setEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRaiseDispute = async () => {
    if (!wallet?.address) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!evidence) {
      toast.error("Please provide evidence");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetIpId: ipId,
          targetTag: disputeType,
          evidence,
          walletAddress: wallet.address,
          creatorAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Dispute raised successfully!");
        router.push("/gallery");
      } else {
        toast.error(data.error || "Failed to raise dispute");
      }
    } catch (error) {
      console.error("Error raising dispute:", error);
      toast.error("Failed to raise dispute");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Gallery
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: IP Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={imageUrl}
                alt={imageName}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-3xl font-bold truncate">{imageName}</h1>
                <p className="text-white/80 mt-2 line-clamp-3">{prompt}</p>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Creator Details</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border border-white/10">
                  <AvatarImage src={creatorAvatar} />
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{creatorName}</p>
                  <p className="text-muted-foreground font-mono text-sm">
                    {creatorAddress}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Dispute Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center gap-3 text-red-500 mb-2">
                  <ShieldAlert className="w-8 h-8" />
                  <CardTitle className="text-2xl">Raise Dispute</CardTitle>
                </div>
                <CardDescription>
                  Flag this IP for violations. This action is recorded on-chain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Dispute Type</Label>
                  <Select value={disputeType} onValueChange={setDisputeType}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Select violation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMPROPER_REGISTRATION">
                        Improper Registration (Plagiarism)
                      </SelectItem>
                      <SelectItem value="IMPROPER_USAGE">
                        Improper Usage (License Violation)
                      </SelectItem>
                      <SelectItem value="IMPROPER_PAYMENT">
                        Improper Payment (Missing Royalties)
                      </SelectItem>
                      <SelectItem value="CONTENT_STANDARDS_VIOLATION">
                        Content Standards Violation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Evidence & Description</Label>
                  <Textarea
                    placeholder="Please provide a detailed description of the violation and any supporting links..."
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    className="bg-black/20 border-white/10 min-h-[200px] resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    Important Warning
                  </div>
                  <p>
                    Raising a dispute requires a bond of <strong>0.1 IP</strong>
                    . This bond ensures the integrity of the dispute process.
                  </p>
                  <p>
                    If your dispute is found to be invalid or malicious, you may
                    lose this bond.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                  onClick={handleRaiseDispute}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Dispute...
                    </>
                  ) : (
                    "Raise Dispute"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
