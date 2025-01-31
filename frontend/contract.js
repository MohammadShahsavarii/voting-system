// 1. بررسی Web3 و اتصال به شبکه
if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
    window.web3 = new Web3(window.ethereum);
    console.log("Web3 is connected to MetaMask.");
} else {
    console.warn("No MetaMask detected, using local provider.");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
}

// 2. آدرس قراردادها
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const contractABIPath = '/abi/VotingSystem.json';
const tokenABIPath = '/abi/VotingToken.json';

// 3. تابع بارگذاری `ABI`
async function loadABI(filePath) {
    try {
        console.log(`Loading ABI from: ${filePath}`);
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ABI: ${filePath}`);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Invalid content type for ABI: ${contentType}`);
        }

        const data = await response.json();
        return data.abi;
    } catch (error) {
        console.error("Error loading ABI:", error);
        return null;
    }
}

// 4. مقداردهی قراردادها
async function initializeContracts() {
    const contractABI = await loadABI(contractABIPath);
    const tokenABI = await loadABI(tokenABIPath);

    if (!contractABI || !tokenABI) {
        console.error("Error: ABI files could not be loaded.");
        return;
    }

    window.tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
    window.votingContract = new web3.eth.Contract(contractABI, contractAddress);

    console.log("Contracts initialized successfully.");
    window.contractsInitialized = true;
}

const contractsReady = initializeContracts();

// 5. دریافت حساب‌های تستی از Hardhat
async function getAccounts() {
    const accounts = await web3.eth.getAccounts();
    console.log("Available Accounts:", accounts);
    return accounts;
}

// 6. دریافت موجودی توکن رأی‌دهنده
async function checkBalance() {
    if (!window.contractsInitialized) {
        console.error("Error: Contracts are not initialized yet.");
        return;
    }
    const accounts = await getAccounts();
    const balance = await window.tokenContract.methods.balanceOf(accounts[0]).call();
    console.log(`Voting Tokens: ${balance}`);
    return balance;
}

// 7. رأی‌گیری
async function vote(candidate) {
    if (!window.contractsInitialized) {
        console.error("Error: Contracts are not initialized yet.");
        return;
    }
    const accounts = await getAccounts();
    try {
        await window.votingContract.methods.vote(candidate).send({ from: accounts[0] });
        console.log(`You voted for ${candidate}!`);
    } catch (error) {
        console.error("Voting failed:", error);
    }
}

// 8. دریافت تعداد رأی‌های کاندیدا
async function getVotes(candidate) {
    if (!window.contractsInitialized) {
        console.error("Error: Contracts are not initialized yet.");
        return;
    }
    const votes = await window.votingContract.methods.getVotes(candidate).call();
    console.log(`${candidate} has ${votes} votes.`);
    return votes;
}

// 9. دریافت موجودی قرارداد
async function getContractBalance() {
    const balance = await web3.eth.getBalance(contractAddress);
    console.log(`Contract Balance: ${web3.utils.fromWei(balance, "ether")} ETH`);
    return balance;
}

// 10. ارسال کمک مالی
async function donateToContract(amount) {
    const accounts = await getAccounts();
    const amountInWei = web3.utils.toWei(amount, "ether");
    try {
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: contractAddress,
            value: amountInWei
        });
        console.log(`Donated ${amount} ETH to the contract.`);
    } catch (error) {
        console.error("Donation failed:", error);
    }
}

// 11. اضافه کردن توابع به `window`
window.vote = vote;
window.getVotes = getVotes;
window.getContractBalance = getContractBalance;
window.donateToContract = donateToContract;
window.checkBalance = checkBalance;