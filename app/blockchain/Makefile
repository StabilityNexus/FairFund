RPC_URL := 127.0.0.1:8545
VERBOSITY := -vvvv
BROADCAST := --broadcast
LEGACY := --legacy

FORGE_SCRIPT := forge script


deploy-mock-fair-fund:
	$(FORGE_SCRIPT) script/mocks/DeployMockFairFund.s.sol:DeployMockFairFund --rpc-url $(RPC_URL) $(VERBOSITY) $(BROADCAST) $(LEGACY)

deploy-mock-erc20:
	$(FORGE_SCRIPT) script/mocks/DeployMockERC20.s.sol:DeployMockERC20 --rpc-url $(RPC_URL) $(VERBOSITY) $(BROADCAST) $(LEGACY)

deploy-fair-fund:
	$(FORGE_SCRIPT) script/DeployFairFund.s.sol:DeployFairFund --rpc-url $(RPC_URL) $(VERBOSITY) $(BROADCAST) $(LEGACY)

dmf: deploy-mock-fair-fund
dme: deploy-mock-erc20
df: deploy-fair-fund


mock-all: deploy-mock-fair-fund deploy-mock-erc20

help:
	@echo "Available targets:"
	@echo "  deploy-mock-fair-fund (dmf)  : Deploy FairFund contract"
	@echo "  deploy-mock-erc20 (dme)      : Deploy MockERC20 contract"
	@echo "  deploy-fair-fund (df)        : Deploy FairFund contract to sepolie"
	@echo "  mock-all                     : Deploy both contracts"
	@echo "  help                         : Show this help message"

.PHONY: deploy-mock-fair-fund deploy-mock-erc20 deploy-fair-fund dmf dme df all help