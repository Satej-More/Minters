"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Loader2,
  User as UserIcon,
  Image as ImageIcon,
  GitMerge,
  ShieldAlert,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWalletContext } from "@/components/wallet-provider";

interface IPAsset {
  ipId: string;
  explorerUrl: string;
  imageUrl: string;
  txHash: string;
  imageName: string;
  prompt: string;
  licenseType: string;
  registeredAt: string;
  creatorName: string;
  creatorAddress: string;
  creatorAvatar?: string;
  licenseTermsIds?: string[];
}

export default function GalleryPage() {
  const { wallet } = useWalletContext();
  const [ips, setIps] = useState<IPAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        if (data.ips) {
          console.log("Fetched IPs:", data.ips);
          setIps(data.ips);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-6 pb-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
          IP <span className="neo-gradient-text text-glow">GALLERY</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Explore the collection of immutable intellectual property registered
          on the Intellect Protocol
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ips.map((ip, index) => (
            <motion.div
              key={ip.ipId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group h-full"
            >
              <Card className="neo-card border-white/10 bg-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-black/20">
                  <img
                    src={ip.imageUrl}
                    alt={ip.imageName}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-sm text-white/90 line-clamp-2 font-medium">
                      {ip.prompt}
                    </p>
                  </div>
                </div>

                <CardHeader className="p-4 pb-2">
                  <h3
                    className="text-xl font-bold truncate"
                    title={ip.imageName}
                  >
                    {ip.imageName}
                  </h3>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow">
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="w-8 h-8 border border-white/10">
                      <AvatarImage src={ip.creatorAvatar} />
                      <AvatarFallback>
                        <UserIcon className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {ip.creatorName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {ip.creatorAddress.slice(0, 6)}...
                        {ip.creatorAddress.slice(-4)}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                  <div className="flex w-full gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 gap-2 group-hover:bg-primary group-hover:text-black transition-colors"
                      onClick={() => window.open(ip.explorerUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Button>
                    {ip.licenseTermsIds && ip.licenseTermsIds.length > 0 && (
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 border-primary/50 text-primary hover:bg-primary hover:text-black"
                        onClick={() =>
                          (window.location.href = `/evolve/${
                            ip.ipId
                          }?licenseTermsId=${
                            ip.licenseTermsIds![0]
                          }&parentImageUrl=${encodeURIComponent(
                            ip.imageUrl
                          )}&parentIpName=${encodeURIComponent(ip.imageName)}`)
                        }
                      >
                        <GitMerge className="w-4 h-4" />
                        Evolve
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all duration-300"
                    onClick={() =>
                      (window.location.href = `/dispute/${
                        ip.ipId
                      }?imageUrl=${encodeURIComponent(
                        ip.imageUrl
                      )}&imageName=${encodeURIComponent(
                        ip.imageName
                      )}&prompt=${encodeURIComponent(
                        ip.prompt
                      )}&creatorName=${encodeURIComponent(
                        ip.creatorName
                      )}&creatorAddress=${encodeURIComponent(
                        ip.creatorAddress
                      )}&creatorAvatar=${encodeURIComponent(
                        ip.creatorAvatar || ""
                      )}`)
                    }
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Raise Dispute
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}

          {ips.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl">No IP assets found yet.</p>
              <Button
                variant="link"
                className="mt-2 text-primary"
                onClick={() => (window.location.href = "/generate")}
              >
                Be the first to create one!
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
