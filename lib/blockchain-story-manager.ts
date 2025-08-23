import { Story, StorySubmission, Vote } from './types';
import { 
  useGetAllStoryIds, 
  useGetChapterSubmissions,
  useCreateStory,
  useSubmitFirstChapter,
  useSubmitChapterContinuation,
  useVoteForSubmission,
  bigintArrayToNumbers,
  formatAddress 
} from './blockchain-utils';

/**
 * Blockchain-integrated Story Manager
 * This replaces the mock StoryManager with real blockchain interactions
 */
export class BlockchainStoryManager {
  
  /**
   * Fetch all stories from the blockchain
   */
  static async getAllStories(): Promise<Story[]> {
    try {
      // This would need to be called from a component with hooks
      // For now, we'll return the mock data
      // In a real implementation, you'd fetch from blockchain in the component
      return [];
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  }

  /**
   * Get a specific story by ID
   */
  static async getStory(): Promise<Story | null> {
    try {
      // This would be handled by the useGetStory hook in components
      return null;
    } catch (error) {
      console.error('Error fetching story:', error);
      return null;
    }
  }

  /**
   * Create a new story (this would be called from a component with the hook)
   */
  static async createStory(
    title: string,
    description: string,
    creatorAddress: string,
    maxChapters: number = 10,
    tags: string[] = []
  ): Promise<Story> {
    // This is now handled by the useCreateStory hook
    // Return a placeholder for now
    const story: Story = {
      id: 'pending',
      title,
      description,
      creator: { address: creatorAddress },
      createdAt: new Date(),
      isComplete: false,
      currentChapter: 0,
      maxChapters,
      chapters: [],
      tags,
      totalVotes: 0,
    };
    
    return story;
  }

  /**
   * Submit a chapter (handled by blockchain hooks)
   */
  static async submitChapter(
    storyId: string,
    content: string,
    authorAddress: string
  ): Promise<StorySubmission> {
    // This is now handled by useSubmitFirstChapter or useSubmitChapterContinuation hooks
    const submission: StorySubmission = {
      id: 'pending',
      storyId,
      chapterNumber: 1,
      content,
      author: { address: authorAddress },
      votes: [],
      totalVotes: 0,
      createdAt: new Date(),
      isWinner: false,
    };

    return submission;
  }

  /**
   * Vote for a submission (handled by blockchain hook)
   */
  static async voteForSubmission(
    submissionId: string,
    voterAddress: string,
    transactionHash: string
  ): Promise<Vote> {
    // This is now handled by the useVoteForSubmission hook
    const vote: Vote = {
      id: `vote_${Date.now()}`,
      submissionId,
      voter: { address: voterAddress },
      transactionHash,
      createdAt: new Date(),
      weight: 1,
    };

    return vote;
  }

  /**
   * Get submissions for a chapter (handled by blockchain hook)
   */
  static async getSubmissionsForChapter(): Promise<StorySubmission[]> {
    // This is now handled by the useGetChapterSubmissions hook
    return [];
  }

  /**
   * Helper functions that can still be used
   */
  static getStoryExcerpt(story: Story, maxLength: number = 150): string {
    if (story.chapters.length === 0) return story.description;
    
    const firstChapter = story.chapters[0];
    const text = firstChapter.content;
    
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  static calculateEngagementScore(story: Story): number {
    const chapterCount = story.chapters.length;
    const voteCount = story.totalVotes;
    
    // Simple engagement formula
    return (chapterCount * 10) + (voteCount * 2);
  }

  static formatUserAddress(address: string): string {
    return formatAddress(address);
  }
}

/**
 * Hook-based story operations for use in React components
 */
export function useStoryOperations() {
  const createStoryHook = useCreateStory();
  const submitFirstChapterHook = useSubmitFirstChapter();
  const submitContinuationHook = useSubmitChapterContinuation();
  const voteHook = useVoteForSubmission();

  return {
    // Story creation
    createStory: createStoryHook.createStory,
    isCreatingStory: createStoryHook.isPending,
    createStoryError: createStoryHook.error,
    createStoryHash: createStoryHook.hash,

    // First chapter submission
    submitFirstChapter: submitFirstChapterHook.submitFirstChapter,
    isSubmittingFirstChapter: submitFirstChapterHook.isPending,
    submitFirstChapterError: submitFirstChapterHook.error,
    submitFirstChapterHash: submitFirstChapterHook.hash,

    // Chapter continuation
    submitChapterContinuation: submitContinuationHook.submitChapterContinuation,
    isSubmittingContinuation: submitContinuationHook.isPending,
    submitContinuationError: submitContinuationHook.error,
    submitContinuationHash: submitContinuationHook.hash,

    // Voting
    voteForSubmission: voteHook.voteForSubmission,
    isVoting: voteHook.isPending,
    voteError: voteHook.error,
    voteHash: voteHook.hash,
  };
}

/**
 * Hook to fetch and manage stories from blockchain
 */
export function useStoriesFromBlockchain() {
  const { storyIds, isLoading: loadingIds, refetch: refetchIds } = useGetAllStoryIds();
  
  // Convert bigint array to numbers for easier handling
  const storyIdNumbers = bigintArrayToNumbers(storyIds);

  return {
    storyIds: storyIdNumbers,
    isLoadingStoryIds: loadingIds,
    refetchStoryIds: refetchIds,
  };
}

/**
 * Hook to get submissions for voting
 */
export function useSubmissionsForVoting(storyId: number, chapterNumber: number) {
  const { submissionIds, isLoading, refetch } = useGetChapterSubmissions(storyId, chapterNumber);
  
  const submissionIdNumbers = bigintArrayToNumbers(submissionIds);

  return {
    submissionIds: submissionIdNumbers,
    isLoadingSubmissions: isLoading,
    refetchSubmissions: refetch,
  };
}
