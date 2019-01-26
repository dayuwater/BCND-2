const Block = require('./Block');
const Blockchain = require('./Blockchain');
const LevelSandbox = require('./LevelSandbox');

// Test simple blockchain operations
const chain = new Blockchain();
chain.addBlock(new Block("1"));
chain.addBlock(new Block("3"));
chain.addBlock(new Block("5"));

console.log(chain);

// Test level DB
const bd = new LevelSandbox();

// This should return an error at the first time
// Return an result at later times
bd.getLevelDBData(6)
.then(value => console.log(value))
.catch(err => console.log(err));

// Get the block height
async function testBlockHeight(){
    const height = await bd.getBlocksCount().catch(err => {console.log(err); return 0;})
    console.log("The height at this time is: " + height);
}

testBlockHeight();

// Adding to the db
(function theLoop (i) {
    setTimeout(function () {
      bd.addDataToLevelDB('Testing data ' + i);
      if (--i) theLoop(i);
    }, 100);
})(10);




