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
        const height = await this.getBlockHeight();
        if(height < -1) {
            console.log("Cannot add block"); 
            return;
        }

        // If there is no block in the chain, generate a genesis block
        if(height == -1){
            this.addBlock(new Block("Genesis Block"));
        }
    }

    async addBlock(newBlock){
        // Get the block height
        const height = await this.getBlockHeight();
        if(height < -1) {
            console.log("Cannot add block"); 
            return;
        }

        // If this is not the genesis block, fetch the hash from the best block
        // Set it as the previous hash of this block
        if(height > -1){
            // Get the last block
            const lastBlock = await this.bd.getLevelDBData(height);

            const prevHash = JSON.parse(lastBlock).hash;
            newBlock.previousBlockHash = prevHash;
        }

        // Set other fields not related to previous block
        newBlock.height = height + 1;
        newBlock.timestamp = new Date().valueOf();
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        // Add to the DB
        const blockResponse =  await this.bd.addDataToLevelDB(newBlock).catch(err => {return null;});
        if(blockResponse){
            return blockResponse;
        }
        else{
            return null;
        }

    }

    // Get block height, it is a helper method that return the height of the blockchain
    async getBlockHeight() {
        // Add your code here
        const blockCount = await this.bd.getBlocksCount().catch(err => {
            console.log("Cannot get the block count");
            return -2;
        })

        return blockCount - 1;
    }

    /**
     * Get a block by height
     * @param {*} height The height of the block
     * @returns The block object if the height is valid. null if the height is invalid.
     */
    async getBlock(height) {
        // Add your code here
        const block = await this.bd.getLevelDBData(height).catch(err => {
            console.log("Cannot get the data of Block " + height);
            return null;
        })

        return JSON.parse(block);
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        // Add your code here
        const block = await this.getBlock(height);

        // If that block does not exist, return false
        if(!block) {return false;}

        const prevHash = block.hash;
        console.log(prevHash);
        console.log(block);
        block.hash = "";

        return SHA256(JSON.stringify(block)).toString() === prevHash;
           
    }

    // Validate Blockchain
    async validateChain() {
        const height = await this.getBlockHeight();

        let prevHash = "";
        let errorLog = [];
        for(let i=0; i<=height; i++){
            const block = await this.getBlock(i);

            //console.log(block);
            if(prevHash !== block.previousBlockHash){
                errorLog.push(`The prevHash of Block ${i} does not match`);
            }

            if(!await this.validateBlock(i)){
                errorLog.push(`Block ${i} is not valid`);
            }

            prevHash = block.hash;

        }

        return errorLog;
    }


    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, block).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
}

module.exports = Blockchain;