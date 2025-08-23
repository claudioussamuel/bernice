// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {BerniceStoryPlatform} from "../contracts/BerniceStoryPlatform.sol";
import {BerniceRewards} from "../contracts/BerniceRewards.sol";

contract DeployScript is Script {
    BerniceStoryPlatform public storyPlatform;
    BerniceRewards public rewards;
    
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts...");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy main story platform contract
        console.log("Deploying BerniceStoryPlatform...");
        storyPlatform = new BerniceStoryPlatform();
        console.log("BerniceStoryPlatform deployed at:", address(storyPlatform));

        // Deploy rewards contract
        console.log("Deploying BerniceRewards...");
        string memory baseURI = "https://api.bernice.app/metadata";
        rewards = new BerniceRewards(address(storyPlatform), baseURI);
        console.log("BerniceRewards deployed at:", address(rewards));

        vm.stopBroadcast();

        // Verify deployment
        console.log("Verifying deployment...");
        console.log("Story Platform Total Stories:", storyPlatform.getTotalStories());
        console.log("Rewards Total Achievements:", rewards.getTotalAchievements());
        
        console.log("=== DEPLOYMENT SUMMARY ===");
        console.log("Network:", block.chainid);
        console.log("BerniceStoryPlatform:", address(storyPlatform));
        console.log("BerniceRewards:", address(rewards));
        console.log("Deployer:", deployer);
        console.log("========================");
    }
}

contract DeployLocal is Script {
    function run() public {
        vm.startBroadcast();

        console.log("Deploying to local network...");
        
        // Deploy main story platform contract
        BerniceStoryPlatform storyPlatform = new BerniceStoryPlatform();
        console.log("BerniceStoryPlatform deployed at:", address(storyPlatform));

        // Deploy rewards contract
        string memory baseURI = "https://api.bernice.app/metadata";
        BerniceRewards rewards = new BerniceRewards(address(storyPlatform), baseURI);
        console.log("BerniceRewards deployed at:", address(rewards));

        vm.stopBroadcast();
    }
}
