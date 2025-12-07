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
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Upload,
  Plus,
  X,
  Loader2,
  GitMerge,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface Creator {
  name: string;
  address: string;
  contributionPercent: number;
  description: string;
  socialMedia?: { platform: string; handle: string }[];
}

export default function EvolvePage() {
  const { wallet } = useWalletContext();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);

  const parentIpId = params.ipId as string;
  const licenseTermsId = searchParams.get("licenseTermsId");
  const parentImageUrl = searchParams.get("parentImageUrl");

  const parentIpName = searchParams.get("parentIpName");

  const [imageName, setImageName] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (parentIpName) {
      setImageName(`Evolution of ${parentIpName}`);
    }
  }, [parentIpName]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (user.displayName && creators.length === 0) {
          setCreators([
            {
              name: user.displayName,
              address: wallet.address || "",
              contributionPercent: 100,
              description: "Evolved with Intellect Protocol",
            },
          ]);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [wallet.address]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("📦 File exceeds maximum payload. Compress and retry.", {
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          // Do not overwrite imageName with filename
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [description, setDescription] = useState("");
  const [traits, setTraits] = useState<{ key: string; value: string }[]>([]);
  const [newTraitKey, setNewTraitKey] = useState("");
  const [newTraitValue, setNewTraitValue] = useState("");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [newCreatorName, setNewCreatorName] = useState("");
  const [newCreatorAddress, setNewCreatorAddress] = useState("");
  const [newCreatorPercent, setNewCreatorPercent] = useState<number>(0);
  const [newCreatorDesc, setNewCreatorDesc] = useState("");

  const [shouldMintLicense, setShouldMintLicense] = useState(false);
  const [mintLicenseAmount, setMintLicenseAmount] = useState(1);

  const addTrait = () => {
    if (newTraitKey && newTraitValue) {
      setTraits([...traits, { key: newTraitKey, value: newTraitValue }]);
      setNewTraitKey("");
      setNewTraitValue("");
    } else {
      toast.info("🏷️ Trait data incomplete. Name and value required.");
    }
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const addCreator = () => {
    if (newCreatorName && newCreatorAddress && newCreatorPercent > 0) {
      setCreators([
        ...creators,
        {
          name: newCreatorName,
          address: newCreatorAddress,
          contributionPercent: newCreatorPercent,
          description: newCreatorDesc || "Collaborator",
        },
      ]);
      setNewCreatorName("");
      setNewCreatorAddress("");
      setNewCreatorPercent(0);
      setNewCreatorDesc("");
    } else {
      toast.info("📄 Please provide Name, Address and Contribution %");
    }
  };

  const removeCreator = (index: number) => {
    setCreators(creators.filter((_, i) => i !== index));
  };

  const updateCreator = (index: number, field: keyof Creator, value: any) => {
    const newCreators = [...creators];
    newCreators[index] = { ...newCreators[index], [field]: value };
    setCreators(newCreators);
  };

  const handleEvolveIP = async () => {
    if (!uploadedImage || !imageName.trim()) {
      toast.error("⚠️ Critical metadata missing. Complete all fields.", {
        description: "Please provide a name for your evolution.",
      });
      return;
    }

    const totalPercent = creators.reduce(
      (sum, c) => sum + Number(c.contributionPercent),
      0
    );

    if (totalPercent !== 100) {
      toast.error("💰 Revenue split error. Total must equal 100%.", {
        description: `Total contribution must equal 100%. Current total: ${totalPercent}%`,
      });
      return;
    }

    if (!user) {
      toast.error("🔐 Authentication required. Login to evolve IP assets.");
      return;
    }

    if (!licenseTermsId) {
      toast.error("📜 License parameters undefined. Set terms to proceed.", {
        description: "Cannot evolve without license terms.",
      });
      return;
    }

    setIsRegistering(true);
    toast.loading("🧬 IP EVOLUTION INITIATED... Mutating asset DNA...", {
      description: "Registering your derivative work. Please wait.",
    });

    try {
      const base64Data = uploadedImage.split(",")[1];

      const response = await fetch("/api/evolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBuffer: base64Data,
          imageName: imageName.trim(),
          prompt: description.trim() || "Evolved Image",
          walletAddress: wallet.address,
          description: description.trim(),
          attributes: traits,
          creators: creators,
          userId: user.uid,
          parentIpId,
          licenseTermsId,
          mintLicenseAmount: shouldMintLicense ? mintLicenseAmount : 0,
        }),
      });

      const data = await response.json();
      toast.dismiss();

      if (data.success) {
        toast.success("🎊 EVOLUTION COMPLETE! Your IP has transcended.", {
          description: `Your derivative IP has been minted.`,
          action: {
            label: "View on Story",
            onClick: () => window.open(data.explorerUrl, "_blank"),
          },
        });

        // Reset and redirect
        router.push("/gallery");
      } else {
        throw new Error(data.error || "Evolution failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error evolving IP:", error);
      toast.error("❌ Evolution failed.", { description: error.message });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-6 pb-12 relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6 relative z-10"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
          EVOLVE <br />
          <span className="neo-gradient-text text-glow">THE STORY</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
          Create a derivative work and extend the legacy of an existing IP.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Parent IP Context */}
        <Card className="neo-card border-white/10 bg-white/5 h-fit">
          <CardHeader>
            <CardTitle className="text-2xl">Evolving From</CardTitle>
            <CardDescription>
              You are creating a derivative of this IP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {parentImageUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img
                  src={parentImageUrl}
                  alt="Parent IP"
                  className="w-full h-auto"
                />
              </div>
            )}
            <div className="p-4 rounded-lg bg-black/20 font-mono text-sm break-all">
              <span className="text-muted-foreground">Parent IP ID:</span>
              <br />
              {parentIpId}
            </div>
          </CardContent>
        </Card>

        {/* Evolution Form */}
        <Card className="neo-card border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
              <GitMerge className="w-8 h-8 text-primary" />
              Create Evolution
            </CardTitle>
            <CardDescription className="text-lg">
              Upload your derivative work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
            </div>

            <AnimatePresence>
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-10 pt-10 border-t border-primary/20"
                >
                  <div className="flex justify-center">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-w-lg w-full rounded-2xl shadow-2xl border-2 border-primary/30"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="imageName"
                        className="text-xl font-semibold"
                      >
                        Evolution Name
                      </Label>
                      <Input
                        id="imageName"
                        placeholder="My Evolved Creation"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg opacity-50 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-xl font-semibold"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your evolution..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white/5 border-white/10 rounded-xl px-6 py-4 text-lg min-h-[120px]"
                      />
                    </div>

                    {/* Traits Section */}
                    <div className="space-y-4">
                      <Label className="text-xl font-semibold">Traits</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Trait Name (e.g. Mood)"
                          value={newTraitKey}
                          onChange={(e) => setNewTraitKey(e.target.value)}
                          className="bg-white/5 border-white/10"
                        />
                        <Input
                          placeholder="Value (e.g. Happy)"
                          value={newTraitValue}
                          onChange={(e) => setNewTraitValue(e.target.value)}
                          className="bg-white/5 border-white/10"
                        />
                        <Button
                          onClick={addTrait}
                          variant="secondary"
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add Trait
                        </Button>
                      </div>

                      {traits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {traits.map((trait, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm"
                            >
                              <span className="text-muted-foreground">
                                {trait.key}:
                              </span>
                              <span className="font-medium text-primary">
                                {trait.value}
                              </span>
                              <button
                                onClick={() => removeTrait(index)}
                                className="hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* License Minting Section */}
                    <div className="space-y-4 p-6 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-xl font-semibold">
                            Mint License Tokens
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Create license tokens for your evolution immediately
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="mintLicense"
                            checked={shouldMintLicense}
                            onChange={(e) =>
                              setShouldMintLicense(e.target.checked)
                            }
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {shouldMintLicense && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4">
                              <Label>Amount to Mint</Label>
                              <Input
                                type="number"
                                min="1"
                                value={mintLicenseAmount}
                                onChange={(e) =>
                                  setMintLicenseAmount(Number(e.target.value))
                                }
                                className="mt-2 bg-black/20 border-white/10"
                              />
                              <p className="text-xs text-muted-foreground mt-2">
                                These tokens allow others to use your IP
                                according to its terms.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Creators Section (Simplified for brevity, can be expanded if needed) */}
                    <div className="space-y-4">
                      <Label className="text-xl font-semibold">Creator</Label>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="font-medium">
                          {user?.displayName || "You"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {wallet.address}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleEvolveIP}
                      disabled={isRegistering || !imageName.trim()}
                      size="lg"
                      className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-4 h-auto rounded-full font-bold"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          Evolving on Blockchain...
                        </>
                      ) : (
                        <>
                          <GitMerge className="w-6 h-6 mr-3" />
                          Evolve IP
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
