//  Receive accounts
async function getAccounts() {
    const accounts = await web3.eth.getAccounts();
    console.log("Available Accounts:", accounts);
    return accounts;
}

// Show account in UI
async function showAccount() {
    const accounts = await getAccounts();
    document.getElementById("walletInfo").innerText = `Connected: ${accounts[0]}`;
}

// Ensure `showAccount()` is executed after the page is fully loaded
window.onload = () => {
    setTimeout(showAccount, 1000);
};

// Voting function
async function vote(candidate) {
    const accounts = await getAccounts();
    try {
        await votingContract.methods.vote(candidate).send({ from: accounts[0] });
        console.log(`You voted for ${candidate}!`);
    } catch (error) {
        console.error("Voting failed:", error);
    }
}

//  `checkvotes()` function to get the number of votes for a candidate
async function checkVotes() {
    if (!window.votingContract) {
        console.error("Error: Voting contract is not initialized.");
        return;
    }

    const candidate = document.getElementById("checkCandidate").value.trim(); // Get candidate name from input
    if (!candidate) {
        console.error("Error: Candidate name is required.");
        alert("Please enter a candidate name.");
        return;
    }

    try {
        console.log(`Fetching votes for: ${candidate}`);
        const votes = await window.votingContract.methods.getVotes(candidate).call();
        console.log(`${candidate} has ${votes} votes.`);
        alert(`${candidate} has ${votes} votes.`);
    } catch (error) {
        console.error("Error fetching votes:", error);
    }
}

// Adding functions to `window`
window.showAccount = showAccount;
window.vote = vote;
window.checkVotes = checkVotes; 
