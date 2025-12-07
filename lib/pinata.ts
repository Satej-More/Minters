export async function uploadToIPFS(
    data: Buffer | object,
    fileName: string
): Promise<string> {
    const formData = new FormData();
    const blob = data instanceof Buffer
        ? new Blob([data as any], { type: 'image/png' })
        : new Blob([JSON.stringify(data)], { type: 'application/json' });

    formData.append('file', blob, fileName);

    const metadata = JSON.stringify({
        name: fileName,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
            body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.error || 'Failed to upload to IPFS');
        }

        return result.IpfsHash;
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
    }
}