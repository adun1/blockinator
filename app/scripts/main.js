//Soldier CONTRACT // 0x32088f303bc82999357223f044be804b4c86f826 // 2000000000000000000  500000000000000000
var contract_abidefinition = '[ { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]';
var contract_bytecode = '0x6060604052341561000f57600080fd5b60405160208061031883398101604052808051906020019091905050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505061029a8061007e6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806370a0823114610051578063a9059cbb1461009e575b600080fd5b341561005c57600080fd5b610088600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100e0565b6040518082815260200191505060405180910390f35b34156100a957600080fd5b6100de600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506100f8565b005b60006020528060005260406000206000915090505481565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561014557600080fd5b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401101515156101d257600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050505600a165627a7a72305820ae2edda7c4e4e0333a69bff81f3e9801841c494b9f01b440b65f80e8dfe768ec0029';
var contract_address = '0xcb29ce07d44c575b651dd0dcfadb0b1d448c7a41';
//Soldier CONTRACT

var autoRetrieveFlag = true;

// Holds the accounts
var accounts;

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

    document.getElementById ("doContractSendCall").addEventListener ("click", doContractSendCall, false);

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


function    doContractSendCall()   {

    console.log("Send Call");

    var instance = createContractInstance();

    var estimatedGas = document.getElementById('contract_execute_estimatedgas').value;
    var parameterValue1 = document.getElementById('addr_to').value;
    var parameterValue2 = document.getElementById('sol_number').value;    
    var funcName = document.getElementById('contract_select_function').value;


    var    txnObject = {
        from: web3.eth.coinbase,
        gas: estimatedGas
    }

    console.log("ccontract function send call for sol");

    instance.transfer.sendTransaction(parameterValue1, parameterValue2,txnObject,function(error, result)  {

        console.log('RECVED>>',error,result);   
        if(error){
            setExecuteResultUI('Send Transaction:   ',funcName,'',error,'',true);
        } else {
            setExecuteResultUI('Send Transaction:   ',funcName,parameterValue1,result,result,false);
        }
    });
    
}

