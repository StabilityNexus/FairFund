RPC_URL := 127.0.0.1:8545
VERBOSITY := -vvvv
BROADCAST := --broadcast
LEGACY := --legacy

FORGE_SCRIPT := forge script


deploy-mock-fair-fund:
	$(FORGE_SCRIPT) script/mocks/DeployMockFairFund.s.sol:DeployMockFairFund --rpc-url $(RPC_URL) $(VERBOSITY) $(BROADCAST) $(LEGACY)

deploy-mock-erc20:
	$(FORGE_SCRIPT) script/mocks/DeployMockERC20.s.sol:DeployMockERC20 --rpc-url $(RPC_URL) $(VERBOSITY) $(BROADCAST) $(LEGACY)


dmf: deploy-mock-fair-fund
dme: deploy-mock-erc20


all: deploy-mock-fair-fund deploy-mock-erc20

help:
	@echo "Available targets:"
	@echo "  deploy-fair-fund (dmf)  : Deploy FairFund contract"
	@echo "  deploy-mock-erc20 (dme) : Deploy MockERC20 contract"
	@echo "  all                    : Deploy both contracts"
	@echo "  help                   : Show this help message"

.PHONY: deploy-mock-fair-fund deploy-mock-erc20 dmf dme all help