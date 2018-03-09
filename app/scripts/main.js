//Soldier CONTRACT // 0x32088f303bc82999357223f044be804b4c86f826 // 2000000000000000000  500000000000000000
var contract_abidefinition = '[ { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]';
var contract_bytecode = '0x6060604052341561000f57600080fd5b60405160208061031883398101604052808051906020019091905050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505061029a8061007e6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806370a0823114610051578063a9059cbb1461009e575b600080fd5b341561005c57600080fd5b610088600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100e0565b6040518082815260200191505060405180910390f35b34156100a957600080fd5b6100de600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506100f8565b005b60006020528060005260406000206000915090505481565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561014557600080fd5b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401101515156101d257600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050505600a165627a7a72305820ae2edda7c4e4e0333a69bff81f3e9801841c494b9f01b440b65f80e8dfe768ec0029';
var contract_address = '0xcb29ce07d44c575b651dd0dcfadb0b1d448c7a41';
//Soldier CONTRACT

var autoRetrieveFlag = true;

// Holds the accounts
var accounts;


// Maintains the info on node type
var     nodeType = 'geth';

/**
 * Listener for load
 */
window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('Injected web3 Not Found!!!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    var provider = document.getElementById('provider_url').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
  }

  // Now you can start your app & access web3 freely:
  startApp()

})


/**
 * This method gets invoked when document is ready
 */
function    startApp(){



    if (web3 && web3.isConnected()) {


        if(autoRetrieveFlag) doGetAccounts();

    } 

    document.getElementById ("doContractSendCall").addEventListener ("click", doContractSendCall, false);


}


function doConnect()    {

    // Get the provider URL
    var provider = document.getElementById('provider_url').value;
    var provider = document.getElementById('provider_url').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    startApp();

}




function    doGetAccounts() {
    // This is the synch call for getting the accounts
    // var accounts = web3.eth.accounts
    
    // Asynchronous call to get the accounts
    // result = [Array of accounts]
    // MetaMask returns 1 account in the array - that is the currently selected account
    web3.eth.getAccounts(function (error, result) {

        accounts = result;
        // You need to have at least 1 account to proceed
        if(result.length == 0) {
            if(nodeType == 'metamask'){
                alert('Unlock MetaMask *and* click \'Get Accounts\'');
            }
            return;
        }

        // Remove the list items that may already be there
        // Add the accounts as list items
        for (var i = 0; i < result.length; i++) {
            addAccountsToList('accounts_list',i,result[i])
        }
        
        var coinbase = web3.eth.coinbase;
        // trim it so as to fit in the window/UI
        if(coinbase) coinbase = coinbase.substring(0,25)+'...'
        // set the default accounts
        var defaultAccount = web3.eth.defaultAccount;
        if(!defaultAccount){
            web3.eth.defaultAccount =  result[0];
            defaultAccount = '[Undef]' + result[0];
        }

        defaultAccount = defaultAccount.substring(0,25)+'...';
        
        // Get the balances of all accounts doGetBalances
        doGetBalances(accounts)

    });
}

/**
 * Get the balances of all accounts.
 */
function    doGetBalances(accounts) {

    
    // Add the balances as the list items
    for (var i = 0; i < accounts.length; i++) {

       // var bal = web3.eth.getBalance(accounts[i]);
       web3.eth.getBalance(accounts[i],web3.eth.defaultBlock,function(error,result){
           // Convert the balance to ethers
            var bal = web3.fromWei(result,'ether').toFixed(2);
            addAccountBalancesToList('account_balances_list',i,bal);
        });
    }
}




// Utility method for creating the contract instance
function  createContractInstance(addr){
    var     abiDefinitionString = contract_abidefinition;
    var     abiDefinition = JSON.parse(abiDefinitionString);

    // Instance uses the definition to create the function

    var    contract = web3.eth.contract(abiDefinition);

   // THIS IS AN EXAMPLE - How to create a deploy using the contract
   // var instance = contract.new(constructor_params, {from:coinbase, gas:10000})
   // Use the next for manual deployment using the data generated
   // var contractData = contract.new.getData(constructor_params, {from:coinbase, gas:10000});

    var    address = contract_address;
    
   
    var    instance = contract.at(address);

    return instance;
}

/**
 * send Transaction costs Gas. State changes are recorded on the chain.
 */
function    doContractSendCall()   {

    console.log("Send Call");
    // creating the cntract instance
    var instance = createContractInstance();
    // read the ui elements
    var estimatedGas = document.getElementById('contract_execute_estimatedgas').value;
    var parameterValue1 = document.getElementById('addr_to').value;
    var parameterValue2 = document.getElementById('sol_number').value;    
    var funcName = document.getElementById('contract_select_function').value;


    // Create the transaction object
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

