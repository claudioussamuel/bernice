// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {BerniceStoryPlatform} from "../contracts/BerniceStoryPlatform.sol";

contract BerniceStoryPlatformTest is Test {
    BerniceStoryPlatform public platform;
    
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public charlie = makeAddr("charlie");
    
    event StoryCreated(uint256 indexed storyId, address indexed creator, string title, uint256 maxChapters);
    event ChapterPublished(uint256 indexed storyId, uint256 indexed chapterId, uint256 chapterNumber, address indexed author);
    event SubmissionCreated(uint256 indexed submissionId, uint256 indexed storyId, uint256 chapterNumber, address indexed author);
    event VoteCast(uint256 indexed submissionId, address indexed voter, uint256 storyId, uint256 chapterNumber);

    function setUp() public {
        platform = new BerniceStoryPlatform();
    }

    function test_CreateStory() public {
        vm.prank(alice);
        
        string[] memory tags = new string[](2);
        tags[0] = "fantasy";
        tags[1] = "adventure";
        
        vm.expectEmit(true, true, false, true);
        emit StoryCreated(1, alice, "Test Story", 5);
        
        uint256 storyId = platform.createStory("Test Story", "A test story", 5, tags);
        
        assertEq(storyId, 1);
        
        BerniceStoryPlatform.Story memory story = platform.getStory(storyId);
        assertEq(story.id, 1);
        assertEq(story.creator, alice);
        assertEq(story.title, "Test Story");
        assertEq(story.description, "A test story");
        assertEq(story.maxChapters, 5);
        assertEq(story.currentChapter, 0);
        assertFalse(story.isComplete);
    }

    function test_SubmitFirstChapter() public {
        // Create story first
        vm.prank(alice);
        string[] memory tags = new string[](0);
        uint256 storyId = platform.createStory("Test Story", "A test story", 5, tags);
        
        // Submit first chapter
        vm.prank(alice);
        vm.expectEmit(true, true, false, true);
        emit ChapterPublished(storyId, 1, 1, alice);
        
        uint256 chapterId = platform.submitFirstChapter(storyId, "Once upon a time...");
        
        assertEq(chapterId, 1);
        
        BerniceStoryPlatform.Chapter memory chapter = platform.getChapter(chapterId);
        assertEq(chapter.id, 1);
        assertEq(chapter.storyId, storyId);
        assertEq(chapter.chapterNumber, 1);
        assertEq(chapter.content, "Once upon a time...");
        assertEq(chapter.author, alice);
        assertEq(chapter.votes, 1); // Auto-vote
        assertTrue(chapter.isSelected);
        
        // Check story state updated
        BerniceStoryPlatform.Story memory story = platform.getStory(storyId);
        assertEq(story.currentChapter, 1);
        assertEq(story.totalVotes, 1);
    }

    function test_SubmitChapterContinuation() public {
        // Setup: Create story and first chapter
        vm.prank(alice);
        string[] memory tags = new string[](0);
        uint256 storyId = platform.createStory("Test Story", "A test story", 5, tags);
        platform.submitFirstChapter(storyId, "Once upon a time...");
        
        // Submit continuation
        vm.prank(bob);
        vm.expectEmit(true, true, false, true);
        emit SubmissionCreated(1, storyId, 2, bob);
        
        uint256 submissionId = platform.submitChapterContinuation(storyId, "The hero began their journey...");
        
        assertEq(submissionId, 1);
        
        BerniceStoryPlatform.Submission memory submission = platform.getSubmission(submissionId);
        assertEq(submission.id, 1);
        assertEq(submission.storyId, storyId);
        assertEq(submission.chapterNumber, 2);
        assertEq(submission.content, "The hero began their journey...");
        assertEq(submission.author, bob);
        assertEq(submission.votes, 0);
        assertFalse(submission.isWinner);
        
        // Check voting round started
        BerniceStoryPlatform.VotingRound memory round = platform.getVotingRound(storyId);
        assertTrue(round.isActive);
        assertEq(round.chapterNumber, 2);
    }

    function test_VoteForSubmission() public {
        // Setup: Create story, first chapter, and submission
        vm.prank(alice);
        string[] memory tags = new string[](0);
        uint256 storyId = platform.createStory("Test Story", "A test story", 5, tags);
        platform.submitFirstChapter(storyId, "Once upon a time...");
        
        vm.prank(bob);
        uint256 submissionId = platform.submitChapterContinuation(storyId, "The hero began their journey...");
        
        // Vote for submission
        vm.prank(charlie);
        vm.expectEmit(true, true, false, true);
        emit VoteCast(submissionId, charlie, storyId, 2);
        
        platform.voteForSubmission(submissionId);
        
        BerniceStoryPlatform.Submission memory submission = platform.getSubmission(submissionId);
        assertEq(submission.votes, 1);
        
        assertTrue(platform.hasUserVoted(submissionId, charlie));
    }

    function test_FinalizeVoting() public {
        // Setup: Create story, first chapter, submission, and vote
        vm.prank(alice);
        string[] memory tags = new string[](0);
        uint256 storyId = platform.createStory("Test Story", "A test story", 5, tags);
        platform.submitFirstChapter(storyId, "Once upon a time...");
        
        vm.prank(bob);
        uint256 submissionId = platform.submitChapterContinuation(storyId, "The hero began their journey...");
        
        vm.prank(charlie);
        platform.voteForSubmission(submissionId);
        
        // Fast forward past voting period
        vm.warp(block.timestamp + 4 days);
        
        // Finalize voting
        platform.finalizeVoting(storyId, 2);
        
        // Check results
        BerniceStoryPlatform.Submission memory submission = platform.getSubmission(submissionId);
        assertTrue(submission.isWinner);
        
        BerniceStoryPlatform.Story memory story = platform.getStory(storyId);
        assertEq(story.currentChapter, 2);
        assertEq(story.totalVotes, 2); // 1 from first chapter + 1 from voting
        
        BerniceStoryPlatform.VotingRound memory round = platform.getVotingRound(storyId);
        assertFalse(round.isActive);
        assertEq(round.winnerSubmissionId, submissionId);
    }

    function test_RevertOnlyCreatorCanSubmitFirstChapter() public {
        vm.prank(alice);
        string[] memory tags = new string[](0);
        uint256 storyId = platform.createStory("Test Story", "A test story", 5, tags);
        
        vm.prank(bob);
        vm.expectRevert("Only story creator can submit first chapter");
        platform.submitFirstChapter(storyId, "Once upon a time...");
    }

    function test_RevertDoubleVoting() public {
        // Setup
        vm.prank(alice);
        string[] memory tags = new string[](0);
        uint256 storyId = platform.createStory("Test Story", "A test story", 5, tags);
        platform.submitFirstChapter(storyId, "Once upon a time...");
        
        vm.prank(bob);
        uint256 submissionId = platform.submitChapterContinuation(storyId, "The hero began their journey...");
        
        // First vote should work
        vm.prank(charlie);
        platform.voteForSubmission(submissionId);
        
        // Second vote should revert
        vm.prank(charlie);
        vm.expectRevert("Already voted for this submission");
        platform.voteForSubmission(submissionId);
    }

    function test_StoryCompletion() public {
        // Create story with max 2 chapters
        vm.prank(alice);
        string[] memory tags = new string[](0);
        uint256 storyId = platform.createStory("Short Story", "A short story", 2, tags);
        platform.submitFirstChapter(storyId, "Chapter 1 content");
        
        // Submit and vote for second chapter
        vm.prank(bob);
        uint256 submissionId = platform.submitChapterContinuation(storyId, "Chapter 2 content");
        
        vm.prank(charlie);
        platform.voteForSubmission(submissionId);
        
        // Fast forward and finalize
        vm.warp(block.timestamp + 4 days);
        platform.finalizeVoting(storyId, 2);
        
        // Check story is complete
        BerniceStoryPlatform.Story memory story = platform.getStory(storyId);
        assertTrue(story.isComplete);
        assertEq(story.currentChapter, 2);
    }

    function test_GetUserStories() public {
        vm.startPrank(alice);
        string[] memory tags = new string[](0);
        
        uint256 story1 = platform.createStory("Story 1", "Description 1", 5, tags);
        uint256 story2 = platform.createStory("Story 2", "Description 2", 3, tags);
        
        vm.stopPrank();
        
        uint256[] memory userStories = platform.getUserStories(alice);
        assertEq(userStories.length, 2);
        assertEq(userStories[0], story1);
        assertEq(userStories[1], story2);
    }

    function test_GetAllStoryIds() public {
        vm.prank(alice);
        string[] memory tags = new string[](0);
        platform.createStory("Story 1", "Description 1", 5, tags);
        
        vm.prank(bob);
        platform.createStory("Story 2", "Description 2", 3, tags);
        
        uint256[] memory allStories = platform.getAllStoryIds();
        assertEq(allStories.length, 2);
        assertEq(allStories[0], 1);
        assertEq(allStories[1], 2);
    }
}
