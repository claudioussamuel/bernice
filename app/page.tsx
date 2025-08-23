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
import { StoryBrowser, StoryCreation, StoryReader, ChapterWriter, VotingInterface } from "./components/StoryComponents";
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
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-6xl mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-6 h-11">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[var(--app-foreground)]">
                Bernice
              </h1>
              <span className="text-sm text-[var(--app-foreground-muted)]">
                Pure Creative Freedom
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
            {saveFrameButton}
          </div>
        </header>

        {/* Network Warning Banner */}
        {context?.user && !isOnBaseSepolia && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🔄</span>
                <div>
                  <h4 className="font-semibold text-blue-800">Wrong Network</h4>
                  <p className="text-sm text-blue-700">
                    Switch to Base Sepolia to use Bernice blockchain features
                  </p>
                </div>
              </div>
              <Button onClick={handleSwitchNetwork} size="sm">
                Switch Network
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Tabs - only show on main views */}
        {(activeView === "browse" || activeView === "vote") && (
          <div className="flex items-center space-x-1 mb-6 p-1 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] w-fit">
            <button
              onClick={() => setActiveView("browse")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === "browse"
                  ? "bg-[var(--app-accent)] text-[var(--app-background)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => setActiveView("vote")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === "vote"
                  ? "bg-[var(--app-accent)] text-[var(--app-background)]"
                  : "text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              }`}
            >
              Vote
            </button>
          </div>
        )}

        {/* Back button for other views */}
        {activeView !== "browse" && activeView !== "vote" && (
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToBrowse}
              icon={<Icon name="arrow-right" size="sm" className="rotate-180" />}
            >
              Back
            </Button>
          </div>
        )}

        <main className="flex-1">
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
        </main>

        <footer className="mt-6 pt-4 flex justify-center border-t border-[var(--app-card-border)]">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
