const Dai = artifacts.require('mocks/Dai.sol');
const Bat = artifacts.require('mocks/Bat.sol');
const Rep = artifacts.require('mocks/Rep.sol');
const Zrx = artifacts.require('mocks/Zrx.sol');
const Dex = artifacts.require('Dex.sol');

contract('Dex', (accounts)=> {
    let dai, bat, rep, zrx;
    const [trader1, trader2] = [accounts[1], accounts[2]];

    const [DAI, BAT, REP, ZRX] = ['DAI','BAT','REP','ZRX',].map(ticker => web3.utils.fromAscii('ticker'));

    beforeEach(async() => {
        ([dai, bat, rep, zrx] = await Promise.all([
            Dai.new(),
            Bat.new(),
            Rep.new(),
            Zrx.new()
        ]));
        const dex = await Dex.new();
        await Promise.all([
            dex.addToken(DAI, dai.address),
            dex.addToken(BAT, bat.address),
            dex.addToken(RAP, rep.address),
            dex.addToken(ZRX, zrx.address),
        ]);

        //allocate initial token balance
        const amount = web3.utils.toWei('1000');//
        //function to allocate ECS20 token
        const seedTokenBalance = async (token, trader) => {
            await token.faucet(transfer, amount);//allocate token to a address
            await token.approve(
                dex.address,
                amount,
                {from: trader}
            );
        };

        await Promise.all(
            [dai, bat, rep, zrx].map(token => seedTokenBalance(token, trader1))
        );
        await Promise.all(
            [dai, bat, rep, zrx].map(token => seedTokenBalance(token, trader2))
        );
    });
});