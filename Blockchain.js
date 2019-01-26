const Block = require('./Block')
const SHA256 = require('crypto-js/sha256')

class Blockchain{
    constructor(){
        this.chain = [];

        // Add the genesis block to the chain
        this.addBlock(new Block("Genesis Block"));
    }

    addBlock(newBlock){

        // If this is not the genesis block, fetch the hash from the best block
        // Set it as the previous hash of this block
        if(this.chain.length > 0){
            const prevHash = this.chain[this.chain.length - 1].hash;
            newBlock.previousBlockHash = prevHash;
        }

        // Set other fields not related to previous block
        newBlock.height = this.chain.length;
        newBlock.timestamp = new Date().valueOf();
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        this.chain.push(newBlock);

    }
}

module.exports = Blockchain;