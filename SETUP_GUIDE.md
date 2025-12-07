# 🔐 API Keys & Wallet Configuration Guide

This guide will help you set up all the required API keys and wallet configuration for the Minters (Intellect Protocol) application.

## 📋 Required Configuration

You need to configure **5 main things**:

1. **Wallet Private Key** - Your blockchain wallet
2. **RPC Provider URL** - Story Protocol blockchain connection
3. **Pinata JWT** - For IPFS file storage
4. **Stability AI API Key** - For AI image generation
5. **Firebase Configuration** - For database and authentication

---

## 🚀 Quick Setup Steps

### Step 1: Create Your Environment File

1. Copy the `.env.example` file and rename it to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in your text editor

### Step 2: Get Your Wallet Private Key

**⚠️ WARNING: NEVER share your private key with anyone!**

#### From MetaMask:
1. Open MetaMask extension
2. Click the three dots (⋮) → Account Details
3. Click "Show Private Key"
4. Enter your password
5. Copy the private key (starts with `0x`)

#### Add to `.env.local`:
```env
WALLET_PRIVATE_KEY=0xYOUR_64_CHARACTER_PRIVATE_KEY_HERE
```

### Step 3: Configure RPC Provider URL

For **Story Protocol Testnet (Aeneid)**:

```env
NEXT_PUBLIC_RPC_PROVIDER_URL=https://rpc.odyssey.storyrpc.io
```

**Alternative RPC URLs:**
- Story Testnet: `https://testnet.storyrpc.io`
- Custom RPC: Contact Story Protocol for private endpoints

### Step 4: Get Pinata JWT Token (IPFS Storage)

1. Go to [Pinata Cloud](https://app.pinata.cloud/)
2. Sign up for a free account
3. Navigate to **API Keys** section
4. Click **"New Key"**
5. Enable these permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
6. Give it a name (e.g., "Minters App")
7. Click **"Create Key"**
8. **Copy the JWT token** (you won't see it again!)

#### Add to `.env.local`:
```env
NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Get Stability AI API Key (Image Generation)

1. Go to [Stability AI Platform](https://platform.stability.ai/)
2. Sign up for an account
3. Navigate to **Account** → **API Keys**
4. Click **"Create API Key"**
5. Give it a name (e.g., "Minters")
6. Copy the API key (starts with `sk-`)

#### Add to `.env.local`:
```env
STABILITY_API_KEY=sk-YOUR_STABILITY_API_KEY_HERE
```

### Step 6: Setup Firebase (Database & Authentication)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select existing project
3. Give it a name (e.g., "Minters" or "Intellect-Protocol")
4. Follow the setup wizard (you can disable Google Analytics if you want)
5. Once created, click the **Web icon** (</>) to add a web app
6. Register your app with a nickname (e.g., "Minters Web")
7. **Copy the Firebase configuration** that appears

#### Enable Required Services:

**Firestore Database:**
1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to you
5. Click **"Enable"**

**Authentication:**
1. Go to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** sign-in method
4. Click **"Save"**

#### Add to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

---

## 📝 Complete `.env.local` Example

Your final `.env.local` file should look like this:

```env
# Wallet Configuration
WALLET_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Blockchain RPC
NEXT_PUBLIC_RPC_PROVIDER_URL=https://rpc.odyssey.storyrpc.io

# Pinata IPFS
NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMjM0NSIsImVtYWlsIjoieW91ckBlbWFpbC5jb20ifSwic2NvcGVzIjp7InBpbkZpbGVUb0lQRlMiOnRydWUsInBpbkpTT05Ub0lQRlMiOnRydWV9LCJpYXQiOjE2MzQ1Njc4OTB9.abcdefghijklmnopqrstuvwxyz123456

# Stability AI
STABILITY_API_KEY=sk-1234567890abcdefghijklmnopqrstuvwxyz

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr678stu
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789jkl
```

---

## 🔍 Where These Keys Are Used

### `WALLET_PRIVATE_KEY`
- **File:** `lib/story-protocol.ts` (line 18)
- **Purpose:** Server-side operations for minting IP assets
- **Used in:** Backend API routes for blockchain transactions

### `NEXT_PUBLIC_RPC_PROVIDER_URL`
- **File:** `lib/story-protocol.ts` (lines 10, 25)
- **Purpose:** Connect to Story Protocol blockchain
- **Used in:** All blockchain read/write operations

### `NEXT_PUBLIC_PINATA_JWT`
- **File:** `lib/pinata.ts` (line 26)
- **Purpose:** Upload images and metadata to IPFS
- **Used in:** Storing NFT metadata and images

### `STABILITY_API_KEY`
- **File:** `lib/image-generator.ts` (line 18)
- **Purpose:** Generate AI images from text prompts
- **Used in:** AI image generation feature

### `NEXT_PUBLIC_FIREBASE_*`
- **File:** `lib/firebase.ts` (lines 6-11)
- **Purpose:** Database and user authentication
- **Used in:** User accounts, storing minted assets, authentication

---

## ✅ Verify Your Setup

After adding all keys, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Test Each Service:

1. **Wallet Connection:** Try connecting your wallet on the homepage
2. **Firebase Auth:** Sign up/login at `/auth`
3. **Image Generation:** Go to `/generate` and create an AI image
4. **IPFS Upload:** Mint an asset and check if metadata uploads
5. **Blockchain:** Verify transactions on Story Protocol explorer

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use a test wallet** - Don't use your main wallet with real funds
3. **Rotate keys regularly** - Change API keys periodically
4. **Use environment-specific keys** - Different keys for dev/prod
5. **Backup your keys** - Store them securely (password manager)

---

## 🆘 Troubleshooting

### "WALLET_PRIVATE_KEY not found"
- Make sure `.env.local` exists in the project root
- Restart your dev server after adding keys
- Check for typos in variable names

### "Invalid Pinata JWT"
- Verify the JWT is complete (very long string)
- Make sure there are no extra spaces
- Regenerate the key if needed

### "Stability AI API error"
- Check your API key is active
- Verify you have credits in your Stability AI account
- Try generating a simple prompt first

### "RPC Provider connection failed"
- Check your internet connection
- Try alternative RPC URLs
- Verify the Story Protocol testnet is online

---

## 📚 Additional Resources

- [Story Protocol Docs](https://docs.story.foundation/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Stability AI API Docs](https://platform.stability.ai/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## 🎯 Next Steps

Once configured:
1. ✅ Connect your wallet
2. ✅ Generate your first AI image
3. ✅ Mint it as an IP Asset
4. ✅ Set licensing terms
5. ✅ View it in the gallery

Happy minting! 🚀
