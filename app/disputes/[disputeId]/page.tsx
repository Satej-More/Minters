"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ShieldAlert,
  FileText,
  User,
  Calendar,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DisputeData {
  disputeId: string;
  targetIpId: string;
  targetTag: string;
  evidence: string;
  evidenceCid: string;
  raiserAddress: string;
  creatorAddress: string;
  txHash: string;
  createdAt: string;
  status: string;
}

export default function DisputeDetailsPage() {
  const params = useParams();
  const disputeId = params.disputeId as string;
  const [dispute, setDispute] = useState<DisputeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispute = async () => {
      if (!disputeId) return;

      try {
        const q = query(
          collection(db, "disputes"),
          where("disputeId", "==", disputeId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setDispute(querySnapshot.docs[0].data() as DisputeData);
        } else {
          console.error("Dispute not found");
        }
      } catch (error) {
        console.error("Error fetching dispute:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDispute();
  }, [disputeId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Dispute Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The dispute with ID {disputeId} could not be found.
        </p>
        <Link href="/gallery">
          <Button variant="outline">Return to Gallery</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-12 pb-12 relative overflow-hidden min-h-screen flex flex-col">
      {/* Background Blur Blob - Red for Dispute */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      <div className="max-w-6xl mx-auto w-full space-y-12 z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            DISPUTE{" "}
            <span className="neo-gradient-text text-glow from-red-500 to-orange-500">
              DETAILS
            </span>
          </h1>

          <Badge
            variant={dispute.status === "Raised" ? "destructive" : "secondary"}
            className="text-xl px-8 py-2 h-fit w-fit shadow-[0_0_30px_rgba(239,68,68,0.5)] border-none uppercase tracking-widest"
          >
            {dispute.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Dispute Info & Parties */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="neo-card border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Dispute Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dispute ID
                    </label>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded border border-white/5 group hover:border-white/10 transition-colors">
                      <p className="font-mono text-lg truncate flex-1">
                        {dispute.disputeId}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          copyToClipboard(dispute.disputeId, "Dispute ID")
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Violation Type
                    </label>
                    <div>
                      <Badge
                        variant="outline"
                        className="border-red-500/30 text-red-400 bg-red-500/5 px-3 py-1"
                      >
                        {dispute.targetTag}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Target IP Asset
                  </label>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`https://explorer.story.foundation/ipa/${dispute.targetIpId}`}
                      target="_blank"
                      className="group flex-1 flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                    >
                      <span className="font-mono text-primary group-hover:text-primary/80">
                        {dispute.targetIpId}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-[50px] w-[50px] border-white/5 bg-white/5 hover:bg-white/10"
                      onClick={() =>
                        copyToClipboard(dispute.targetIpId, "IP ID")
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Created At
                  </label>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(dispute.createdAt).toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neo-card border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Parties Involved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="group p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                      Raiser Address
                    </label>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0"></div>
                      <span className="font-mono text-sm truncate w-full">
                        {dispute.raiserAddress}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      copyToClipboard(dispute.raiserAddress, "Raiser Address")
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="group p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                      Creator (Target) Address
                    </label>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0"></div>
                      <span className="font-mono text-sm truncate w-full">
                        {dispute.creatorAddress || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      copyToClipboard(
                        dispute.creatorAddress || "",
                        "Creator Address"
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Evidence */}
          <div className="space-y-6">
            <Card className="neo-card border-red-500/20 bg-gradient-to-br from-white/5 to-red-500/5 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                    Description
                  </label>
                  <div className="bg-black/20 p-4 rounded-lg border border-white/5 text-foreground/90 min-h-[150px] whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
                    {dispute.evidence}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                    On-Chain Data
                  </label>
                  <div className="space-y-3">
                    <Link
                      href={`https://explorer.story.foundation/transactions/${dispute.txHash}`}
                      target="_blank"
                    >
                      <Button
                        variant="secondary"
                        className="w-full justify-between group h-12"
                      >
                        <span>View Transaction</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                      </Button>
                    </Link>

                    {dispute.evidenceCid && (
                      <Link
                        href={`https://gateway.pinata.cloud/ipfs/${dispute.evidenceCid}`}
                        target="_blank"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-between border-white/10 hover:bg-white/5 group h-12"
                        >
                          <span>View Evidence on IPFS</span>
                          <FileText className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
