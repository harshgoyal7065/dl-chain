//For testing -> Jest looks for test.js extension

const Block = require("./block")
const {DIFFICULTY} = require("../config");

describe('Block', () => {
    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar',
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    })
    it('sets the `data` to match the input',() =>{
        expect(block.data).toEqual(data);
    } )
    it('sets the `lastHash` to match the hash of last block',() =>{
        expect(block.lastHash).toEqual(lastBlock.ownHash);
    })
    it('generates the `hash` that matches the difficulty', () => {
        expect(block.ownHash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty))
    })
    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+360000)).toEqual(block.difficulty-1);
      });
    it('raises the difficulty for quickly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1);
      });
      
      
})