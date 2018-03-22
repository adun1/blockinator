//Soldier CONTRACT // 0x32088f303bc82999357223f044be804b4c86f826 // 2000000000000000000  500000000000000000
var contract_abidefinition = '[ { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]';
var contract_bytecode = '0x6060604052341561000f57600080fd5b60405160208061023083398101604052808051600160a060020a0333811616600090815260208181018281520190205550506101e0806100506000396000f30060606040526004361061004b5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166370a082318114610050578063a9059cbb1461008e575b600080fd5b341561005b57600080fd5b61007c73ffffffffffffffffffffffffffffffffffffffff600435166100c2565b60405190815260200160405180910390f35b341561009957600080fd5b6100c06004803573ffffffffffffffffffffffffffffffffffffffff1690602001356100d4565b005b60006020819052908152604090205481565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561012157600080fd5b73ffffffffffffffffffffffffffffffffffffffff8083161660008181526020808201828152908101808320549383529082905290205482011015151561016757600080fd5b73ffffffffffffffffffffffffffffffffffffffff3381168116600090815260208082018281529081018083208054869003905594831690921681529081905291909120805490910190555600a165627a7a72305820b12993a0b97556ab8b944a5d8352c83cccaf6c434f6c378e64541e2edba578cf0029';
var contract_address = '0xae0198d691c7b088f4e220b31bbbbf9cec5606ed';
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

function soldierBalance() {

    instance.balanceOf.call(accounts[0], function(error, result){
        document.getElementById("soldier_balance").innerHTML = result.c[0];

    });
}


