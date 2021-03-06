const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts, inbox;
const INITIAL_STRING = 'This is the initial message';
const NEW_STRING = 'A new string';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [INITIAL_STRING] })
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.getMessage().call();
    assert.equal(message, INITIAL_STRING);
  });

  it('can set a different message', async () => {
    await inbox.methods.setMessage(NEW_STRING)
      .send({ from: accounts[0] });
    const message = await inbox.methods.getMessage().call();
    assert.equal(message, NEW_STRING);
  });
});