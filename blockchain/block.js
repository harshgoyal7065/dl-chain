const ChainUtil = require('../chain-util');
const {DIFFICULTY, MINE_RATE} = require("../config");

class Block{
    constructor(timestamp, lastHash, ownHash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.ownHash = ownHash;
        this.data = data;
        this.nonce =  nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block - 
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lastHash.substring(0,10)}
        Own Hash: ${this.ownHash.substring(0,10)}
        Data: ${this.data}
        Nonce: ${this.nonce}
        Difficulty: ${this.difficulty}
        `
    }

    static genesis(){   //Static keyword ensures that we dont have to make an object of the class to call this function.
        return new this("Gensis Time", "last-hash", "first-hash",[], 0, DIFFICULTY)
    }

    static mineBlock(lastBlock, data){
        let ownHash, timestamp;
        const lastHash = lastBlock.ownHash;
        let nonce = 0;
        let difficulty = lastBlock.difficulty;
        do{
            nonce++;
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            ownHash = Block.ownHashGenerator(timestamp, lastHash, data, nonce, difficulty);
        }while(ownHash.substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this(timestamp, lastHash, ownHash, data, nonce, difficulty)
        
    }

    static ownHashGenerator(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
      }
      

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
      return Block.ownHashGenerator(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime){
        let {difficulty} =lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty -1
        return difficulty;
    }
}

module.exports = Block;