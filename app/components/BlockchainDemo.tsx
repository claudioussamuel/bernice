"use client";

import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { Button, Icon } from "./DemoComponents";
import { 
  useStoriesFromBlockchain, 
  useStoryOperations 
} from "../../lib/blockchain-story-manager";
import { 
  useGetStory, 
  useWaitForTransaction 
} from "../../lib/blockchain-utils";

/**
 * Demo component showing blockchain integration
 * This demonstrates how to use the blockchain hooks
 */
export function BlockchainDemo() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [selectedStoryId, setSelectedStoryId] = useState<number | undefined>();
  
  // Check if contract is deployed
  const isContractDeployed = true;
  
  // Check if on correct network
  const isOnBase = chainId === base.id;
  
  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: base.id });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  // Get story count from blockchain
  const { storyCount, isLoadingStoryCount } = useStoriesFromBlockchain();
  
  // Get specific story details
  const { story, isLoading: loadingStory } = useGetStory(selectedStoryId);
  
  // Story operations
  const {
    createStory,
    isCreatingStory,
    createStoryHash,
    submitContinuation,
    isSubmittingContinuation,
    submitContinuationHash,
  } = useStoryOperations();

  // Wait for transaction confirmations
  const createStoryReceipt = useWaitForTransaction(createStoryHash);
  const continuationReceipt = useWaitForTransaction(submitContinuationHash);

  const handleCreateTestStory = async () => {
    if (!address) return;
    
    try {
      await createStory(
        "Test Blockchain Story",
        5, // totalChapters
        300, // votingPeriodSeconds (5 minutes)
        "This is the first chapter of our blockchain story. It was written and stored directly on the Base blockchain, demonstrating the power of decentralized storytelling."
      );
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  const handleSubmitTestChapter = async () => {
    if (!address || !selectedStoryId) return;
    
    try {
      await submitContinuation(
        selectedStoryId,
        "This is a continuation chapter of our blockchain story. It was written and stored directly on the Base blockchain, demonstrating collaborative storytelling."
      );
    } catch (error) {
      console.error("Error submitting chapter:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl floating-element">
          <span className="text-white text-4xl">⛓️</span>
        </div>
        <h1 className="text-display-2 gradient-text">
          Blockchain Integration
        </h1>
        <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
          Experience the power of decentralized storytelling on Base Sepolia. Test smart contract interactions and explore blockchain features.
        </p>
      </div>

      <div className="card p-10 space-y-10">
        <div className="text-center">
          <h2 className="text-heading-2 text-neutral-800 mb-2">
            Smart Contract Demo
          </h2>
          <p className="text-body text-neutral-600">
            Interact with deployed smart contracts and see blockchain magic in action
          </p>
        </div>
        
        {!address ? (
          <div className="text-center py-8">
            <p className="text-[var(--app-foreground-muted)] mb-4">
              Connect your wallet to interact with the blockchain
            </p>
          </div>
        ) : !isOnBase ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="text-blue-800 mb-4 text-2xl">
              🔄
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Wrong Network
            </h3>
            <p className="text-blue-700 mb-4">
              You&apos;re currently on <strong>{chainId === 1 ? 'Ethereum Mainnet' : chainId === 8453 ? 'Base Mainnet' : `Chain ${chainId}`}</strong>. 
              Switch to Base Mainnet to use the app.
            </p>
            <Button onClick={handleSwitchNetwork} className="mb-4">
              Switch to Base Mainnet
            </Button>
            <div className="text-left bg-blue-100 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">Base Mainnet Details:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Chain ID: 8453</li>
                <li>RPC: https://mainnet.base.org</li>
                <li>Explorer: https://basescan.org</li>
                <li>Currency: ETH</li>
              </ul>
            </div>
          </div>
        ) : !isContractDeployed ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-800 mb-4 text-2xl">
              ⚠️
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Contract Not Deployed
            </h3>
            <p className="text-yellow-700 mb-4">
              The smart contract needs to be deployed to Base Mainnet before you can use the blockchain integration.
            </p>
            <div className="text-left bg-yellow-100 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-semibold mb-2">Quick Setup:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Get Base Mainnet ETH</li>
                <li>Set up your .env file: <code>make env</code></li>
                <li>Deploy contracts: <code>make deploy-base</code></li>
                <li>Update the contract address in utils/utils.ts</li>
              </ol>
            </div>
            <p className="text-xs text-yellow-600 mt-4">
              See DEPLOY_TO_SEPOLIA.md for detailed instructions (adapt for mainnet)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Blockchain Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[var(--app-gray)] rounded-lg p-4">
                <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
                  Total Stories
                </h3>
                <p className="text-2xl font-bold text-[var(--app-accent)]">
                  {isLoadingStoryCount ? "..." : storyCount || 0}
                </p>
              </div>
              
              <div className="bg-[var(--app-gray)] rounded-lg p-4">
                <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
                  Stories Available
                </h3>
                <p className="text-2xl font-bold text-[var(--app-accent)]">
                  {isLoadingStoryCount ? "..." : storyCount || 0}
                </p>
              </div>
              
              <div className="bg-[var(--app-gray)] rounded-lg p-4">
                <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
                  Network
                </h3>
                <p className="text-sm text-[var(--app-accent)] font-semibold">
                  Base Mainnet
                </p>
                <p className="text-xs text-[var(--app-foreground-muted)]">
                  Chain ID: 8453
                </p>
              </div>
            </div>

            {/* Story Operations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                Blockchain Operations
              </h3>
              
              {/* Create Story */}
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleCreateTestStory}
                  disabled={isCreatingStory || createStoryReceipt.isLoading}
                  icon={<Icon name="plus" size="sm" />}
                >
                  {isCreatingStory ? "Sending Transaction..." :
                   createStoryReceipt.isLoading ? "Confirming..." :
                   "Create Test Story"}
                </Button>
                
                {createStoryHash && (
                  <div className="text-sm text-[var(--app-foreground-muted)]">
                    Tx: {`${createStoryHash.slice(0, 6)}...${createStoryHash.slice(-4)}`}
                    {createStoryReceipt.isConfirmed && (
                      <span className="text-green-500 ml-2">✓ Confirmed</span>
                    )}
                  </div>
                )}
              </div>

              {/* Story Selection */}
              {storyCount && storyCount > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--app-foreground)]">
                    Select a Story ID:
                  </label>
                  <select
                    value={selectedStoryId || ""}
                    onChange={(e) => setSelectedStoryId(e.target.value ? Number(e.target.value) : undefined)}
                    className="px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)]"
                  >
                    <option value="">Select a story...</option>
                    {Array.from({ length: storyCount }, (_, i) => i + 1).map(id => (
                      <option key={id} value={id}>Story #{id}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Continuation Chapter */}
              {selectedStoryId && (
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleSubmitTestChapter}
                    disabled={isSubmittingContinuation || continuationReceipt.isLoading}
                    icon={<Icon name="plus" size="sm" />}
                  >
                    {isSubmittingContinuation ? "Sending Transaction..." :
                     continuationReceipt.isLoading ? "Confirming..." :
                     "Submit Chapter Continuation"}
                  </Button>
                  
                  {submitContinuationHash && (
                    <div className="text-sm text-[var(--app-foreground-muted)]">
                      Tx: {`${submitContinuationHash.slice(0, 6)}...${submitContinuationHash.slice(-4)}`}
                      {continuationReceipt.isConfirmed && (
                        <span className="text-green-500 ml-2">✓ Confirmed</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Story Details */}
            {selectedStoryId && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                  Story Details (ID: {selectedStoryId})
                </h3>
                
                {loadingStory ? (
                  <div className="text-[var(--app-foreground-muted)]">Loading story...</div>
                ) : story ? (
                  <div className="bg-[var(--app-gray)] rounded-lg p-4 space-y-2">
                    <p><strong>Title:</strong> {story.title}</p>
                    <p><strong>Creator:</strong> {story.creator.address}</p>
                    <p><strong>Max Chapters:</strong> {story.maxChapters}</p>
                    <p><strong>Current Chapter:</strong> {story.currentChapter}</p>
                    <p><strong>Total Votes:</strong> {story.totalVotes}</p>
                    <p><strong>Complete:</strong> {story.isComplete ? "Yes" : "No"}</p>
                  </div>
                ) : (
                  <div className="text-[var(--app-foreground-muted)]">Story not found</div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to Use:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Connect your wallet (already done ✓)</li>
                <li>2. Click Create Test Story to create a story on the blockchain</li>
                <li>3. Wait for the transaction to confirm</li>
                <li>4. Select the newly created story from the dropdown</li>
                <li>5. Click Submit Chapter Continuation to add more content</li>
                <li>6. Check the story details to see the updated information</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
