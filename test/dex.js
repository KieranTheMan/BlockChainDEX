const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const Dai = artifacts.require('mocks/Dai.sol');
const Bat = artifacts.require('mocks/Bat.sol');
const Rep = artifacts.require('mocks/Rep.sol');
const Zrx = artifacts.require('mocks/Zrx.sol');
const Dex = artifacts.require('Dex.sol');

const SIDE = {
    BUY: 0,
    SELL: 1
};

contract('Dex', (accounts) => {
    let dai, bat, rep, zrx, dex;
    const [trader1, trader2] = [accounts[1], accounts[2]];// extract addresses from Dex
    const [DAI, BAT, REP, ZRX] = ['DAI','BAT','REP','ZRX'].map(ticker => web3.utils.fromAscii('ticker'));

    beforeEach(async() => {
            ([dai, bat, rep, zrx] = await Promise.all([
                Dai.new(),
                Bat.new(),
                Rep.new(),
                Zrx.new()
            ]));
            dex = await Dex.new();
            await Promise.all([
                dex.addToken(DAI, dai.address),
                dex.addToken(BAT, bat.address),
                dex.addToken(REP, rep.address),
                dex.addToken(ZRX, zrx.address),
            ]);

            //allocate initial token balance
            const amount = web3.utils.toWei('1000');// 1 = 10 ^ 18 cents of token//convert ether to Wei
            //fhelper unction to allocate ECS20 token
            const seedTokenBalance = async (token, trader) => {
                        await token.faucet(trader, amount);//allocate token to a address
                        await token.approve(
                        dex.address,
                        amount,
                        {from: trader}
                        );
            };

                await Promise.all(
                [dai, bat, rep, zrx].map(token => seedTokenBalance(token, trader1)));
                await Promise.all(
                [dai, bat, rep, zrx].map(token => seedTokenBalance(token, trader2)));
    });
//happy path
            it('should deposit tokens', async () => {
            const amount = web3.utils.toWei('100');
                await dex.deposit(
                amount,
                DAI,
                {from: trader1}
                );
                const balance = await dex.traderBalances(trader1, DAI);
                assert(balance.toString() === amount);
            });

//unhappy path
            it('Should NOT deposit token if token does not exist', async () => {
    //expectRevert is to test if an error was thrown
                await expectRevert(
                    dex.deposit(
                    web3.utils.toWei('100'),
                    web3.utils.fromAscii('TOKEN-DOES-NOT-EXIST'),
                    {from: trader1}
                    ),
                    'this token does not exist'
                );
            });
                //happy path
            it('should have withdraw tokens', async () => {
                const amount = web3.utils.toWei('100');
                await dex.deposit(
                    amount,
                    DAI,
                    {from: trader1}
                );

                await dex.withdraw(
                    amount,
                    DAI,
                    {from: trader1}
                );

                const [balanceDex, balanceDai] = await Promise.all([
                    dex.traderBalances(trader1, DAI),
                    dai.balanceOf(trader1)
                ]);

                assert(balanceDex.isZero());
                assert(balanceDai.toString() === web3.utils.toWei('1000'));
            });

            it('should NOT withdraw tokens if balance is too low', async () => {
                await dex.deposit(
                    web3.utils.toWei('100'),
                    DAI,
                    {from: trader1}
                );

                await expectRevert(
                    dex.withdraw(
                        web3.utils.toWei('1000'),
                        DAI,
                        {from: trader1}
                    ),
                    'balance too low'
                );
            });
                //Happy Pasth
            it('should create limit order', async () => {
                await dex.deposit(
                    web3.utils.toWei('120'),
                    DAI,
                    {from: trader1}
                );

                await dex.createLimitOrder(
                    REP,
                    web3.utils.toWei('10'),
                    10,
                    SIDE.BUY,
                    {from: trader1}
                );

                const buyOrders = await dex.getOrders(REP, SIDE.BUY);
                const sellOrders = await dex.getOrders(REP, SIDE.SELL);

                assert(buyOrders.length === 1);
                assert(buyOrders[0].trader === trader1);
                assert(buyOrders[0].ticker === web3.utils.padRight(REP, 64));// add numbers to REP
                assert(buyorders[0].price === '10');
                assert(buyOrders[0].amount === web3.utils.toWei('10'));
                assert(sellOrders.length === 0);
            });        
                 
});