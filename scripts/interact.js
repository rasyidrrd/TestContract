const API_URL = process.env.API_URL; // Replace with your Sepolia Ethereum network API URL
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Replace with your private key
const CONTRACT_ADDRESS = "0xBc9879b334aDa10C9E86C55039d3AEc52a52a9C0"; // Replace with your actual contract address
const RECIPIENT_ADDRESS = "0x5269F10164cC6b9FE01321851625710394219d65"; // Replace with the actual recipient address
const ethers = require('ethers');

// ABI for your smart contract
const contractAbi = [
  {"inputs":[{"internalType":"string","name":"initMessage","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"oldStr","type":"string"},{"indexed":false,"internalType":"string","name":"newStr","type":"string"}],"name":"UpdatedMessages","type":"event"},
  {"inputs":[],"name":"message","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"newMessage","type":"string"}],"name":"update","outputs":[],"stateMutability":"nonpayable","type":"function"},
  // Placeholder for the transferFunds function (modify according to your contract)
  {"inputs":[{"internalType":"address payable","name":"recipient","type":"address"}],"name":"transferFunds","outputs":[],"stateMutability":"payable","type":"function"}
];

// Sepolia provider
const sepoliaProvider = new ethers.providers.JsonRpcProvider(API_URL);

// Signer (you)
const signer = new ethers.Wallet(PRIVATE_KEY, sepoliaProvider);

// Contract instance
const testContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

async function main() {
    try {
        // Get the current message from the smart contract
        const currentMessage = await testContract.message();
        console.log("Current message:", currentMessage);

        // Update the message in the smart contract
        console.log("Updating the message...");
        const updateTx = await testContract.update("This is the new message.");
        await updateTx.wait();

        // Transfer funds to the contract
        console.log("Transferring funds to the contract...");
        const transferToContractTx = await signer.sendTransaction({
            to: CONTRACT_ADDRESS,
            value: ethers.utils.parseEther("0.1"), // Replace with the amount you want to transfer to the contract
            gasLimit: 50000, // Set a reasonable gas limit
            gasPrice: ethers.utils.parseUnits("150", "gwei"),
        });
        await transferToContractTx.wait();

        // Call the transferFunds function to send funds from the contract to the recipient
        console.log("Transferring funds from the contract to the recipient...");
        const transferFundsTx = await testContract.transferFunds(RECIPIENT_ADDRESS, {
            value: ethers.utils.parseEther("0.1"), // Replace with the amount you want to transfer
            gasLimit: 50000, // Set a reasonable gas limit
            gasPrice: ethers.utils.parseUnits("150", "gwei"),
        });
        await transferFundsTx.wait();

        // Get the updated message from the smart contract
        const updatedMessage = await testContract.message();
        console.log("Updated message:", updatedMessage);

    } catch (error) {
        console.error("Error:", error);
    }
}

main();