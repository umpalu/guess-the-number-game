const contractAddress = "0xfE216b0Ae1593908F779b3b344E5BeFF17bFfEAE";
const contractABI = [
    "function startGame(uint256 _secretNumber) external payable",
    "function guessNumber(uint256 _guess) external",
    "function gameActive() external view returns (bool)",
    "event NumberGuessed(address player, uint256 guessedNumber, bool correct)"
];

let contract;
let signer;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log('Wallet connected');
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    } else {
        console.error('MetaMask is not installed');
    }
}

async function startGame() {
    const secretNumber = document.getElementById('secret-number').value;
    const reward = document.getElementById('reward').value;
    
    try {
        const tx = await contract.startGame(secretNumber, { value: ethers.utils.parseEther(reward) });
        await tx.wait();
        document.getElementById('game-status').innerText = 'Game started!';
    } catch (error) {
        console.error('Error starting game:', error);
        document.getElementById('game-status').innerText = 'Failed to start game';
    }
}

async function submitGuess() {
    const guess = document.getElementById('guess').value;
    
    try {
        const tx = await contract.guessNumber(guess);
        await tx.wait();
        document.getElementById('game-status').innerText = 'Guess submitted!';
    } catch (error) {
        console.error('Error submitting guess:', error);
        document.getElementById('game-status').innerText = 'Failed to submit guess';
    }
}

window.addEventListener('load', async () => {
    await connectWallet();
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('submit-guess').addEventListener('click', submitGuess);
});
