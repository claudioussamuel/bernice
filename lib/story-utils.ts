import { Story, StorySubmission, Vote, VotingRound } from './types';
import { 
  useGetAllStoryIds, 
  useGetStory, 
  useGetSubmission, 
  useGetChapterSubmissions,
  bigintArrayToNumbers 
} from './blockchain-utils';

// Mock data for development - replace with actual blockchain/database calls
let stories: Story[] = [
  {
    id: "story_1",
    title: "The Digital Realm Chronicles",
    description: "In a world where consciousness can be uploaded to digital realms, a group of explorers discovers that reality itself might be just another layer of code.",
    creator: { address: "0x1234...5678", username: "CyberScribe" },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    isComplete: false,
    currentChapter: 2,
    maxChapters: 10,
    chapters: [
      {
        id: "chapter_1_1",
        storyId: "story_1",
        chapterNumber: 1,
        content: "Maya's fingers trembled as she placed the neural interface crown on her head. The laboratory hummed with anticipation, decades of research culminating in this moment. 'Are you ready to see what lies beyond the veil of reality?' Dr. Chen asked, his voice barely concealing his excitement. Maya nodded, and as the world dissolved around her, she found herself standing in a vast digital landscape where the laws of physics were merely suggestions.",
        author: { address: "0x1234...5678", username: "CyberScribe" },
        votes: 23,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        isSelected: true,
        submissions: []
      },
      {
        id: "chapter_1_2",
        storyId: "story_1",
        chapterNumber: 2,
        content: "The digital realm stretched endlessly in all directions, a kaleidoscope of impossible geometries and floating data streams. Maya took her first tentative steps, watching as her footprints left trails of light that lingered for several seconds before fading. Suddenly, a figure materialized from the swirling code—another consciousness, but one that had been here far longer than any human should have been able to survive.",
        author: { address: "0x9876...4321", username: "QuantumDreamer" },
        votes: 31,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isSelected: true,
        submissions: []
      }
    ],
    tags: ["sci-fi", "cyberpunk", "virtual reality"],
    totalVotes: 54
  },
  {
    id: "story_2",
    title: "Untitled Story #234567",
    description: "A collaborative story waiting to be told...",
    creator: { address: "0xabcd...efgh", username: "BookKeeper" },
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    isComplete: false,
    currentChapter: 1,
    maxChapters: 8,
    chapters: [
      {
        id: "chapter_2_1",
        storyId: "story_2",
        chapterNumber: 1,
        content: "The smell of old paper and leather bindings filled Elena's nostrils as she descended into the hidden chamber. Twenty feet below the bustling city streets, something extraordinary waited in defiance of everything she thought she knew about the world. Rows upon rows of forbidden books lined the walls, their spines catching the warm glow of reading lamps that shouldn't exist in this forgotten place. But tonight, Elena wasn't here by accident—Marcus had found something that would change everything.",
        author: { address: "0xabcd...efgh", username: "BookKeeper" },
        votes: 18,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isSelected: true,
        submissions: []
      }
    ],
    tags: [],
    totalVotes: 18
  },
  {
    id: "story_3",
    title: "Untitled Story #789012",
    description: "A collaborative story waiting to be told...",
    creator: { address: "0x5555...9999", username: "TimeWeaver" },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isComplete: true,
    currentChapter: 5,
    maxChapters: 5,
    chapters: [
      {
        id: "chapter_3_1",
        storyId: "story_3",
        chapterNumber: 1,
        content: "7:43 AM. The alarm clock's shrill cry pierced through Sam's consciousness for what felt like the thousandth time. But this wasn't déjà vu—this was something far more sinister. The same coffee stain on the newspaper, the same peculiar way sunlight hit the kitchen window, the same feeling of dread that had been building with each repetition. Sam had been living this Tuesday for what felt like forever, and with each loop came the growing certainty that someone—or something—was watching.",
        author: { address: "0x5555...9999", username: "TimeWeaver" },
        votes: 45,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isSelected: true,
        submissions: []
      }
    ],
    tags: [],
    totalVotes: 89
  },
  {
    id: "story_4",
    title: "Untitled Story #345678",
    description: "A collaborative story waiting to be told...",
    creator: { address: "0x7777...8888", username: "StoryStarter" },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isComplete: false,
    currentChapter: 0, // No chapters yet - waiting for first chapter
    maxChapters: 12,
    chapters: [],
    tags: [],
    totalVotes: 0
  }
];

let submissions: StorySubmission[] = [
  {
    id: "submission_1",
    storyId: "story_1",
    chapterNumber: 3,
    content: "The mysterious figure stepped closer, and Maya could see that they were once human—or at least, the digital echo of someone who had been. 'You're new here,' the figure said, their voice a harmony of code and memory. 'I've been waiting for someone like you. Someone who still remembers what it feels like to be real.' As they spoke, the landscape around them began to shift, revealing glimpses of a hidden truth about the nature of their digital prison.",
    author: { address: "0xaaaa...bbbb", username: "DigitalGhost" },
    votes: [],
    totalVotes: 7,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isWinner: false
  },
  {
    id: "submission_2",
    storyId: "story_1",
    chapterNumber: 3,
    content: "'Welcome to the Archive,' the figure said, gesturing to the swirling data streams around them. Maya realized that what she had taken for random patterns were actually memories—thousands of human experiences encoded and preserved in digital amber. 'Every consciousness that has ever entered this realm leaves traces,' the figure continued. 'But something is collecting them, harvesting them. And I think you're here to help us stop it.'",
    author: { address: "0xcccc...dddd", username: "MemoryKeeper" },
    votes: [],
    totalVotes: 12,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    isWinner: false
  },
  {
    id: "submission_3",
    storyId: "story_2",
    chapterNumber: 2,
    content: "Marcus stood before something that defied explanation—a book that seemed to shimmer with its own inner light. Elena watched in fascination as words appeared and disappeared on its pages, writing themselves in scripts she'd never seen before. 'I found it in the back corner,' Marcus whispered, his voice trembling with excitement and fear. 'But Elena, when I started reading... things changed. The room, the air, even my thoughts. It's like the words have power.' Elena reached out hesitantly, and the moment her fingers brushed the cover, everything around them began to shift.",
    author: { address: "0xeeee...ffff", username: "RealityBender" },
    votes: [],
    totalVotes: 9,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isWinner: false
  }
];

let votes: Vote[] = [];

export class StoryManager {
  static async createStory(
    title: string,
    description: string,
    creatorAddress: string,
    maxChapters: number = 10,
    tags: string[] = []
  ): Promise<Story> {
    const story: Story = {
      id: `story_${Date.now()}`,
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

    stories.push(story);
    return story;
  }

  static async getStory(storyId: string): Promise<Story | null> {
    return stories.find(s => s.id === storyId) || null;
  }

  static async getAllStories(): Promise<Story[]> {
    return [...stories].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async getActiveStories(): Promise<Story[]> {
    return stories.filter(s => !s.isComplete);
  }

  static async submitChapter(
    storyId: string,
    content: string,
    authorAddress: string
  ): Promise<StorySubmission> {
    const story = await this.getStory(storyId);
    if (!story) throw new Error('Story not found');

    const chapterNumber = story.currentChapter + 1;

    // First chapter (chapter 1) is automatically accepted
    if (chapterNumber === 1) {
      const chapter = {
        id: `chapter_${storyId}_${chapterNumber}`,
        storyId,
        chapterNumber,
        content,
        author: { address: authorAddress },
        votes: 1, // Auto-vote for the creator
        createdAt: new Date(),
        isSelected: true,
        submissions: []
      };

      // Add directly to story chapters
      story.chapters.push(chapter);
      story.currentChapter = chapterNumber;
      story.totalVotes += 1;

      // Return a submission object for consistency, but mark as winner
      const submission: StorySubmission = {
        id: `submission_${Date.now()}`,
        storyId,
        chapterNumber,
        content,
        author: { address: authorAddress },
        votes: [],
        totalVotes: 1,
        createdAt: new Date(),
        isWinner: true,
      };

      return submission;
    }

    // For subsequent chapters, create a submission that needs voting
    const submission: StorySubmission = {
      id: `submission_${Date.now()}`,
      storyId,
      chapterNumber,
      content,
      author: { address: authorAddress },
      votes: [],
      totalVotes: 0,
      createdAt: new Date(),
      isWinner: false,
    };

    submissions.push(submission);
    return submission;
  }

  static async getSubmissionsForChapter(
    storyId: string,
    chapterNumber: number
  ): Promise<StorySubmission[]> {
    return submissions.filter(
      s => s.storyId === storyId && s.chapterNumber === chapterNumber
    ).sort((a, b) => b.totalVotes - a.totalVotes);
  }

  static async voteForSubmission(
    submissionId: string,
    voterAddress: string,
    transactionHash: string
  ): Promise<Vote> {
    // Check if user already voted for this submission
    const existingVote = votes.find(
      v => v.submissionId === submissionId && v.voter.address === voterAddress
    );
    
    if (existingVote) {
      throw new Error('User has already voted for this submission');
    }

    const vote: Vote = {
      id: `vote_${Date.now()}`,
      submissionId,
      voter: { address: voterAddress },
      transactionHash,
      createdAt: new Date(),
      weight: 1,
    };

    votes.push(vote);

    // Update submission vote count
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      submission.votes.push(vote);
      submission.totalVotes += 1;
    }

    return vote;
  }

  static async selectWinningSubmission(
    storyId: string,
    chapterNumber: number
  ): Promise<StorySubmission | null> {
    const chapterSubmissions = await this.getSubmissionsForChapter(storyId, chapterNumber);
    
    if (chapterSubmissions.length === 0) return null;

    // Select the submission with the most votes
    const winner = chapterSubmissions.reduce((prev, current) => 
      current.totalVotes > prev.totalVotes ? current : prev
    );

    // Mark as winner
    winner.isWinner = true;

    // Update story with new chapter
    const story = stories.find(s => s.id === storyId);
    if (story) {
      story.chapters.push({
        id: `chapter_${storyId}_${chapterNumber}`,
        storyId,
        chapterNumber,
        content: winner.content,
        author: winner.author,
        votes: winner.totalVotes,
        createdAt: winner.createdAt,
        isSelected: true,
        submissions: chapterSubmissions,
      });

      story.currentChapter = chapterNumber;
      story.totalVotes += winner.totalVotes;

      // Check if story is complete
      if (chapterNumber >= story.maxChapters) {
        story.isComplete = true;
      }
    }

    return winner;
  }

  static async getStoryProgress(storyId: string): Promise<{
    currentChapter: number;
    totalChapters: number;
    pendingSubmissions: number;
    isVotingOpen: boolean;
  }> {
    const story = await this.getStory(storyId);
    if (!story) throw new Error('Story not found');

    const pendingSubmissions = submissions.filter(
      s => s.storyId === storyId && s.chapterNumber === story.currentChapter + 1
    ).length;

    return {
      currentChapter: story.currentChapter,
      totalChapters: story.maxChapters,
      pendingSubmissions,
      isVotingOpen: pendingSubmissions > 0 && !story.isComplete,
    };
  }

  static async getUserVotes(userAddress: string): Promise<Vote[]> {
    return votes.filter(v => v.voter.address === userAddress);
  }

  static async getUserSubmissions(userAddress: string): Promise<StorySubmission[]> {
    return submissions.filter(s => s.author.address === userAddress);
  }

  // Helper function to generate story excerpt
  static getStoryExcerpt(story: Story, maxLength: number = 150): string {
    if (story.chapters.length === 0) return story.description;
    
    const firstChapter = story.chapters[0];
    const text = firstChapter.content;
    
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Helper function to calculate story engagement score
  static calculateEngagementScore(story: Story): number {
    const chapterCount = story.chapters.length;
    const voteCount = story.totalVotes;
    const submissionCount = submissions.filter(s => s.storyId === story.id).length;
    
    // Simple engagement formula - can be made more sophisticated
    return (chapterCount * 10) + (voteCount * 2) + (submissionCount * 5);
  }
}
