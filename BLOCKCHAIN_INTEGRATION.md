# Blockchain Integration Guide

This guide shows how Bernice integrates with your deployed smart contract on Base using Wagmi hooks.

## 🚀 Integration Status

⚠️ **Smart Contract - Ready for Base Sepolia Deployment**
- Network: **Base Sepolia Testnet** (switched from mainnet)
- Address: `NEEDS_DEPLOYMENT` (placeholder in utils/utils.ts)
- ABI: Available in `utils/utils.ts`

✅ **Frontend Integration**
- Wagmi hooks for contract interactions
- Transaction status tracking
- Real-time blockchain data fetching

## 📁 File Structure

```
bernice/
├── utils/utils.ts                    # Contract address & ABI
├── lib/
│   ├── blockchain-utils.ts           # Wagmi hooks for contract calls
│   ├── blockchain-story-manager.ts   # High-level story operations
│   └── story-utils.ts                # Legacy mock data (for fallback)
├── app/components/
│   ├── StoryComponents.tsx           # Updated with blockchain hooks
│   └── BlockchainDemo.tsx            # Demo component for testing
└── contracts/                       # Smart contract source (for reference)
```

## 🔧 How It Works

### 1. Contract Interaction Hooks (`blockchain-utils.ts`)

**Write Operations:**
```typescript
// Create a story
const { createStory, isCreatingStory, createStoryHash } = useCreateStory();
await createStory("Title", "Description", 10, ["tag1", "tag2"]);

// Submit first chapter (auto-accepted)
const { submitFirstChapter } = useSubmitFirstChapter();
await submitFirstChapter(storyId, "Chapter content...");

// Submit chapter continuation (goes to voting)
const { submitChapterContinuation } = useSubmitChapterContinuation();
await submitChapterContinuation(storyId, "Next chapter content...");

// Vote for submission
const { voteForSubmission } = useVoteForSubmission();
await voteForSubmission(submissionId);
```

**Read Operations:**
```typescript
// Get all story IDs
const { storyIds, isLoading } = useGetAllStoryIds();

// Get specific story
const { story } = useGetStory(storyId);

// Get submissions for voting
const { submissionIds } = useGetChapterSubmissions(storyId, chapterNumber);

// Check if user voted
const { hasVoted } = useHasUserVoted(submissionId, userAddress);
```

### 2. Transaction Handling

```typescript
// Wait for transaction confirmation
const { isConfirmed, isLoading } = useWaitForTransaction(transactionHash);

useEffect(() => {
  if (isConfirmed) {
    // Transaction confirmed, update UI
    console.log("Transaction confirmed!");
  }
}, [isConfirmed]);
```

### 3. Component Integration

**Story Creation:**
```typescript
export function StoryCreation({ onStoryCreated }: Props) {
  const { createStory, isCreatingStory, createStoryHash } = useStoryOperations();
  const { isConfirmed } = useWaitForTransaction(createStoryHash);
  
  const handleCreate = async () => {
    await createStory("Title", "Description", 10, []);
  };
  
  // Auto-redirect when transaction confirms
  useEffect(() => {
    if (isConfirmed) {
      onStoryCreated(tempStoryObject);
    }
  }, [isConfirmed]);
}
```

## 🎮 Testing the Integration

### Option 1: Use the Demo Component

1. Add the demo component to your page:
```typescript
import { BlockchainDemo } from "./components/BlockchainDemo";

// In your page component
<BlockchainDemo />
```

2. Connect your wallet
3. Click "Create Test Story"
4. Wait for confirmation
5. Submit a first chapter
6. View the blockchain data

### Option 2: Use the Main App

1. Navigate to the main Bernice app
2. Click "Begin a Story" 
3. Set chapter count and click "Begin Your Story"
4. Wait for the transaction to confirm
5. Write your first chapter
6. Submit and wait for confirmation

## 🔄 Transaction Flow

### Creating a Story
1. User clicks "Begin Your Story"
2. `createStory()` is called with auto-generated title
3. Transaction sent to blockchain
4. UI shows "Sending Transaction..."
5. Transaction confirms
6. UI shows "Confirming..."
7. User redirected to chapter writing
8. Story ID available from transaction receipt

### Writing First Chapter
1. User writes content and clicks "Publish Chapter"
2. `submitFirstChapter()` called
3. Transaction sent (chapter auto-accepted)
4. UI shows transaction status
5. Chapter immediately becomes part of story
6. User redirected back to story view

### Writing Subsequent Chapters
1. User writes content and clicks "Submit Chapter"
2. `submitChapterContinuation()` called
3. Transaction sent (goes to voting pool)
4. Voting round automatically starts
5. Community can vote on submissions
6. After voting period, winning chapter selected

### Voting Process
1. User sees pending submissions in Vote tab
2. Clicks "Vote" on preferred submission
3. `voteForSubmission()` called
4. Transaction sent to blockchain
5. Vote recorded on-chain
6. Vote counts update in real-time

## ⚙️ Configuration

### Contract Address
Update in `utils/utils.ts`:
```typescript
export const contractAddress = "0x65791f4170f12cE5104280202Cf8D03146CABC16";
```

### Network Configuration
The app is now configured for Base Sepolia testnet:
```typescript
import { baseSepolia } from 'wagmi/chains';

// In app/providers.tsx
<MiniKitProvider
  chain={baseSepolia}
  // ... other config
>
```

## 🚀 **IMPORTANT: Deploy to Base Sepolia First**

Before using the app, you need to deploy the smart contracts to Base Sepolia:

### 1. Set up environment variables:
```bash
# Create .env file
make env

# Edit .env file with your values:
# PRIVATE_KEY=your_private_key_here
# BASESCAN_API_KEY=your_basescan_api_key_here
```

### 2. Get Base Sepolia ETH:
- Go to [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- Connect your wallet and request testnet ETH

### 3. Deploy contracts:
```bash
# Build contracts first
make build

# Deploy to Base Sepolia
make deploy-sepolia
```

### 4. Update contract address:
After deployment, copy the contract address from the console output and update `utils/utils.ts`:
```typescript
export const contractAddress = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 5. Test the integration:
```bash
# Start the development server
npm run dev

# Use the BlockchainDemo component to test
```

## 🐛 Troubleshooting

### Transaction Failures
- Check wallet has enough ETH for gas
- Verify contract address is correct
- Ensure user is on Base network

### Data Not Loading
- Check if wallet is connected
- Verify contract ABI is up to date
- Check network connection

### Voting Issues
- Ensure voting round is active
- Check user hasn't already voted
- Verify submission exists

## 🚀 Next Steps

1. **Test the integration** using the demo component
2. **Deploy to testnet** first (Base Sepolia)
3. **Add error handling** for better UX
4. **Implement caching** for better performance
5. **Add event listeners** for real-time updates
6. **Integrate with indexing** service for faster queries

## 📖 Key Benefits

- ✅ **Decentralized**: Stories live on blockchain
- ✅ **Transparent**: All votes are public and verifiable
- ✅ **Immutable**: Published chapters can't be changed
- ✅ **Democratic**: Community decides story direction
- ✅ **Incentivized**: NFT rewards for contributors (when rewards contract deployed)

The integration is now complete and ready for testing! 🎉
