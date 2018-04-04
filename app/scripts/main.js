//Soldier CONTRACT // 0x32088f303bc82999357223f044be804b4c86f826 // 2000000000000000000  500000000000000000
var contract_abidefinition = '[ { "constant": false, "inputs": [ { "name": "_to", "type": "address" } ], "name": "fight", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]';
var contract_bytecode = '0x6060604052341561000f57600080fd5b6040516020806107c083398101604052808051906020019091905050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550506107428061007e6000396000f300606060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063644b375e1461005c57806370a0823114610095578063a9059cbb146100e2575b600080fd5b341561006757600080fd5b610093600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610124565b005b34156100a057600080fd5b6100cc600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610588565b6040518082815260200191505060405180910390f35b34156100ed57600080fd5b610122600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506105a0565b005b6000808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054111561027b576000808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555060008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610585565b6000808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156103d2576000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610584565b6000808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156105835760026000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548115156104a057fe5b046000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555060026000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205481151561053657fe5b046000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b5b5b50565b60006020528060005260406000206000915090505481565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156105ed57600080fd5b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011015151561067a57600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050505600a165627a7a723058204720c0c7ba03243a369ecc9eb9b32db9ec9442e475a820f2036dce2192e908f80029';
var contract_address = '0x7c138b218fe2f2f80c6262b709e1a8683624e259';
//Soldier CONTRACT

var autoRetrieveFlag = true;

// Holds the accounts
var accounts;

// Contract instance
var instance;

window.addEventListener('load', function() {

  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  }

  startApp()

})


function    startApp(){

    if (web3 && web3.isConnected()) {
        if(autoRetrieveFlag) doGetAccounts();
    } 

    document.getElementById ("soldierTransfer").addEventListener ("click", soldierTransfer, false);
    document.getElementById ("soldierFight").addEventListener ("click", soldierFight, false);

    instance = createContractInstance();

}


function    doGetAccounts() {
   
    web3.eth.getAccounts(function (error, result) {

        accounts = result;
        
        document.getElementById("address").innerHTML = result[0];
        // Retrieving Balance
        web3.eth.getBalance(accounts[0],web3.eth.defaultBlock,function(error,result){
            // Convert the balance to ethers
            var bal = web3.fromWei(result,'ether').toFixed(2);
            document.getElementById("balance").innerHTML = bal;

        });

        //Update Army Size in html
        soldierBalance();
    });
   
}


function  createContractInstance(addr){
    var     abiDefinitionString = contract_abidefinition;
    var     abiDefinition = JSON.parse(abiDefinitionString);


    var    contract = web3.eth.contract(abiDefinition);

    var    address = contract_address;
    
   
    var    instance = contract.at(address);

    return instance;
}


function    soldierTransfer()   {

    document.getElementById('rightImg').innerHTML = '';
    document.getElementById('rightImg').innerHTML = '<img src="transferImg.png">';

    var estimatedGas = 4700000;
    var parameterValue1 = document.getElementById('addr_to').value;
    var parameterValue2 = document.getElementById('sol_number').value;    


    var    txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    // Transfer: solidity contract soldier transfer function
    instance.transfer.sendTransaction(parameterValue1, parameterValue2,txnObject,function(error, result)  {

        if(error){
            setExecuteResultUI('Send Transaction:   ','',error,'',true);
        } else {
            setExecuteResultUI('Send Transaction:   ',parameterValue1,result,result,false);
        }
        
        //Update Army Size in html
        soldierBalance();

    });
}

function    soldierFight()   {
    document.getElementById('rightImg').innerHTML = '';
    document.getElementById('rightImg').innerHTML = '<img src="fightImg.png">';

    

    var estimatedGas = 4700000;
    var parameterValue1 = document.getElementById('addr_to').value;


    var    txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    // Fight: solidity contract soldier fight function
    instance.fight.sendTransaction(parameterValue1,txnObject,function(error, result)  {

        if(error){
            setExecuteResultUI('Send Transaction:   ','',error,'',true);
        } else {
            setExecuteResultUI('Send Transaction:   ',parameterValue1,result,result,false);
        }
        
        //Update Army Size in html
        soldierBalance();

    });


}

function soldierBalance() {

    instance.balanceOf.call(accounts[0], function(error, result){
        document.getElementById("soldier_balance").innerHTML = result.c[0];

    });
}


