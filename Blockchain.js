const Block = require('./Block');
const LevelSandbox = require('./LevelSandbox');
const SHA256 = require('crypto-js/sha256');

class Blockchain{
    constructor(){
        this.bd = new LevelSandbox();
        this.generateGenesisBlock();
    }

    async generateGenesisBlock(){
        // Get the block height
        const height = await this.bd.getBlocksCount().catch(err => {console.log(err); return -1;});
        if(height < 0) {
            console.log("Cannot add block"); 
            return;
        }

        // If there is no block in the chain, generate a genesis block
        if(height == 0){
            this.addBlock(new Block("Genesis Block"));
        }
    }

    async addBlock(newBlock){
        // Get the block height
        const height = await this.bd.getBlocksCount().catch(err => {console.log(err); return -1;});
        if(height < 0) {
            console.log("Cannot add block"); 
            return;
        }

        // If this is not the genesis block, fetch the hash from the best block
        // Set it as the previous hash of this block
        if(height > 0){
            // Get the last block
            const lastBlock = await this.bd.getLevelDBData(height - 1);

            const prevHash = JSON.parse(lastBlock).hash;
            newBlock.previousBlockHash = prevHash;
        }

        // Set other fields not related to previous block
        newBlock.height = height;
        newBlock.timestamp = new Date().valueOf();
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        // Add to the DB
        this.bd.addDataToLevelDB(newBlock)
        .then(res => {
            console.log(res);
            console.log("The block is added successfully")
        }).catch(err => {
            console.log(err);
            console.log("Failed to add the block");
        });

    }
}

module.exports = Blockchain;