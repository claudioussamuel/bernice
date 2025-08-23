// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {BerniceStoryPlatform} from "../contracts/BerniceStoryPlatform.sol";
import {BerniceRewards} from "../contracts/BerniceRewards.sol";

contract BerniceRewardsTest is Test {
    BerniceStoryPlatform public platform;
    BerniceRewards public rewards;
    
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public charlie = makeAddr("charlie");
    
    string constant BASE_URI = "https://api.bernice.app/metadata";
    
    event AchievementUnlocked(
        address indexed recipient,
        uint256 indexed tokenId,
        BerniceRewards.AchievementType indexed achievementType,
        uint256 storyId
    );

    function setUp() public {
        platform = new BerniceStoryPlatform();
        rewards = new BerniceRewards(address(platform), BASE_URI);
    }

    function test_AwardStoryCreator() public {
        vm.prank(address(platform));
        vm.expectEmit(true, true, true, true);
        emit AchievementUnlocked(alice, 1, BerniceRewards.AchievementType.STORY_CREATOR, 1);
        
        rewards.awardStoryCreator(alice, 1);
        
        // Check achievement was minted
        assertEq(rewards.ownerOf(1), alice);
        assertTrue(rewards.userHasAchievement(alice, BerniceRewards.AchievementType.STORY_CREATOR));
        
        BerniceRewards.Achievement memory achievement = rewards.getAchievement(1);
        assertEq(achievement.recipient, alice);
        assertEq(uint256(achievement.achievementType), uint256(BerniceRewards.AchievementType.STORY_CREATOR));
        assertEq(achievement.storyId, 1);
    }

    function test_AwardFirstChapterAuthor() public {
        vm.prank(address(platform));
        rewards.awardFirstChapterAuthor(alice, 1, 1);
        
        assertEq(rewards.ownerOf(1), alice);
        
        BerniceRewards.Achievement memory achievement = rewards.getAchievement(1);
        assertEq(uint256(achievement.achievementType), uint256(BerniceRewards.AchievementType.FIRST_CHAPTER_AUTHOR));
        assertEq(achievement.storyId, 1);
        assertEq(achievement.chapterId, 1);
    }

    function test_AwardWinningAuthor() public {
        vm.prank(address(platform));
        rewards.awardWinningAuthor(alice, 1, 2);
        
        assertEq(rewards.ownerOf(1), alice);
        
        // Check statistics updated
        (uint256 submissions,,,) = rewards.getUserStatistics(alice);
        assertEq(submissions, 1);
    }

    function test_ProlificWriterAchievement() public {
        vm.startPrank(address(platform));
        
        // Award 10 winning author achievements to trigger prolific writer
        for (uint256 i = 1; i <= 10; i++) {
            rewards.awardWinningAuthor(alice, i, 2);
        }
        
        vm.stopPrank();
        
        // Check alice has prolific writer achievement
        assertTrue(rewards.userHasAchievement(alice, BerniceRewards.AchievementType.PROLIFIC_WRITER));
        
        // Should have 11 NFTs total (10 winning + 1 prolific)
        uint256[] memory userAchievements = rewards.getUserAchievements(alice);
        assertEq(userAchievements.length, 11);
    }

    function test_CommunityFavoriteAchievement() public {
        vm.prank(address(platform));
        
        // Update vote statistics to trigger community favorite (100+ votes)
        rewards.updateVoteStatistics(bob, alice, 100);
        
        assertTrue(rewards.userHasAchievement(alice, BerniceRewards.AchievementType.COMMUNITY_FAVORITE));
        
        (,uint256 totalVotes,,) = rewards.getUserStatistics(alice);
        assertEq(totalVotes, 100);
    }

    function test_DedicatedVoterAchievement() public {
        vm.startPrank(address(platform));
        
        // Update voting statistics 50 times to trigger dedicated voter
        for (uint256 i = 1; i <= 50; i++) {
            rewards.updateVoteStatistics(alice, bob, 1);
        }
        
        vm.stopPrank();
        
        assertTrue(rewards.userHasAchievement(alice, BerniceRewards.AchievementType.DEDICATED_VOTER));
        
        (,,uint256 votingCount,) = rewards.getUserStatistics(alice);
        assertEq(votingCount, 50);
    }

    function test_AwardStoryCompleter() public {
        vm.prank(address(platform));
        rewards.awardStoryCompleter(alice, 1, 5);
        
        assertEq(rewards.ownerOf(1), alice);
        assertTrue(rewards.userHasAchievement(alice, BerniceRewards.AchievementType.STORY_COMPLETER));
    }

    function test_AwardStoryFinisher() public {
        vm.prank(address(platform));
        rewards.awardStoryFinisher(alice, 1);
        
        assertEq(rewards.ownerOf(1), alice);
        assertTrue(rewards.userHasAchievement(alice, BerniceRewards.AchievementType.STORY_FINISHER));
        
        (,,,uint256 storiesCompleted) = rewards.getUserStatistics(alice);
        assertEq(storiesCompleted, 1);
    }

    function test_GetUserAchievements() public {
        vm.startPrank(address(platform));
        
        rewards.awardStoryCreator(alice, 1);
        rewards.awardFirstChapterAuthor(alice, 1, 1);
        rewards.awardWinningAuthor(alice, 1, 2);
        
        vm.stopPrank();
        
        uint256[] memory userAchievements = rewards.getUserAchievements(alice);
        assertEq(userAchievements.length, 3);
        assertEq(userAchievements[0], 1); // Story Creator
        assertEq(userAchievements[1], 2); // First Chapter Author
        assertEq(userAchievements[2], 3); // Winning Author
    }

    function test_GetUserStatistics() public {
        vm.prank(address(platform));
        
        // Award some achievements and update statistics
        rewards.awardWinningAuthor(alice, 1, 2);
        rewards.awardWinningAuthor(alice, 2, 3);
        rewards.updateVoteStatistics(alice, bob, 5);
        rewards.updateVoteStatistics(alice, charlie, 3);
        rewards.awardStoryFinisher(alice, 1);
        
        (uint256 submissions, uint256 totalVotes, uint256 votingCount, uint256 storiesCompleted) = rewards.getUserStatistics(alice);
        
        assertEq(submissions, 2);
        assertEq(totalVotes, 0); // Alice is the voter, not the author receiving votes
        assertEq(votingCount, 2); // Alice voted twice
        assertEq(storiesCompleted, 1);
    }

    function test_NonTransferable() public {
        vm.prank(address(platform));
        rewards.awardStoryCreator(alice, 1);
        
        // Try to transfer - should revert
        vm.prank(alice);
        vm.expectRevert("Achievement NFTs are non-transferable");
        rewards.transferFrom(alice, bob, 1);
    }

    function test_OnlyPlatformCanAward() public {
        vm.prank(alice);
        vm.expectRevert("Only story platform can award");
        rewards.awardStoryCreator(alice, 1);
    }

    function test_PreventDuplicateAchievements() public {
        vm.startPrank(address(platform));
        
        rewards.awardStoryCreator(alice, 1);
        
        // Try to award same achievement again - should revert
        vm.expectRevert("Already has this achievement");
        rewards.awardStoryCreator(alice, 2);
        
        vm.stopPrank();
    }

    function test_TokenURI() public {
        vm.prank(address(platform));
        rewards.awardStoryCreator(alice, 1);
        
        string memory tokenURI = rewards.tokenURI(1);
        
        // Should contain base URI
        assertTrue(bytes(tokenURI).length > 0);
        // In a real test, you'd check the exact URI format
    }

    function test_SetBaseURI() public {
        string memory newBaseURI = "https://new-api.bernice.app/metadata";
        
        rewards.setBaseURI(newBaseURI);
        
        vm.prank(address(platform));
        rewards.awardStoryCreator(alice, 1);
        
        string memory tokenURI = rewards.tokenURI(1);
        assertTrue(bytes(tokenURI).length > 0);
    }

    function test_GetTotalAchievements() public {
        assertEq(rewards.getTotalAchievements(), 0);
        
        vm.startPrank(address(platform));
        rewards.awardStoryCreator(alice, 1);
        rewards.awardFirstChapterAuthor(bob, 1, 1);
        vm.stopPrank();
        
        assertEq(rewards.getTotalAchievements(), 2);
    }

    function test_SupportsInterface() public {
        // ERC721 interface
        assertTrue(rewards.supportsInterface(0x80ac58cd));
        // ERC721Metadata interface
        assertTrue(rewards.supportsInterface(0x5b5e139f));
    }
}
