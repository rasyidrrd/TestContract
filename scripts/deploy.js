async function main() {
    const TestContract = await ethers.getContractFactory("TestContract");
 
    // Start deployment, returning a promise that resolves to a contract object
    const test = await TestContract.deploy("Tes Sepolia Team 3!");   
    console.log("Contract deployed to address:", test.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });