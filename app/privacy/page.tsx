"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Globe, Lock, FileText, Scale, Mail } from "lucide-react";

export default function PrivacyPage() {
  const iprPrinciples = [
    {
      quote: "Protection of Literary and Artistic Works",
      name: "Berne Convention",
      title: "International Agreement",
    },
    {
      quote: "Trade-Related Aspects of Intellectual Property Rights",
      name: "TRIPS Agreement",
      title: "WTO",
    },
    {
      quote: "WIPO Copyright Treaty",
      name: "WCT",
      title: "World Intellectual Property Organization",
    },
    {
      quote: "Protection of Industrial Property",
      name: "Paris Convention",
      title: "International Treaty",
    },
    {
      quote: "Universal Copyright Convention",
      name: "UCC",
      title: "UNESCO",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 text-center space-y-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Privacy Policy & IPR
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Committed to protecting your data and respecting intellectual property
          rights across borders.
        </p>
      </section>

      {/* Infinite Moving Cards - IPR Principles */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold text-center mb-8 text-muted-foreground">
          Adhering to International IPR Standards
        </h2>
        <div className="h-[20rem] rounded-md flex flex-col antialiased bg-background dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={iprPrinciples}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* Main Content - Carded Layout */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Introduction */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Welcome to Intellect Protocol. We value your privacy and are
              dedicated to protecting your personal data. This policy outlines
              how we collect, use, and safeguard your information when you use
              our platform for AI image generation and registration.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property Rights */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Intellectual Property Rights (IPR)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <strong>User Ownership:</strong> You retain all ownership rights
              to the content you generate and register on our platform, subject
              to the terms of the underlying AI models and applicable laws.
            </p>
            <Separator className="bg-white/10" />
            <p>
              <strong>Platform License:</strong> By using our services, you
              grant us a non-exclusive, worldwide, royalty-free license to use,
              display, and distribute your content solely for the purpose of
              operating and improving our services.
            </p>
            <Separator className="bg-white/10" />
            <p>
              <strong>Copyright Infringement:</strong> We respect the
              intellectual property rights of others. If you believe that any
              content on our platform infringes your copyright, please contact
              us immediately. We adhere to the DMCA and other applicable
              international copyright laws.
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>Account information (wallet address, email if provided).</li>
              <li>Usage data (prompts, generated images, interaction logs).</li>
              <li>Technical data (IP address, browser type, device info).</li>
            </ul>
          </CardContent>
        </Card>

        {/* Use of Information */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Use of Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Provide and maintain our services.</li>
              <li>Process transactions and registrations.</li>
              <li>Improve platform performance and user experience.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              International Transfers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Your information, including personal data, may be transferred to —
              and maintained on — computers located outside of your state,
              province, country, or other governmental jurisdiction where the
              data protection laws may differ than those from your jurisdiction.
              We take all steps reasonably necessary to ensure that your data is
              treated securely and in accordance with this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              The security of your data is important to us, but remember that no
              method of transmission over the Internet, or method of electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your Personal Data, we cannot
              guarantee its absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <p className="mt-2">By email: legal@intellectprotocol.com</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
