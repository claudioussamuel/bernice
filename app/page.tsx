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
import { useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Button, Icon } from "./components/DemoComponents";
import { StoryReader, ChapterWriter, VotingInterface } from "./components/StoryComponents";
import { 
  ChronicleButton, 
  ChronicleInput, 
  ChronicleAvatar, 
  ChronicleGameCard, 
  ChronicleCreateStory
} from "./components/ChronicleComponents";
import { Story, StorySubmission } from "../lib/types";
import sdk from "@farcaster/frame-sdk";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeView, setActiveView] = useState<"browse" | "create" | "read" | "write" | "vote">("browse");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  sdk.actions.ready()
  // Network management
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isOnBaseSepolia = chainId === baseSepolia.id;

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

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
  
  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: baseSepolia.id });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

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
              <ChronicleAvatar
                src=""
                alt="User"
                size="lg"
                fallback="U"
              />
              <div>
                <Wallet className="z-10">
                  <ConnectWallet>
                    <span className="text-xl font-semibold text-[var(--app-foreground)]">
                      <Name />
                    </span>
                  </ConnectWallet>
                  <WalletDropdown className="bg-[var(--app-surface)] rounded-2xl shadow-xl border border-[var(--app-card-border)]">
                    <Identity className="px-6 pt-4 pb-3" hasCopyAddressOnClick>
                      <Avatar />
                      <Name />
                      <Address />
                      <EthBalance />
                    </Identity>
                                      <WalletDropdownDisconnect className="mx-3 mb-3" />
                  </WalletDropdown>
                </Wallet>
              </div>
            </div>

            {/* Right side - Logout */}
            <div className="flex items-center space-x-3">
              {saveFrameButton}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    // Handle logout
                  }
                }}
                className="p-2 text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Network Warning Banner */}
        {context?.user && !isOnBaseSepolia && (
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🔄</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">Wrong Network</h4>
                  <p className="text-sm text-blue-700">Switch to Base Sepolia</p>
                </div>
              </div>
              <ChronicleButton onClick={handleSwitchNetwork} variant="primary" size="sm">
                Switch
              </ChronicleButton>
            </div>
          </div>
        )}

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

            {/* Active Games - Exact Chronicle Layout */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--app-foreground)]">
                Active games
              </h2>
              <div className="space-y-3">
                <ChronicleGameCard
                  title="The Mystery of the Lost Kingdom"
                  description="A thrilling adventure through ancient lands filled with mystery and wonder..."
                  participants={[
                    { id: "1", name: "Alice", avatar: "" },
                    { id: "2", name: "Bob", avatar: "" },
                    { id: "3", name: "Charlie", avatar: "" },
                  ]}
                  status="Writing"
                  round={2}
                  maxRounds={5}
                  onClick={() => {
                                            setSelectedStory({
                          id: "1",
                          title: "The Mystery of the Lost Kingdom",
                          description: "A thrilling adventure through ancient lands filled with mystery and wonder...",
                          chapters: [],
                          currentChapter: 2,
                          maxChapters: 5,
                          isComplete: false,
                          createdAt: new Date(),
                          creator: { address: "0x123", username: "Alice" },
                          tags: [],
                          totalVotes: 0
                        });
                    setActiveView("read");
                  }}
                />
                <ChronicleGameCard
                  title="Space Odyssey 2024"
                  description="Journey through the cosmos in this sci-fi collaborative story..."
                  participants={[
                    { id: "4", name: "Dave", avatar: "" },
                    { id: "5", name: "Eve", avatar: "" },
                  ]}
                  status="Voting"
                  round={1}
                  maxRounds={3}
                  onClick={() => {
                                            setSelectedStory({
                          id: "2",
                          title: "Space Odyssey 2024",
                          description: "Journey through the cosmos in this sci-fi collaborative story...",
                          chapters: [],
                          currentChapter: 1,
                          maxChapters: 3,
                          isComplete: false,
                          createdAt: new Date(),
                          creator: { address: "0x456", username: "Dave" },
                          tags: [],
                          totalVotes: 0
                        });
                    setActiveView("read");
                  }}
                />
              </div>
            </div>

            {/* Completed Games - Exact Chronicle Layout */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--app-foreground)]">
                Completed games
              </h2>
              <div className="space-y-3">
                <ChronicleGameCard
                  title="The Dragon's Tale"
                  description="An epic fantasy story that captivated readers with its magical world..."
                  participants={[
                    { id: "6", name: "Frank", avatar: "" },
                    { id: "7", name: "Grace", avatar: "" },
                    { id: "8", name: "Henry", avatar: "" },
                    { id: "9", name: "Ivy", avatar: "" },
                  ]}
                  status="Completed"
                  onClick={() => {
                                            setSelectedStory({
                          id: "3",
                          title: "The Dragon's Tale",
                          description: "An epic fantasy story that captivated readers with its magical world...",
                          chapters: [],
                          currentChapter: 5,
                          maxChapters: 5,
                          isComplete: true,
                          createdAt: new Date(),
                          creator: { address: "0x789", username: "Frank" },
                          tags: [],
                          totalVotes: 0
                        });
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
