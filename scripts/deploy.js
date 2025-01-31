const hre = require("hardhat");

    async function main() {
        const [deployer] = await hre.ethers.getSigners();
    
        console.log("Deploying contracts with the account:", deployer.address);
    
        // Voting token deployment
        const VotingToken = await hre.ethers.getContractFactory("VotingToken");
        const votingToken = await VotingToken.deploy(1000);  // ایجاد ۱۰۰۰ توکن اولیه
        await votingToken.waitForDeployment();  
    
        console.log("VotingToken deployed to:", await votingToken.getAddress());
    
        // Deploy the voting contract by sending an initial 1 ETH
        const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
        const votingSystem = await VotingSystem.deploy(await votingToken.getAddress(), {
            value: hre.ethers.parseEther("1.0")
        });
        await votingSystem.waitForDeployment();  
    
        console.log("VotingSystem deployed to:", await votingSystem.getAddress());
    
        // Displaying contract balance after deployment
        const contractBalance = await hre.ethers.provider.getBalance(await votingSystem.getAddress());
        console.log("Initial contract balance:", hre.ethers.formatEther(contractBalance), "ETH");
    }
    
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
    