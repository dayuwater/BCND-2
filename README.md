# RESTful Web API with Node.js Framework

A RESTful Web API using **Express.js** that operates a private Blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Node.js
- NPM (This should be installed already when you install Node.js)


### Installing

```
npm install
```


## Deployment

```
node index.js
```

The server will run on port 8000

## API Endpoints

All request body must be in JSON.
All response body is in JSON if your requested route is registered.


If your requested route does not match one of the following routes, you will get a 404 response with an HTML response.

1. **GET** /block/:height
- Request Parameters:
    - height: The height(index) of the block requested

- Request Body:
    - No Request body.


- Successful Response:

    This should be the content of the requested block in the blockchain

    Example:
    ```
    {
        "previousBlockHash": "80562927837af4e93ee5da35490557800740fb849602c45cb9ee54635374e6bb",
        "height": 1,
        "timestamp": 1549078579502,
        "body": "Test Block - 1",
        "hash": "9cbcef59b63227937d18b3d45bb3af18dd02b581f93efbf7e573f40da8b6d260"
    }
    ```

- Failed Responses:
    - If you provide a block index that does not exist:

    ```
    {
    "error": "That block does not exist"
    }
    ``` 
    with a 404 status code.

    - If your requested block height is invalid:
    ```
    {
    "error": "The block height must be a positive integer"
    }
    ```
    with a 403 status code.

2. **POST** /block
- Request Parameters:
    - No Request parameters

- Request body:
    - body: The text content of the new block to be added. This must not be an empty string

- Successful Response:

    This should be the content of the newly added block in the blockchain.

    Example:
    ```
    {
        "previousBlockHash": "47555406482a9af530bac65d41cec23a5b26ce59ef0b54540604b26ae9ea615e",
        "height": 26,
        "timestamp": 1555386494813,
        "body": "123",
        "hash": "a4802f467e9d6e566e8cdd1188d58189871940dbc809d9fc05d13f25005cfba2"
    }
    ```

- Failed Responses:
    - If your request body does not have a `body` field or that field is empty.

    ```
    {
    "error": "Your request body must have a 'body' field, and there must not be empty."
    }
    ``` 
    with a 403 status code.

    - If the block was failed to added to the blockchain, which is very unlikely
    ```
    {"error":"The block was not added successfully. Please try again later."}
    ```
    with a 503 status code.









