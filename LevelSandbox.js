/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key, function(err, value) {
                if (err) { 
                    console.log('Not found!', err);
                    reject(err);
                }
                // console.log('Value = ' + value);
                resolve(value);
            })
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {

            // Add your code here, remember in Promises you need to resolve() or reject() 

            // REMEMBER TO convert Object to JSON String before adding to LevelDB!
            const strValue = JSON.stringify(value);
            self.db.put(key, strValue, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
            });
            resolve(value);
        });
    }

    // Add data to LevelDB with generated key.
    async addDataToLevelDB(value) {
        // get the block height
        const height = await this.getBlocksCount().catch(err => -1);

        if(height < 0) {console.log("Cannot get block height"); return;}
        
        const result = await this.addLevelDBData(height, value);
        return result;
    }

    // Method that return the height
    getBlocksCount() {
        const self = this;
        let i = 0;

        return new Promise((resolve, reject) => {
            self.db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                console.log('Unable to read data stream!', err);
                reject(err);
            }).on('close', function() {
                console.log(`The next Block will be Block ${i}`);    
                resolve(i);
            });
        });
    }
        

}

module.exports = LevelSandbox;