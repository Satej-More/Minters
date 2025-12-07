import { getStoryClient } from './story-protocol';

export async function getIpAssets(wallet: any) {
    const response = await fetch('https://api.storyapis.com/api/v4/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            options: {
                pagination: { limit: 10, offset: 0 }
            },
            where: {
                owner: wallet.address
            }
        })
    });

    const data = await response.json();
    const ipAssets = data.data.rows;

    const ipAssetsWithMetadata = await Promise.all(
        ipAssets.map(async (ipAsset: any) => {
            if (ipAsset.metadataURI) {
                try {
                    const response = await fetch(ipAsset.metadataURI);
                    const metadata = await response.json();
                    return { ...ipAsset, metadata };
                } catch (error) {
                    console.error('Error fetching metadata:', error);
                    return ipAsset;
                }
            }
            return ipAsset;
        })
    );

    return ipAssetsWithMetadata;
}
