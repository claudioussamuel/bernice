"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Icon } from "./components/DemoComponents";
import { StoryReader, ChapterWriter, VotingInterface } from "./components/StoryComponents";
import { 
  ChronicleButton, 
  ChronicleInput, 
  ChronicleGameCard, 
  ChronicleCreateStory
} from "./components/ChronicleComponents";
import { Story, StorySubmission } from "../lib/types";
import { useStoriesFromBlockchain } from "../lib/blockchain-story-manager";
import { useGetStory } from "../lib/blockchain-utils";
import { sdk } from '@farcaster/miniapp-sdk'

// StoriesList component to display stories from blockchain
function StoriesList({ onStorySelect }: { onStorySelect: (story: Story) => void }) {
  const { storyCount, isLoadingStoryCount } = useStoriesFromBlockchain();

  if (isLoadingStoryCount) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-[var(--app-foreground-muted)]">Loading stories...</div>
      </div>
    );
  }

  if (!storyCount || storyCount === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-[var(--app-foreground-muted)] mb-4">
          No stories have been created yet.
        </div>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Be the first to start a collaborative story!
        </p>
      </div>
    );
  }

  // Generate story IDs from 1 to storyCount
  const storyIds = Array.from({ length: storyCount }, (_, i) => i + 1);

  return (
    <div className="space-y-3">
      {storyIds.map((storyId) => (
        <StoryCard key={storyId} storyId={storyId} onStorySelect={onStorySelect} />
      ))}
    </div>
  );
}

// Individual story card component
function StoryCard({ storyId, onStorySelect }: { storyId: number; onStorySelect: (story: Story) => void }) {
  const { story, isLoading } = useGetStory(storyId);

  if (isLoading) {
    return (
      <div className="bg-[var(--app-card-bg)] rounded-xl p-6 border border-[var(--app-card-border)]">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  const handleClick = () => {
    onStorySelect(story);
  };

  return (
    <ChronicleGameCard
      title={story.title}
      description={story.description || `Chapter ${story.currentChapter} of ${story.maxChapters}`}
      participants={[
        { 
          id: story.creator.address, 
          name: story.creator.username || `${story.creator.address.slice(0, 6)}...`, 
          avatar: "" 
        }
      ]}
      status={story.isComplete ? "Completed" : "Active"}
      round={story.currentChapter}
      maxRounds={story.maxChapters}
      onClick={handleClick}
    />
  );
}

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeView, setActiveView] = useState<"browse" | "create" | "read" | "write" | "vote">("browse");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  
  // MiniKit provides wallet connection through context
  // No need for separate wallet state management

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Call ready after the app is fully loaded and ready to display
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize MiniApp SDK:', error);
      }
    };
    
    initializeApp();
  }, []);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);



  const handleStoryCreated = useCallback((story: Story) => {
    setSelectedStory(story);
    // Redirect to write the first chapter
    setActiveView("write");
  }, []);

  const handleBackToBrowse = useCallback(() => {
    setActiveView("browse");
    setSelectedStory(null);
  }, []);

  const handleChapterSubmitted = useCallback((submission: StorySubmission) => {
    // In a real app, this would refresh the story data
    // For now, just navigate back to the story
    if (submission.isWinner) {
      alert(`Chapter published successfully! Your story is now live and ready for the next writer.`);
    } else {
      alert(`Chapter submitted successfully! The community can now vote on all submissions for this chapter.`);
    }
    setActiveView("read");
  }, []);
  

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  const handleJoinGame = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    // Simulate joining game - Chronicle shows loading dialog
    setTimeout(() => {
      setIsJoining(false);
      // In Chronicle, successful join navigates to game, error shows snackbar
      alert(`Joining game with code: ${joinCode}`);
      setJoinCode("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--app-background)]">
      {/* Chronicle-style App Bar */}
      <div className="bg-[var(--app-surface)] shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - User info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Wallet className="z-10">
                  <ConnectWallet>
                    <Name className="text-inherit" />
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                      <Avatar />
                      <Name />
                      <Address />
                      <EthBalance />
                    </Identity>
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
              </div>
            </div>

            {/* Right side - Save Frame */}
            <div className="flex items-center space-x-3">
              {saveFrameButton}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-5 py-8">



        {/* Back button for other views */}
        {activeView !== "browse" && (
          <div className="mb-6">
            <button
              onClick={handleBackToBrowse}
              className="flex items-center space-x-2 text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        )}

        {activeView === "browse" && (
          <div className="space-y-8">
            {/* Join Section - Exact Chronicle Layout */}
            <div className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[var(--app-foreground)] text-center">
                  Join via code
                </h2>
                <ChronicleInput
                  placeholder="Enter game code"
                  value={joinCode}
                  onChange={setJoinCode}
                  actionIcon={
                    <button
                      onClick={handleJoinGame}
                      disabled={!joinCode.trim() || isJoining}
                      className="p-1 text-[var(--app-foreground-muted)] hover:text-[var(--app-primary)] transition-colors disabled:opacity-50"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  }
                />
                <p className="text-xl font-semibold text-[var(--app-foreground)] text-center">
                  or
                </p>
                <ChronicleButton
                  onClick={() => setActiveView("create")}
                  variant="secondary"
                  fullWidth
                >
                  Create new game
                </ChronicleButton>
              </div>
            </div>

                        {/* Active Games - Real Blockchain Data */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--app-foreground)]">
                Active stories
              </h2>
              <div className="space-y-3">
                <StoriesList 
                  onStorySelect={(story) => {
                    setSelectedStory(story);
                    setActiveView("read");
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        {activeView === "create" && (
          <ChronicleCreateStory
            onStoryCreated={handleStoryCreated}
            onCancel={handleBackToBrowse}
          />
        )}
        {activeView === "read" && selectedStory && (
          <StoryReader
            story={selectedStory}
            onBackToBrowse={handleBackToBrowse}
            onWriteChapter={() => setActiveView("write")}
            onVoteForSubmissions={() => setActiveView("vote")}
          />
        )}
        
        {activeView === "write" && selectedStory && (
          <ChapterWriter
            story={selectedStory}
            onChapterSubmitted={handleChapterSubmitted}
            onCancel={() => setActiveView("read")}
          />
        )}
        
        {activeView === "vote" && (
          <VotingInterface
            onBackToBrowse={handleBackToBrowse}
          />
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 flex justify-center border-t border-[var(--app-card-border)]">
          <ChronicleButton
            onClick={() => openUrl("https://base.org/builders/minikit")}
            variant="ghost"
            size="sm"
            icon={<span className="text-lg">↗</span>}
          >
            Built on Base with MiniKit
          </ChronicleButton>
        </div>
      </div>

      {/* Loading state handled inline */}
      {isJoining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--app-surface)] rounded-xl p-5 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-[var(--app-primary)] border-t-transparent" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
