# 🚀 Deploy Bernice to Base Sepolia

This guide walks you through deploying your Bernice smart contracts to Base Sepolia testnet.

## ✅ Prerequisites

- [x] Foundry installed
- [x] Wallet with Base Sepolia ETH
- [x] Basescan API key (optional, for verification)

## 📋 Step-by-Step Deployment

### 1. Get Base Sepolia ETH

**Option A: Coinbase Faucet (Recommended)**
1. Go to [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Connect your wallet
3. Request testnet ETH (you'll get ~0.05 ETH)

**Option B: Bridge from Ethereum Sepolia**
1. Get Sepolia ETH from [Ethereum Sepolia Faucet](https://sepoliafaucet.com/)
2. Bridge to Base Sepolia via [Base Bridge](https://bridge.base.org/deposit)

### 2. Set Up Environment

```bash
# Navigate to bernice directory
cd bernice

# Create environment file
make env

# Edit .env file with your values
```

**Edit `.env` file:**
```bash
PRIVATE_KEY=your_wallet_private_key_without_0x
BASESCAN_API_KEY=your_basescan_api_key_here
RPC_URL_BASE_SEPOLIA=https://sepolia.base.org
RPC_URL_BASE_MAINNET=https://mainnet.base.org
```

> ⚠️ **Security Note**: Never commit your `.env` file to Git. It's already in `.gitignore`.

### 3. Install Dependencies

```bash
# Install OpenZeppelin contracts
make install

# Build contracts to check for errors
make build
```

### 4. Run Tests (Optional but Recommended)

```bash
# Run all tests
make test

# Or run with detailed output
make test-gas
```

### 5. Deploy to Base Sepolia

```bash
# Deploy contracts
make deploy-sepolia
```

**Expected Output:**
```
Deploying contracts...
Deployer address: 0xYourAddress
Deployer balance: 50000000000000000
Deploying BerniceStoryPlatform...
BerniceStoryPlatform deployed at: 0x1234567890123456789012345678901234567890
Deploying BerniceRewards...
BerniceRewards deployed at: 0x0987654321098765432109876543210987654321
=== DEPLOYMENT SUMMARY ===
Network: 84532
BerniceStoryPlatform: 0x1234567890123456789012345678901234567890
BerniceRewards: 0x0987654321098765432109876543210987654321
Deployer: 0xYourAddress
========================
```

### 6. Update Contract Address

Copy the **BerniceStoryPlatform** address and update `utils/utils.ts`:

```typescript
// Before
export const contractAddress = "0x0000000000000000000000000000000000000000";

// After
export const contractAddress = "0x1234567890123456789012345678901234567890"; // Your actual address
```

### 7. Verify Contracts (Optional)

```bash
# Verify on Basescan
forge verify-contract YOUR_CONTRACT_ADDRESS contracts/BerniceStoryPlatform.sol:BerniceStoryPlatform --chain base-sepolia --etherscan-api-key $BASESCAN_API_KEY
```

### 8. Test the Integration

```bash
# Start development server
npm run dev

# Open browser and go to your app
# Use the BlockchainDemo component to test
```

## 🧪 Testing Your Deployment

### Option 1: Use BlockchainDemo Component

Add to your page:
```typescript
import { BlockchainDemo } from "./components/BlockchainDemo";

// In your component
<BlockchainDemo />
```

### Option 2: Use Main App

1. Connect your wallet (make sure you're on Base Sepolia)
2. Click "Begin a Story"
3. Create a story (should send transaction)
4. Write first chapter
5. Check story appears in browse view

## 📊 Contract Verification

After deployment, your contracts will be available on:
- **Basescan Sepolia**: `https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS`
- **Base Sepolia Explorer**: `https://base-sepolia.blockscout.com/address/YOUR_CONTRACT_ADDRESS`

## 🔧 Troubleshooting

### Common Issues

**1. "Insufficient funds for gas"**
```bash
# Solution: Get more Base Sepolia ETH
# Visit the faucet again or check your balance
```

**2. "Private key not found"**
```bash
# Solution: Check your .env file
# Make sure PRIVATE_KEY is set (without 0x prefix)
```

**3. "RPC URL not responding"**
```bash
# Solution: Check your internet connection
# The RPC endpoint might be temporarily down
# Try again in a few minutes
```

**4. "Contract creation failed"**
```bash
# Solution: Check if contracts compile
make build

# Check for any compilation errors
# Make sure OpenZeppelin is installed
make install
```

### Verification Issues

**1. "Contract verification failed"**
```bash
# Solution: Make sure you have BASESCAN_API_KEY set
# Get API key from https://basescan.org/apis
# Wait a few minutes after deployment before verifying
```

## 🎉 Success!

Once deployed and tested, you'll have:

- ✅ **BerniceStoryPlatform** contract on Base Sepolia
- ✅ **BerniceRewards** contract on Base Sepolia  
- ✅ Frontend connected to testnet
- ✅ Full blockchain integration working

## 🚀 Next Steps

1. **Test thoroughly** on Base Sepolia
2. **Gather feedback** from users
3. **Deploy to Base mainnet** when ready
4. **Set up monitoring** and analytics
5. **Plan token economics** for rewards

---

**Need Help?**
- Check the [BLOCKCHAIN_INTEGRATION.md](./BLOCKCHAIN_INTEGRATION.md) for detailed technical info
- Review the [CONTRACTS.md](./CONTRACTS.md) for contract documentation
- Look at Foundry docs: https://book.getfoundry.sh/

Happy deploying! 🎉🚀
