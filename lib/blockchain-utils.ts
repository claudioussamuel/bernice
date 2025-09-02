import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddress, abi } from '../utils/utils';
import { Story, StorySubmission } from './types';

// ============ CONTRACT INTERACTION HOOKS ============

/**
 * Hook to create a new story on the blockchain
 */
export function useCreateStory() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const createStory = async (
    title: string,
    totalChapters: number,
    votingPeriodSeconds: number,
    chapterOneContent: string
  ) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'createStory',
        args: [title, BigInt(totalChapters), BigInt(votingPeriodSeconds), chapterOneContent],
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
 * Hook to submit a chapter continuation
 */
export function useSubmitContinuation() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const submitContinuation = async (storyId: number, content: string) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'submitContinuation',
        args: [BigInt(storyId), content],
      });
      return hash;
    } catch (error) {
      console.error('Error submitting continuation:', error);
      throw error;
    }
  };

  return {
    submitContinuation,
    hash,
    isPending,
    error
  };
}

/**
 * Hook to vote for a submission
 */
export function useVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const vote = async (storyId: number, submissionIndex: number) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'vote',
        args: [BigInt(storyId), BigInt(submissionIndex)],
      });
      return hash;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  return {
    vote,
    hash,
    isPending,
    error
  };
}

/**
 * Hook to finalize the current chapter
 */
export function useFinalizeCurrentChapter() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const finalizeCurrentChapter = async (storyId: number) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'finalizeCurrentChapter',
        args: [BigInt(storyId)],
      });
      return hash;
    } catch (error) {
      console.error('Error finalizing current chapter:', error);
      throw error;
    }
  };

  return {
    finalizeCurrentChapter,
    hash,
    isPending,
    error
  };
}

/**
 * Hook to extend voting period
 */
export function useExtendVoting() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const extendVoting = async (storyId: number, extraSeconds: number) => {
    try {
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'extendVoting',
        args: [BigInt(storyId), BigInt(extraSeconds)],
      });
      return hash;
    } catch (error) {
      console.error('Error extending voting:', error);
      throw error;
    }
  };

  return {
    extendVoting,
    hash,
    isPending,
    error
  };
}

// ============ READ HOOKS ============

/**
 * Hook to get total story count
 */
export function useGetStoryCount() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 's_storyCount',
  });

  return {
    storyCount: data ? Number(data) : undefined,
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
  const transformStoryData = (rawData: unknown): Story | null => {
    if (!rawData || !Array.isArray(rawData)) return null;
    
    return {
      id: String(storyId),
      title: String(rawData[1]), // title is index 1
      creator: {
        address: String(rawData[0]), // creator is index 0
        username: undefined,
      },
      createdAt: new Date(), // We don't have timestamp in the contract
      isComplete: Boolean(rawData[6]), // completed is index 6
      currentChapter: Number(rawData[3]), // currentChapterNumber is index 3
      maxChapters: Number(rawData[2]), // totalChapters is index 2
      chapters: [], // We'll need to fetch these separately
      tags: [], // Not stored in this contract
      totalVotes: 0, // We'll calculate this separately
      description: '', // Not stored in this contract
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
 * Hook to get chapter content
 */
export function useGetChapterContent(storyId: number | undefined, chapterNumber: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getChapterContent',
    args: (storyId && chapterNumber) ? [BigInt(storyId), BigInt(chapterNumber)] : undefined,
    query: {
      enabled: !!(storyId && chapterNumber),
    },
  });

  return {
    content: data as string | undefined,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get submissions count for a story
 */
export function useGetSubmissionsCount(storyId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getSubmissionsCount',
    args: storyId ? [BigInt(storyId)] : undefined,
    query: {
      enabled: !!storyId,
    },
  });

  return {
    submissionsCount: data ? Number(data) : undefined,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to get a specific submission
 */
export function useGetSubmission(storyId: number | undefined, chapterNumber: number | undefined, submissionIndex: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getSubmission',
    args: (storyId && chapterNumber !== undefined && submissionIndex !== undefined) ? 
      [BigInt(storyId), BigInt(chapterNumber), BigInt(submissionIndex)] : undefined,
    query: {
      enabled: !!(storyId && chapterNumber !== undefined && submissionIndex !== undefined),
    },
  });

  // Transform blockchain data to our StorySubmission interface
  const transformSubmissionData = (rawData: unknown): StorySubmission | null => {
    if (!rawData || !Array.isArray(rawData)) return null;
    
    return {
      id: `${storyId}-${chapterNumber}-${submissionIndex}`,
      storyId: String(storyId),
      chapterNumber: chapterNumber!,
      content: String(rawData[1]), // content is index 1
      author: {
        address: String(rawData[0]), // author is index 0
        username: undefined,
      },
      votes: [], // We'll need to track this separately
      totalVotes: Number(rawData[2]), // votes is index 2
      createdAt: new Date(), // Not available in contract
      isWinner: false, // We'll determine this separately
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
 * Hook to check if a user has voted
 */
export function useHasUserVoted(storyId: number | undefined, chapterNumber: number | undefined, userAddress: string | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 's_hasVoted',
    args: (storyId && chapterNumber !== undefined && userAddress) ? 
      [BigInt(storyId), BigInt(chapterNumber), userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(storyId && chapterNumber !== undefined && userAddress),
    },
  });

  return {
    hasVoted: data as boolean | undefined,
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
