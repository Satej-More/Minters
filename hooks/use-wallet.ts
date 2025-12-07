'use client';
import { useState, useEffect } from 'react';
import { WalletState } from '@/types';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const STORY_NETWORK = {
    chainId: '0x523',
    chainName: 'Story Aeneid Testnet',
    rpcUrls: ['https://aeneid.storyrpc.io'],
    nativeCurrency: {
        name: 'IP',
        symbol: 'IP',
        decimals: 18,
    },
    blockExplorerUrls: ['https://aeneid.explorer.story.foundation'],
};

export const useWallet = () => {
    const [wallet, setWallet] = useState<WalletState>({
        address: null,
        isConnected: false,
        chainId: null,
    });

    useEffect(() => {
        checkConnection();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
    }, []);

    const checkConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_accounts',
                });
                const chainId = await window.ethereum.request({
                    method: 'eth_chainId',
                });

                if (accounts.length > 0) {
                    setWallet({
                        address: accounts[0],
                        isConnected: true,
                        chainId: parseInt(chainId, 16),
                    });
                }
            } catch (error) {
                console.error('Error checking connection:', error);
            }
        }
    };

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            setWallet({ address: null, isConnected: false, chainId: null });
        } else {
            setWallet(prev => ({ ...prev, address: accounts[0] }));
        }
    };

    const handleChainChanged = (chainId: string) => {
        setWallet(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            await switchToStoryNetwork();

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            const chainId = await window.ethereum.request({
                method: 'eth_chainId',
            });

            setWallet({
                address: accounts[0],
                isConnected: true,
                chainId: parseInt(chainId, 16),
            });
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    const switchToStoryNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: STORY_NETWORK.chainId }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [STORY_NETWORK],
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                }
            }
        }
    };

    return { wallet, connectWallet, switchToStoryNetwork };
};