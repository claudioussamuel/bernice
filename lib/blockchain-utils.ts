import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, abi } from '../utils/utils';
import { Story, StorySubmission, Vote } from './types';

// ============ CONTRACT INTERACTION HOOKS ============

/**
 * Hook to create a new story on the blockchain
 */
export function useCreateStory() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const createStory = async (
    title: string,
    description: string,
    maxChapters: number,
    tags: string[] = []
  ) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'createStory',
        args: [title, description, BigInt(maxChapters), tags],
      });
      return hash;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  };

  return {
    createStory,
    hash,
    isPending,
    error
  };
}

/**
 * Hook to submit the first chapter of a story
 */
export function useSubmitFirstChapter() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const submitFirstChapter = async (storyId: number, content: string) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'submitFirstChapter',
        args: [BigInt(storyId), content],
      });
      return hash;
    } catch (error) {
      console.error('Error submitting first chapter:', error);
      throw error;
    }
  };

  return {
    submitFirstChapter,
    hash,
    isPending,
    error
  };
}

/**
 * Hook to submit a chapter continuation
 */
export function useSubmitChapterContinuation() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const submitChapterContinuation = async (storyId: number, content: string) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'submitChapterContinuation',
        args: [BigInt(storyId), content],
      });
      return hash;
    } catch (error) {
      console.error('Error submitting chapter continuation:', error);
      throw error;
    }
  };

  return {
    submitChapterContinuation,
    hash,
    isPending,
    error
  };
}

/**
 * Hook to vote for a submission
 */
export function useVoteForSubmission() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const voteForSubmission = async (submissionId: number) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'voteForSubmission',
        args: [BigInt(submissionId)],
      });
      return hash;
    } catch (error) {
      console.error('Error voting for submission:', error);
      throw error;
    }
  };

  return {
    voteForSubmission,
    hash,
    isPending,
    error
  };
}

/**
 * Hook to finalize voting for a chapter
 */
export function useFinalizeVoting() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const finalizeVoting = async (storyId: number, chapterNumber: number) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'finalizeVoting',
        args: [BigInt(storyId), BigInt(chapterNumber)],
      });
      return hash;
    } catch (error) {
      console.error('Error finalizing voting:', error);
      throw error;
    }
  };

  return {
    finalizeVoting,
    hash,
    isPending,
    error
  };
}

// ============ READ HOOKS ============

/**
 * Hook to get all story IDs
 */
export function useGetAllStoryIds() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getAllStoryIds',
  });

  return {
    storyIds: data as bigint[] | undefined,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get a specific story by ID
 */
export function useGetStory(storyId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getStory',
    args: storyId ? [BigInt(storyId)] : undefined,
    query: {
      enabled: !!storyId,
    },
  });

  // Transform blockchain data to our Story interface
  const transformStoryData = (rawData: any): Story | null => {
    if (!rawData) return null;
    
    return {
      id: rawData[0].toString(),
      title: rawData[2],
      description: rawData[3],
      creator: {
        address: rawData[1],
        username: undefined, // We'll need to get this from somewhere else
      },
      createdAt: new Date(Number(rawData[8]) * 1000),
      isComplete: rawData[6],
      currentChapter: Number(rawData[5]),
      maxChapters: Number(rawData[4]),
      chapters: [], // We'll need to fetch these separately
      tags: rawData[9] || [],
      totalVotes: Number(rawData[7]),
    };
  };

  return {
    story: transformStoryData(data),
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get a specific chapter by ID
 */
export function useGetChapter(chapterId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getChapter',
    args: chapterId ? [BigInt(chapterId)] : undefined,
    query: {
      enabled: !!chapterId,
    },
  });

  return {
    chapter: data,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get submissions for a specific chapter
 */
export function useGetChapterSubmissions(storyId: number | undefined, chapterNumber: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getChapterSubmissions',
    args: (storyId && chapterNumber) ? [BigInt(storyId), BigInt(chapterNumber)] : undefined,
    query: {
      enabled: !!(storyId && chapterNumber),
    },
  });

  return {
    submissionIds: data as bigint[] | undefined,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get a specific submission by ID
 */
export function useGetSubmission(submissionId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getSubmission',
    args: submissionId ? [BigInt(submissionId)] : undefined,
    query: {
      enabled: !!submissionId,
    },
  });

  // Transform blockchain data to our StorySubmission interface
  const transformSubmissionData = (rawData: any): StorySubmission | null => {
    if (!rawData) return null;
    
    return {
      id: rawData[0].toString(),
      storyId: rawData[1].toString(),
      chapterNumber: Number(rawData[2]),
      content: rawData[3],
      author: {
        address: rawData[4],
        username: undefined,
      },
      votes: [], // We'll need to track this separately
      totalVotes: Number(rawData[5]),
      createdAt: new Date(Number(rawData[6]) * 1000),
      isWinner: rawData[7],
    };
  };

  return {
    submission: transformSubmissionData(data),
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get voting round for a story
 */
export function useGetVotingRound(storyId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getVotingRound',
    args: storyId ? [BigInt(storyId)] : undefined,
    query: {
      enabled: !!storyId,
    },
  });

  return {
    votingRound: data,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to check if a user has voted for a submission
 */
export function useHasUserVoted(submissionId: number | undefined, userAddress: string | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'hasUserVoted',
    args: (submissionId && userAddress) ? [BigInt(submissionId), userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(submissionId && userAddress),
    },
  });

  return {
    hasVoted: data as boolean | undefined,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get stories created by a user
 */
export function useGetUserStories(userAddress: string | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getUserStories',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    userStoryIds: data as bigint[] | undefined,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get submissions made by a user
 */
export function useGetUserSubmissions(userAddress: string | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getUserSubmissions',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    userSubmissionIds: data as bigint[] | undefined,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get total number of stories
 */
export function useGetTotalStories() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getTotalStories',
  });

  return {
    totalStories: data ? Number(data) : undefined,
    isLoading,
    error,
    refetch
  };
}

// ============ TRANSACTION RECEIPT HOOKS ============

/**
 * Hook to wait for transaction confirmation
 */
export function useWaitForTransaction(hash: `0x${string}` | undefined) {
  const { data, isLoading, error } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  return {
    receipt: data,
    isLoading,
    error,
    isConfirmed: !!data,
  };
}

// ============ UTILITY FUNCTIONS ============

/**
 * Convert bigint array to number array
 */
export function bigintArrayToNumbers(arr: bigint[] | undefined): number[] {
  if (!arr) return [];
  return arr.map(item => Number(item));
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Convert timestamp to Date
 */
export function timestampToDate(timestamp: bigint | number): Date {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000);
}
