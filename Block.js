class Block{
    constructor(data){
        this.previousBlockHash = "";
        this.height = 0;
        this.timestamp = "";
        this.body = data;
        this.hash = ""
    }
}

module.exports = Block;
