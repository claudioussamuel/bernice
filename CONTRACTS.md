# Bernice Smart Contracts

Smart contracts for the Bernice collaborative storytelling platform on Base.

## Overview

Bernice is a decentralized platform for collaborative storytelling where:
1. Users create stories with a maximum chapter limit
2. The creator writes the first chapter (automatically accepted)
3. Community members submit different versions of subsequent chapters
4. The community votes on their favorite continuation
5. The winning submission becomes the canonical next chapter
6. Contributors earn NFT achievements for their participation

## Contracts

### BerniceStoryPlatform.sol
The main contract handling:
- **Story Creation**: Users can create new collaborative stories
- **Chapter Management**: First chapters are auto-accepted, subsequent chapters go through voting
- **Submission System**: Writers submit their version of the next chapter
- **Voting System**: Community votes on submitted chapters with time-limited rounds
- **Story Progression**: Winning submissions become canonical chapters

#### Key Features:
- Pure creative freedom (no genre constraints)
- Democratic chapter selection through voting
- Configurable story length (1-50 chapters)
- Time-limited voting rounds (1-7 days, default 3 days)
- Anti-spam measures and vote validation
- Emergency admin functions for stuck votes

### BerniceRewards.sol
NFT achievement system that rewards users for:
- **Story Creator**: Creating a new story
- **First Chapter Author**: Writing the opening chapter
- **Winning Author**: Having a submission selected by the community
- **Story Completer**: Writing the final chapter of a completed story
- **Prolific Writer**: Submitting 10+ winning chapters
- **Community Favorite**: Receiving 100+ total votes across submissions
- **Story Finisher**: Having a created story reach completion
- **Dedicated Voter**: Casting 50+ votes on submissions

#### Achievement Features:
- Non-transferable NFTs (soulbound tokens)
- Progressive achievements based on statistics
- Metadata URI system for rich NFT displays
- Statistics tracking for all user activities

## Architecture

```
┌─────────────────────┐    ┌──────────────────┐
│  Frontend (Next.js) │────│  Smart Contracts │
└─────────────────────┘    └──────────────────┘
           │                         │
           │                         ├── BerniceStoryPlatform
           │                         │   ├── Story Management
           │                         │   ├── Chapter Submissions
           │                         │   ├── Voting System
           │                         │   └── Story Progression
           │                         │
           │                         └── BerniceRewards
           │                             ├── NFT Achievements
           │                             ├── Statistics Tracking
           │                             └── Progressive Rewards
           │
           └── OnchainKit/Wagmi (Web3 Integration)
```

## Getting Started

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) (for frontend integration)

### Installation

1. **Install dependencies:**
   ```bash
   make install
   # or
   forge install OpenZeppelin/openzeppelin-contracts --no-commit
   ```

2. **Build contracts:**
   ```bash
   make build
   # or
   forge build
   ```

3. **Run tests:**
   ```bash
   make test
   # or
   forge test -vvv
   ```

### Environment Setup

1. **Create environment file:**
   ```bash
   make env
   ```

2. **Edit `.env` file with your values:**
   ```bash
   PRIVATE_KEY=your_private_key_here
   BASESCAN_API_KEY=your_basescan_api_key_here
   RPC_URL_BASE_SEPOLIA=https://sepolia.base.org
   RPC_URL_BASE_MAINNET=https://mainnet.base.org
   ```

### Deployment

#### Local Development
```bash
# Start local blockchain
make anvil

# Deploy to local network
make deploy-local
```

#### Base Sepolia Testnet
```bash
make deploy-sepolia
```

#### Base Mainnet
```bash
make deploy-mainnet
```

### Testing

```bash
# Run all tests
make test

# Run with gas reporting
make test-gas

# Run specific contract tests
make test-story
make test-rewards

# Generate coverage report
make coverage
```

## Contract Interactions

### Creating a Story
```solidity
function createStory(
    string memory title,        // Can be empty for pure creativity
    string memory description,  // Can be empty
    uint256 maxChapters,       // 1-50 chapters
    string[] memory tags       // Optional tags
) external returns (uint256 storyId)
```

### Submitting First Chapter
```solidity
function submitFirstChapter(
    uint256 storyId,
    string memory content
) external returns (uint256 chapterId)
```

### Submitting Chapter Continuation
```solidity
function submitChapterContinuation(
    uint256 storyId,
    string memory content
) external returns (uint256 submissionId)
```

### Voting
```solidity
function voteForSubmission(uint256 submissionId) external
```

### Finalizing Voting Round
```solidity
function finalizeVoting(uint256 storyId, uint256 chapterNumber) external
```

## Gas Optimization

The contracts are optimized for gas efficiency:
- Struct packing for storage efficiency
- Batch operations where possible
- Minimal external calls
- Efficient enumeration patterns

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency pause functionality
- **Access Control**: Owner-only admin functions
- **Input Validation**: Comprehensive parameter checking
- **Vote Prevention**: Users can't vote twice on same submission
- **Time-locked Voting**: Prevents manipulation of voting rounds

## Frontend Integration

The contracts are designed to work seamlessly with the Next.js frontend using:
- **OnchainKit**: For wallet connections and transactions
- **Wagmi**: For contract interactions
- **Viem**: For low-level blockchain interactions

Example frontend integration:
```typescript
import { useWriteContract } from 'wagmi'
import { BERNICE_STORY_PLATFORM_ABI } from './abis'

const { writeContract } = useWriteContract()

// Create a story
const createStory = async () => {
  await writeContract({
    address: STORY_PLATFORM_ADDRESS,
    abi: BERNICE_STORY_PLATFORM_ABI,
    functionName: 'createStory',
    args: ['', '', 10, []], // Pure creative freedom
  })
}
```

## Development Commands

All available commands can be seen with:
```bash
make help
```

Key commands:
- `make build` - Build contracts
- `make test` - Run tests
- `make fmt` - Format code
- `make deploy-sepolia` - Deploy to testnet
- `make doc` - Generate documentation
- `make analyze` - Run static analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass: `make test`
5. Format code: `make fmt`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or support:
- GitHub Issues: Create an issue in the repository
- Documentation: Run `make doc-serve` for detailed contract docs
- Community: Join our Discord/Telegram (links in main README)
