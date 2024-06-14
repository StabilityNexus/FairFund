export const fairFund:FairFund = {
    address:"0x66b04c2d28042dc8efa9e512de8145374b930f37",
    abi:[
        {
            "type": "function",
            "name": "deployFundingVault",
            "inputs": [
                {
                    "name": "_fundingToken",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_votingToken",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_minRequestableAmount",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_maxRequestableAmount",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_tallyDate",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_owner",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "getFundingVault",
            "inputs": [
                {
                    "name": "_fundingVaultId",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getTotalNumberOfFundingVaults",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "event",
            "name": "FundingVaultDeployed",
            "inputs": [
                {
                    "name": "fundingVault",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "FairFund__CannotBeAZeroAddress",
            "inputs": []
        },
        {
            "type": "error",
            "name": "FairFund__MaxRequestableAmountCannotBeZero",
            "inputs": []
        },
        {
            "type": "error",
            "name": "FairFund__MinRequestableAmountCannotBeGreaterThanMaxRequestableAmount",
            "inputs": []
        },
        {
            "type": "error",
            "name": "FairFund__TallyDateCannotBeInThePast",
            "inputs": []
        }
    ]
}