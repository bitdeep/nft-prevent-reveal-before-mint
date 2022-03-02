const textToImage = require('text-to-image');
let minted = 0;
const express = require('express')
const app = express()
const port = 3000

const contract = '0x4362fc2773bD3dAC4BBA0e5006f69b6FAB800842'
const Web3 = require('web3');
const web3 = new Web3("https://rpc.ftm.tools");
const jsonInterface = [{
    "inputs": [],
    "name": "minted",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"}];
const ctx = new web3.eth.Contract(jsonInterface, contract);

async function main(){
    minted = await ctx.methods.minted().call();
    console.log('minted', minted);
}

async function setMinted(){
    await main();
}

app.get('/', (req, res) => {
    let lines = ['<h1>Images '+minted+'</h1>'];
    for( let i = 1 ; i <= minted ; i ++ ) {
        const img = noimg(i.toString());
        lines.push( '<img src="'+img+'" />' );
    }

    res.send( lines.join('<br/>') );

})

app.get('/nft/:id', (req, res) => {
    const id = req.params.id;
    if( id > minted ){
        res.send('<img src="'+noimg('!')+'" />');
    }else{
        res.send('<img src="'+noimg(id)+'" />');
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    setMinted();
    setInterval(setMinted, 10000);
})

// main();
function noimg(str){
    return textToImage.generateSync(str, {
        debug: true,
        maxWidth: 120,
        fontSize: 120,
        fontFamily: 'Arial',
        lineHeight: 30,
        margin: 5,
        bgColor: 'blue',
        textColor: 'red',
    });
}
