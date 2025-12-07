import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http, parseEther, zeroAddress, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function getStoryClient(wallet: any) {
    if (!wallet.address) throw new Error('Wallet not connected');

    const config: StoryConfig = {
        account: wallet.address,
        transport: http('https://rpc.ankr.com/story_aeneid_testnet'),
        chainId: 1315 as any, // Aeneid testnet
    };

    return StoryClient.newClient(config);
}

export async function getServerStoryClient() {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) throw new Error('WALLET_PRIVATE_KEY not found in environment variables');

    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const config: StoryConfig = {
        account: account,
        transport: http('https://rpc.ankr.com/story_aeneid_testnet'),
        chainId: 1315 as any, // Aeneid testnet
    };

    return StoryClient.newClient(config);
}

export const WIP_TOKEN_ADDRESS = "0x1514000000000000000000000000000000000000" as Address;

export const ROYALTY_POLICY_LAP = "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E" as Address;
export const MINTING_FEE = parseEther("1");
export const COMMERCIAL_REV_SHARE = 50; // 50%

export const commercialRemixTerms = {
    transferable: true,
    royaltyPolicy: ROYALTY_POLICY_LAP,
    defaultMintingFee: MINTING_FEE,
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: zeroAddress,
    commercialRevShare: COMMERCIAL_REV_SHARE,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: WIP_TOKEN_ADDRESS,
    uri: "https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json",
};

export const creativeCommonsTerms = {
    transferable: true,
    royaltyPolicy: ROYALTY_POLICY_LAP,
    defaultMintingFee: BigInt(0),
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: zeroAddress,
    commercializerCheckerData: zeroAddress,
    commercialRevShare: 0,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: WIP_TOKEN_ADDRESS,
    uri: "https://github.com/piplabs/pil-document/blob/998c13e6ee1d04eb817aefd1fe16dfe8be3cd7a2/off-chain-terms/CC-BY.json",
};