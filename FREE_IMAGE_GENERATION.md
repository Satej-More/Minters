# 🆓 FREE Image Generation Setup - Hugging Face

## Why Hugging Face?
- ✅ **100% FREE** - No credit card required
- ✅ **1,000 requests/month** on free tier
- ✅ **Fast setup** - Takes 2 minutes
- ✅ **Good quality** - Uses FLUX.1 model

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Create Account

1. Go to: **https://huggingface.co/**
2. Click **"Sign Up"** (top right)
3. Sign up with:
   - Email + Password, OR
   - Google account, OR
   - GitHub account
4. Verify your email

### Step 2: Create Access Token

1. Once logged in, click your **profile picture** (top right)
2. Click **"Settings"**
3. In the left sidebar, click **"Access Tokens"**
4. Click **"New token"** button
5. **Configure token:**
   - Name: `Minters App`
   - Type: Select **"Read"** (default is fine)
   - Click **"Generate token"**
6. **Copy the token** (starts with `hf_...`)
   - Save it immediately!

### Step 3: Add to `.env.local`

Open your `.env.local` file and add:

```env
# Use Hugging Face (FREE)
HUGGINGFACE_API_KEY=hf_YourTokenHere
IMAGE_PROVIDER=huggingface
```

### Step 4: Remove/Comment Stability AI (Optional)

You can remove or comment out the Stability AI line:

```env
# STABILITY_API_KEY=not-needed-for-free-option
```

---

## ✅ That's It!

Restart your dev server and you're ready to generate images for FREE! 🎉

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 📊 Comparison: Free vs Paid

| Feature | Hugging Face (FREE) | Stability AI (PAID) |
|---------|---------------------|---------------------|
| **Cost** | $0 | $10 minimum |
| **Requests/month** | 1,000 free | Unlimited (with credits) |
| **Image Quality** | Good | Excellent |
| **Speed** | 3-10 seconds | 2-5 seconds |
| **Model** | FLUX.1-schnell | Stable Diffusion 3 |
| **Setup Time** | 2 minutes | 5 minutes |

---

## 🎨 Other FREE Alternatives

If you want even more options:

### 1. **Pollinations.ai** (No API key needed!)
- Completely free
- No signup required
- Just HTTP requests

### 2. **Replicate** (Free tier)
- $0.01 per generation
- Free $5 credit on signup
- 500 free images

### 3. **Together.ai** (Free tier)
- $25 free credits
- Multiple models available

---

## 💡 Recommendation

**For testing/development:** Use **Hugging Face** (FREE)
**For production:** Consider **Stability AI** (better quality)

You can always switch later by just changing the `IMAGE_PROVIDER` variable!

---

## 🆘 Troubleshooting

**"Model is loading" error:**
- Hugging Face models sometimes need to "warm up"
- Wait 20 seconds and try again
- This only happens on first use

**Rate limit exceeded:**
- Free tier: 1,000 requests/month
- Wait until next month or upgrade to Pro ($9/month)

**Token invalid:**
- Make sure you copied the entire token (starts with `hf_`)
- Check for extra spaces
- Regenerate token if needed
