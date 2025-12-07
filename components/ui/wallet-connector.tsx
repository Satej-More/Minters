"use client";
import { useWalletContext } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WalletConnector() {
  const { wallet, connectWallet, switchToStoryNetwork } = useWalletContext();

  const handleConnect = async () => {
    if (wallet.chainId !== 1315) {
      await switchToStoryNetwork();
    }
    await connectWallet();
  };

  if (wallet.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Connected</CardTitle>
          <CardDescription>Connected to Story Aeneid Testnet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-mono">
            {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Chain ID: {wallet.chainId}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
      <CardHeader>
        <CardTitle className="text-2xl text-gradient">Connect Wallet</CardTitle>
        <CardDescription>
          Connect your wallet to generate and register images on Story Protocol
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleConnect}
          className="w-full text-lg animate-pulse hover:animate-none"
        >
          Connect MetaMask
        </Button>
      </CardContent>
    </Card>
  );
}
