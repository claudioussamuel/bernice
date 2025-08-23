# Bernice Smart Contracts - Foundry Commands

# Install dependencies
install:
	forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Build contracts
build:
	forge build

# Run tests
test:
	forge test -vvv

# Run tests with gas reporting
test-gas:
	forge test --gas-report

# Run specific test
test-story:
	forge test --match-contract BerniceStoryPlatformTest -vvv

test-rewards:
	forge test --match-contract BerniceRewardsTest -vvv

# Format code
fmt:
	forge fmt

# Check formatting
fmt-check:
	forge fmt --check

# Generate coverage report
coverage:
	forge coverage

# Deploy to local network (anvil)
deploy-local:
	forge script script/Deploy.s.sol:DeployLocal --fork-url http://localhost:8545 --broadcast

# Deploy to Base Sepolia testnet
deploy-sepolia:
	forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast --verify

# Deploy to Base mainnet
deploy-mainnet:
	forge script script/Deploy.s.sol:DeployScript --rpc-url base_mainnet --broadcast --verify

# Verify contracts on Basescan
verify-sepolia:
	forge verify-contract <CONTRACT_ADDRESS> contracts/BerniceStoryPlatform.sol:BerniceStoryPlatform --chain base-sepolia

verify-mainnet:
	forge verify-contract <CONTRACT_ADDRESS> contracts/BerniceStoryPlatform.sol:BerniceStoryPlatform --chain base

# Start local blockchain
anvil:
	anvil

# Clean build artifacts
clean:
	forge clean

# Update dependencies
update:
	forge update

# Generate documentation
doc:
	forge doc

# Serve documentation
doc-serve:
	forge doc --serve --port 3001

# Run slither static analysis (requires slither installation)
analyze:
	slither contracts/

# Create .env file template
env:
	@echo "Creating .env template..."
	@echo "PRIVATE_KEY=your_private_key_here" > .env
	@echo "BASESCAN_API_KEY=your_basescan_api_key_here" >> .env
	@echo "RPC_URL_BASE_SEPOLIA=https://sepolia.base.org" >> .env
	@echo "RPC_URL_BASE_MAINNET=https://mainnet.base.org" >> .env
	@echo ".env file created. Please fill in your actual values."

# Help
help:
	@echo "Available commands:"
	@echo "  install         - Install OpenZeppelin dependencies"
	@echo "  build          - Build contracts"
	@echo "  test           - Run all tests"
	@echo "  test-gas       - Run tests with gas reporting"
	@echo "  test-story     - Run story platform tests only"
	@echo "  test-rewards   - Run rewards contract tests only"
	@echo "  fmt            - Format code"
	@echo "  fmt-check      - Check code formatting"
	@echo "  coverage       - Generate test coverage report"
	@echo "  deploy-local   - Deploy to local anvil network"
	@echo "  deploy-sepolia - Deploy to Base Sepolia testnet"
	@echo "  deploy-mainnet - Deploy to Base mainnet"
	@echo "  verify-sepolia - Verify contracts on Base Sepolia"
	@echo "  verify-mainnet - Verify contracts on Base mainnet"
	@echo "  anvil          - Start local blockchain"
	@echo "  clean          - Clean build artifacts"
	@echo "  update         - Update dependencies"
	@echo "  doc            - Generate documentation"
	@echo "  doc-serve      - Serve documentation on port 3001"
	@echo "  analyze        - Run static analysis with slither"
	@echo "  env            - Create .env template file"
	@echo "  help           - Show this help message"

.PHONY: install build test test-gas test-story test-rewards fmt fmt-check coverage deploy-local deploy-sepolia deploy-mainnet verify-sepolia verify-mainnet anvil clean update doc doc-serve analyze env help
