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
import { StoryBrowser, StoryCreation } from "./components/ModernStoryComponents";
import { StoryReader, ChapterWriter, VotingInterface } from "./components/StoryComponents";
import { Story, StorySubmission } from "../lib/types";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeView, setActiveView] = useState<"browse" | "create" | "read" | "write" | "vote">("browse");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
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

  const handleStorySelect = useCallback((story: Story) => {
    setSelectedStory(story);
    setActiveView("read");
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-10 floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 floating-element" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 floating-element" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  Bernice
                </h1>
                <p className="text-sm text-neutral-500 font-medium">
                  Pure Creative Freedom
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="card glass-effect px-4 py-2 rounded-xl">
              <Wallet className="z-10">
                <ConnectWallet className="btn btn-primary">
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown className="card">
                  <Identity className="px-6 pt-4 pb-3" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect className="btn btn-ghost w-full m-3" />
                </WalletDropdown>
              </Wallet>
            </div>
            {saveFrameButton}
          </div>
        </header>

        {/* Network Warning Banner */}
        {context?.user && !isOnBaseSepolia && (
          <div className="card status-info mb-8 p-6 fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h4 className="text-heading-3 text-blue-800 mb-1">Wrong Network</h4>
                  <p className="text-body-sm text-blue-700">
                    Switch to Base Sepolia to use Bernice blockchain features
                  </p>
                </div>
              </div>
              <button onClick={handleSwitchNetwork} className="btn btn-primary">
                Switch Network
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs - only show on main views */}
        {(activeView === "browse" || activeView === "vote") && (
          <div className="flex items-center space-x-2 mb-8 p-2 card glass-effect w-fit fade-in">
            <button
              onClick={() => setActiveView("browse")}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeView === "browse"
                  ? "btn btn-primary shadow-lg"
                  : "text-neutral-600 hover:text-neutral-800 hover:bg-white/50"
              }`}
            >
              📚 Stories
            </button>
            <button
              onClick={() => setActiveView("vote")}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeView === "vote"
                  ? "btn btn-primary shadow-lg"
                  : "text-neutral-600 hover:text-neutral-800 hover:bg-white/50"
              }`}
            >
              🗳️ Vote
            </button>
          </div>
        )}

        {/* Back button for other views */}
        {activeView !== "browse" && activeView !== "vote" && (
          <div className="mb-8">
            <button
              onClick={handleBackToBrowse}
              className="btn btn-ghost flex items-center space-x-2 fade-in"
            >
              <span className="text-lg">←</span>
              <span>Back to Stories</span>
            </button>
          </div>
        )}

        <main className="flex-1 space-y-8">
          <div className="fade-in">
            {activeView === "browse" && (
              <StoryBrowser
                onStorySelect={handleStorySelect}
                onCreateStory={() => setActiveView("create")}
              />
            )}
            {activeView === "create" && (
              <StoryCreation
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
          </div>
        </main>

        <footer className="mt-16 pt-8 flex justify-center border-t border-neutral-200">
          <button
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="btn btn-ghost text-neutral-500 hover:text-neutral-700 text-sm"
          >
            <span>Built on Base with MiniKit</span>
            <span className="text-lg ml-2">↗</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
