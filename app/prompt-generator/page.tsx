"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Sparkles, Loader2, Copy } from "lucide-react";

export default function PromptGeneratorPage() {
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("");
  const [environment, setEnvironment] = useState("");
  const [genre, setGenre] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [artMedium, setArtMedium] = useState("");
  const [mood, setMood] = useState("");
  const [lighting, setLighting] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [composition, setComposition] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    setGeneratedPrompt("");
    toast.loading("🤖 Neural networks processing... Crafting your prompt...");

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          style,
          environment,
          genre,
          timePeriod,
          artMedium,
          mood,
          lighting,
          colorPalette,
          composition,
          customDetails,
        }),
      });

      const data = await response.json();
      toast.dismiss();

      if (data.success) {
        setGeneratedPrompt(data.prompt);
        toast.success("⚡ PROMPT SYNTHESIZED! Ready to create magic.");
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error("❌ Prompt generation failed. AI needs more context.", {
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      toast.success("📋 COPIED! Prompt locked and loaded.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pt-6 pb-12 relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6 relative z-10"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
          YAPPER <span className="neo-gradient-text text-glow">ENGINE</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
          Don't know what to write? Let our AI assistant craft the perfect,
          detailed prompt for you
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-6xl w-full mx-auto"
      >
        <Card className="neo-card border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
              <Sparkles className="w-8 h-8 text-primary" />
              Yapper
            </CardTitle>
            <CardDescription className="text-lg">
              Select from the options below and add any extra details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Subject</Label>
                <Select onValueChange={setSubject}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="What is the main subject?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="character">Character</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                    <SelectItem value="object">Object</SelectItem>
                    <SelectItem value="animal">Animal</SelectItem>
                    <SelectItem value="abstract">Abstract Concept</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Style</Label>
                <Select onValueChange={setStyle}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="What is the artistic style?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photorealistic">
                      Photorealistic
                    </SelectItem>
                    <SelectItem value="fantasy">Fantasy Art</SelectItem>
                    <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                    <SelectItem value="anime">Anime / Manga</SelectItem>
                    <SelectItem value="pixel-art">Pixel Art</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Environment</Label>
                <Select onValueChange={setEnvironment}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="Where is the subject located?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="space">Outer Space</SelectItem>
                    <SelectItem value="indoors">Indoors</SelectItem>
                    <SelectItem value="surreal">Surreal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Genre</Label>
                <Select onValueChange={setGenre}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="What is the overall genre?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Time Period</Label>
                <Select onValueChange={setTimePeriod}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="e.g., Medieval, Futuristic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ancient">Ancient</SelectItem>
                    <SelectItem value="medieval">Medieval</SelectItem>
                    <SelectItem value="victorian">Victorian</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="futuristic">Futuristic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Art Medium</Label>
                <Select onValueChange={setArtMedium}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="e.g., Oil Painting, 3D Render" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil-painting">Oil Painting</SelectItem>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                    <SelectItem value="3d-render">3D Render</SelectItem>
                    <SelectItem value="sculpture">Sculpture</SelectItem>
                    <SelectItem value="charcoal">Charcoal Sketch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Mood</Label>
                <Select onValueChange={setMood}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="e.g., Joyful, Tense" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joyful">Joyful</SelectItem>
                    <SelectItem value="melancholic">Melancholic</SelectItem>
                    <SelectItem value="tense">Tense</SelectItem>
                    <SelectItem value="peaceful">Peaceful</SelectItem>
                    <SelectItem value="chaotic">Chaotic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Lighting</Label>
                <Select onValueChange={setLighting}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="e.g., Soft, Cinematic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soft">Soft Light</SelectItem>
                    <SelectItem value="harsh">Harsh Light</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                    <SelectItem value="dramatic">Dramatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Color Palette</Label>
                <Select onValueChange={setColorPalette}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="e.g., Vibrant, Monochromatic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vibrant">Vibrant</SelectItem>
                    <SelectItem value="monochromatic">Monochromatic</SelectItem>
                    <SelectItem value="pastel">Pastel</SelectItem>
                    <SelectItem value="earthy">Earthy Tones</SelectItem>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl font-semibold">Composition</Label>
                <Select onValueChange={setComposition}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-lg">
                    <SelectValue placeholder="e.g., Close-up, Wide shot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="close-up">Close-up</SelectItem>
                    <SelectItem value="wide-shot">Wide Shot</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                    <SelectItem value="birds-eye">Bird's-eye View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xl font-semibold">
                Additional Details
              </Label>
              <Textarea
                placeholder="Add any other specific details, like colors, mood, or specific elements..."
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl px-6 py-4 text-lg min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleGeneratePrompt}
              disabled={isGenerating}
              size="lg"
              className="w-full bg-primary text-black border-0 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] text-lg px-12 py-8 h-auto rounded-full font-bold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3" />
                  Generate Prompt
                </>
              )}
            </Button>

            {generatedPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-8 border-t border-primary/20"
              >
                <Label className="text-xl font-semibold">
                  Your Generated Prompt
                </Label>
                <div className="relative">
                  <pre className="bg-white/5 border border-white/10 rounded-xl p-6 text-lg whitespace-pre-wrap font-sans">
                    {generatedPrompt}
                  </pre>
                  <Button
                    onClick={copyToClipboard}
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
