"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Story, StoryFilters } from "../../lib/types";
import { StoryManager } from "../../lib/story-utils";
import { useStoryOperations } from "../../lib/blockchain-story-manager";
import { useWaitForTransaction } from "../../lib/blockchain-utils";

// Modern Story Card Component with Dribbble Aesthetics
interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

function StoryCard({ story, onClick }: StoryCardProps) {
  const { address } = useAccount();
  const progress = (story.currentChapter / story.maxChapters) * 100;
  const excerpt = StoryManager.getStoryExcerpt(story);
  const engagement = StoryManager.calculateEngagementScore(story);
  const isCreator = address && story.creator.address === address;

  return (
    <div
      className="card card-interactive group cursor-pointer slide-up"
      onClick={onClick}
      style={{animationDelay: `${Math.random() * 0.3}s`}}
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {story.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              {story.title.startsWith("Untitled Story") ? (
                <h3 className="text-heading-3 text-neutral-700 mb-1">
                  Story by {story.creator.username || `${story.creator.address.slice(0, 6)}...`}
                </h3>
              ) : (
                <h3 className="text-heading-3 text-neutral-800 mb-1 line-clamp-1">
                  {story.title}
                </h3>
              )}
              <p className="text-caption text-neutral-500">
                {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isCreator && (
              <div className="status-badge status-info">
                ✨ Yours
              </div>
            )}
            <div className="flex items-center space-x-1 text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
              <span>⭐</span>
              <span className="font-medium">{engagement}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-body text-neutral-600 mb-6 line-clamp-3">
          {excerpt}
        </p>

        {/* Progress Section */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-body-sm font-medium text-neutral-700">
                Chapter {story.currentChapter} of {story.maxChapters}
              </span>
              <span className="text-body-sm font-bold text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-neutral-500">
                <span className="text-lg">💖</span>
                <span className="text-body-sm font-medium">{story.totalVotes}</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-500">
                <span className="text-lg">📚</span>
                <span className="text-body-sm font-medium">{story.chapters.length}</span>
              </div>
            </div>
            
            {story.isComplete && (
              <div className="status-badge status-success">
                ✅ Complete
              </div>
            )}
          </div>

          {/* Tags */}
          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {story.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-xs font-medium rounded-full text-neutral-600 border border-neutral-200"
                >
                  #{tag}
                </span>
              ))}
              {story.tags.length > 3 && (
                <span className="px-3 py-1 bg-neutral-100 text-xs font-medium rounded-full text-neutral-500">
                  +{story.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Modern Story Browser with Dribbble Design
interface StoryBrowserProps {
  onStorySelect: (story: Story) => void;
  onCreateStory: () => void;
}

export function StoryBrowser({ onStorySelect, onCreateStory }: StoryBrowserProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StoryFilters>({
    status: "all",
    sortBy: "newest"
  });

  useEffect(() => {
    const loadStories = async () => {
      try {
        const allStories = await StoryManager.getAllStories();
        setStories(allStories);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const filteredStories = stories.filter(story => {
    if (filters.status === "active") return !story.isComplete;
    if (filters.status === "complete") return story.isComplete;
    return true;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (filters.sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === "popular") {
      return b.totalVotes - a.totalVotes;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-body text-neutral-500">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-display-2 gradient-text">
            Discover Stories
          </h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            Pure creativity, no constraints. Join collaborative stories where every voice matters and the community shapes the narrative.
          </p>
        </div>
        
        <button
          onClick={onCreateStory}
          className="btn btn-primary btn-lg group"
        >
          <span className="text-xl mr-2">✨</span>
          <span>Start Your Story</span>
          <div className="ml-2 transform group-hover:translate-x-1 transition-transform">→</div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 card glass-effect p-2 rounded-xl">
            <button
              onClick={() => setFilters({...filters, status: "all"})}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filters.status === "all" ? "btn btn-primary" : "text-neutral-600 hover:bg-white/50"
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => setFilters({...filters, status: "active"})}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filters.status === "active" ? "btn btn-primary" : "text-neutral-600 hover:bg-white/50"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilters({...filters, status: "complete"})}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filters.status === "complete" ? "btn btn-primary" : "text-neutral-600 hover:bg-white/50"
              }`}
            >
              Complete
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-body-sm text-neutral-500">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value as "newest" | "popular"})}
            className="form-input form-select text-sm py-2 px-3"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Stories Grid */}
      {sortedStories.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
          <h3 className="text-heading-2 text-neutral-700 mb-4">No Stories Yet</h3>
          <p className="text-body text-neutral-500 mb-8 max-w-md mx-auto">
            Be the first to create a collaborative story! Start writing and let the community help shape your narrative.
          </p>
          <button
            onClick={onCreateStory}
            className="btn btn-primary btn-lg"
          >
            <span className="text-xl mr-2">✨</span>
            Create the First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => onStorySelect(story)}
            />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="text-center pt-12 border-t border-neutral-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-heading-2 gradient-text">{stories.length}</div>
            <div className="text-body-sm text-neutral-500">Total Stories</div>
          </div>
          <div>
            <div className="text-heading-2 gradient-text">
              {stories.filter(s => !s.isComplete).length}
            </div>
            <div className="text-body-sm text-neutral-500">Active Stories</div>
          </div>
          <div>
            <div className="text-heading-2 gradient-text">
              {stories.reduce((sum, s) => sum + s.totalVotes, 0)}
            </div>
            <div className="text-body-sm text-neutral-500">Community Votes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modern Story Creation Component
interface StoryCreationProps {
  onStoryCreated: (story: Story) => void;
  onCancel: () => void;
}

export function StoryCreation({ onStoryCreated, onCancel }: StoryCreationProps) {
  const { address } = useAccount();
  const [maxChapters, setMaxChapters] = useState(10);
  const { 
    createStory, 
    isCreatingStory, 
    createStoryError, 
    createStoryHash 
  } = useStoryOperations();
  
  // Wait for transaction confirmation
  const { isConfirmed, isLoading: isWaitingConfirmation } = useWaitForTransaction(createStoryHash);

  const handleCreateStory = async () => {
    if (!address) return;

    try {
      // Generate a simple auto-title and let the first chapter define the story
      const autoTitle = `Untitled Story #${Date.now().toString().slice(-6)}`;
      const autoDescription = "A collaborative story waiting to be told...";
      
      await createStory(autoTitle, autoDescription, maxChapters, []);
      
      // The transaction hash will be available in createStoryHash
      // We'll wait for confirmation before calling onStoryCreated
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && createStoryHash) {
      // Create a temporary story object for the UI
      const tempStory: Story = {
        id: createStoryHash, // Use transaction hash as temporary ID
        title: `Untitled Story #${Date.now().toString().slice(-6)}`,
        description: "A collaborative story waiting to be told...",
        creator: { address: address! },
        createdAt: new Date(),
        isComplete: false,
        currentChapter: 0,
        maxChapters,
        chapters: [],
        tags: [],
        totalVotes: 0,
      };
      
      onStoryCreated(tempStory);
    }
  }, [isConfirmed, createStoryHash, address, maxChapters, onStoryCreated]);

  const canCreate = address;
  const isProcessing = isCreatingStory || isWaitingConfirmation;

  return (
    <div className="max-w-2xl mx-auto space-y-8 fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
          <span className="text-white text-3xl">✨</span>
        </div>
        <div>
          <h1 className="text-display-2 gradient-text mb-4">
            Begin Your Story
          </h1>
          <p className="text-body-lg text-neutral-600 max-w-lg mx-auto">
            Start a collaborative masterpiece. Write the opening, and let the community craft the journey together.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="card p-10 space-y-8">
        {/* Philosophy Section */}
        <div className="text-center space-y-4 pb-8 border-b border-neutral-200">
          <h2 className="text-heading-2 text-neutral-800">Pure Creative Freedom</h2>
          <p className="text-body text-neutral-600 max-w-md mx-auto">
            No titles, descriptions, or tags required. Let your creativity flow without constraints. 
            The story will define itself through the writing.
          </p>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div>
            <label className="block text-body font-semibold text-neutral-700 mb-3">
              Maximum Chapters
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setMaxChapters(Math.max(3, maxChapters - 1))}
                  className="btn btn-ghost w-12 h-12 rounded-full text-xl"
                  disabled={maxChapters <= 3}
                >
                  −
                </button>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text">{maxChapters}</div>
                  <div className="text-caption text-neutral-500">Chapters</div>
                </div>
                <button
                  onClick={() => setMaxChapters(Math.min(50, maxChapters + 1))}
                  className="btn btn-ghost w-12 h-12 rounded-full text-xl"
                  disabled={maxChapters >= 50}
                >
                  +
                </button>
              </div>
              <div className="text-center">
                <div className="text-body-sm text-neutral-500">
                  Choose between 3-50 chapters for your story
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="card-gradient p-6 rounded-2xl space-y-4">
          <h3 className="text-heading-3 text-white mb-4">How It Works</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <div>
                <div className="text-white font-medium">You write the opening chapter</div>
                <div className="text-white/80 text-sm">Set the scene and establish the narrative foundation</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <div>
                <div className="text-white font-medium">Community writes continuations</div>
                <div className="text-white/80 text-sm">Multiple authors submit their version of the next chapter</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <div>
                <div className="text-white font-medium">Community votes on the best</div>
                <div className="text-white/80 text-sm">The winning chapter becomes part of the official story</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 pt-6">
          <button
            onClick={onCancel}
            className="btn btn-ghost btn-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateStory}
            disabled={!canCreate || isProcessing}
            className="btn btn-primary btn-lg"
          >
            {isCreatingStory ? (
              <div className="flex items-center space-x-2">
                <div className="loading-spinner"></div>
                <span>Sending Transaction...</span>
              </div>
            ) : isWaitingConfirmation ? (
              <div className="flex items-center space-x-2">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Confirming...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xl">🚀</span>
                <span>Begin Your Story</span>
              </div>
            )}
          </button>
        </div>

        {/* Error Display */}
        {createStoryError && (
          <div className="status-badge status-error w-full justify-center">
            Error: {createStoryError.message}
          </div>
        )}
      </div>

      {/* Wallet Connection */}
      {!address && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🔐</span>
          </div>
          <h3 className="text-heading-3 text-neutral-700 mb-2">Connect Your Wallet</h3>
          <p className="text-body text-neutral-500 max-w-sm mx-auto">
            Connect your wallet to create and participate in collaborative stories on the blockchain.
          </p>
        </div>
      )}
    </div>
  );
}

// Export all components
export { StoryCard };
