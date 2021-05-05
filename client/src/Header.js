import React from 'react';
import Dropdown from './Dropdown.js';

function Header ({
    user,  //user object
    tokens, // a list of tokens the we can exchange
    contracts,  // web3 contract instence of the dex, gas20 tokens
    selectToken // selected token, function will be called
}) {
    return (
        <header id='header' className='card'>
            <div className='row'>
                <div className= 'col-sm-3 flex'>
                    <Dropdown 
                        items={tokens.map(token => ({
                        label: token.ticker,
                        value: token
                    }))}
                    activeItems={{
                        label: user.selectedToken.ticker,
                        value: token
                    }}
                    onSelect={selectToken}
                    />
                </div>
                <div className='col-sm-9'>
                    <h1 className='header-title'>
                    Dex - <span className='contract-address'>Contract Address:<span className='address'>
                        {contracts.dex.options.address}</span></span>
                    </h1>
                </div>
            </div>
        </header>
    )
}
