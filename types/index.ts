export interface GeneratedImage {
    id: string;
    cid: string;
    name: string;
    prompt: string;
    timestamp: number;
    ipId?: string;
    status: 'generated' | 'registered';
}

export interface WalletState {
    address: string | null;
    isConnected: boolean;
    chainId: number | null;
}

export interface IPMetadata {
    title: string;
    description: string;
    createdAt: string;
    image: string;
    imageHash: string;
    mediaUrl: string;
    mediaHash: string;
    mediaType: string;
    creators: Array<{
        name: string;
        address: string;
        description: string;
        contributionPercent: number;
        socialMedia: Array<{
            platform: string;
            url: string;
        }>;
    }>;
}

export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
        key: string;
        value: string;
    }>;
}