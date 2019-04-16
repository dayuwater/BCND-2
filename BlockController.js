// This is the server code using Express.js
// It only responds to routes, and requests corresponding methods in Blockchain.js
// There should be no direct data access code in this file

const SHA256 = require('crypto-js/sha256');
const Blockchain = require('./Blockchain.js');
const Block = require('./Block');

// Constants used for error handing
const NOT_INTEGER = {"error": "The block height must be a positive integer"};
const NOT_FOUND = {"error": "That block does not exist"};
const NOT_VALID_REQUEST = {"error": "Your request body must have a 'body' field, and there must not be empty."};
const ADD_FAILED = {"error":"The block was not added successfully. Please try again later."}

class BlockController{
    /**
     * Constructor to create a new BlockController. All end points are initialized.
     * @param {*} app 
     */
    constructor(app){
        // Initialize Express.js
        this.app = app;

        // Initalize the blockchain at the construction stage of this controller
        // The process of genesis block creation is already implemented in this class
        this.chain = new Blockchain();

        // Register routes related to this class
        this.test();

    }

    
    test(){
        this.app.get("/block/:height", async (req, res) => {
            const height = +req.params.height;

            // If the height is not a number, negative number, or not integer
            if(height < 0 || height % 1 !== 0){
                res.status(403);
                res.json(NOT_INTEGER);
            }
            else{
                const block = await this.chain.getBlock(height);
                // If that block is found
                if(block)
                    res.json(block);

                // If that block cannot be found
                else{
                    res.status(404);
                    res.json(NOT_FOUND);
                }

            }
        })

        this.app.post("/block", async (req, response) => {
            const text = req.body.body;

            if(!text){
                response.status(403);
                response.json(NOT_VALID_REQUEST);
            }

            // Add the block to the chain
            const block = new Block(text);
            const blockResponse = await this.chain.addBlock(block);
            console.log(blockResponse);
            if(blockResponse){
                response.json(blockResponse);
            }
            else{
                response.status(503);
                response.json(ADD_FAILED);
            }
            

        })

    }
}

/**
 * Exporting the BlockController class
 * Curry function so that whatever module using this class can pass the app object into this class
 * Which means that index.js can correctly initialize Express.js
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}