//Soldier CONTRACT // 0x32088f303bc82999357223f044be804b4c86f826 // 2000000000000000000  500000000000000000
var contract_abidefinition = '[ { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]';
var contract_bytecode = '0x6060604052341561000f57600080fd5b60405160208061031883398101604052808051906020019091905050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505061029a8061007e6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806370a0823114610051578063a9059cbb1461009e575b600080fd5b341561005c57600080fd5b610088600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100e0565b6040518082815260200191505060405180910390f35b34156100a957600080fd5b6100de600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506100f8565b005b60006020528060005260406000206000915090505481565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561014557600080fd5b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401101515156101d257600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050505600a165627a7a72305820ae2edda7c4e4e0333a69bff81f3e9801841c494b9f01b440b65f80e8dfe768ec0029';
var contract_address = '0xcb29ce07d44c575b651dd0dcfadb0b1d448c7a41';
//Soldier CONTRACT

var autoRetrieveFlag = true;

// Holds the accounts
var accounts;

// Holds the filter objects
var filterWatch;
var filterEventCounter;

// Holds the contract event object
var contractEvent;
var contractEventCounter=0;

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



    // Set the connect status on the app
    if (web3 && web3.isConnected()) {
        setData('connect_status','Connected', false);

        // Gets the version data and populates the result UI
        setWeb3Version();

        if(autoRetrieveFlag) doGetAccounts();

    } else {
        setData('connect_status','Not Connected', true);
    }

    // no action to be taken if this flag is OFF  
    // during development for convinience you may set autoRetrieveFlag=true
    if(!autoRetrieveFlag)  return;



    // doConnect();
    // // doGetAccounts();
    doGetNodeStatus();
    document.getElementById ("doContractFunctionCall").addEventListener ("click", doContractFunctionCall, false);
    document.getElementById ("doContractSendCall").addEventListener ("click", doContractSendCall, false);


    // Compilation is available only for TestRPC
    // Geth 1.6 and above does not support compilation
    // MetaMask does not support compilation
}

/**
 * This method is called for connecting to the node
 * The Provider URL is provided in a Document element with the 
 * id = provider_url
 */


function doConnect()    {

    // Get the provider URL
    var provider = document.getElementById('provider_url').value;
    var provider = document.getElementById('provider_url').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    startApp();

}

/**
 * Get the version information for Web3
 */

function    setWeb3Version() {

    var versionJson = {};

    // Asynchronous version
    web3.version.getNode(function(error, result){
        if(error) setData('version_information',error,true);
        else {
            setData('version_information',result,false);

            if(result.toLowerCase().includes('metamask')){
                nodeType = 'metamask';
            } else if(result.toLowerCase().includes('testrpc')){
                nodeType = 'testrpc';
            } else {
                nodeType = 'geth';
            }

            
            // set up UI elements based on the node type
        }
    });
}



/**
 * Uses the web3.net status to check if the client is listening and peer count
 */

function    doGetNodeStatus()  {

    // Asynch version
    web3.net.getListening(function(error, result){
        if(error) setData('get_peer_count',error,true);
        else {
            // Since connected lets get the count
            web3.net.getPeerCount(  function(  error,  result ) {
            if(error){
                setData('get_peer_count',error,true);
            } else {
                setData('get_peer_count','Peer Count: '+result,(result == 0));
            }
        });
        }
    });
}

/**
 * Gets the accounts under the node
 * 
 */

function    doGetAccounts() {
    // This is the synch call for getting the accounts
    // var accounts = web3.eth.accounts
    
    // Asynchronous call to get the accounts
    // result = [Array of accounts]
    // MetaMask returns 1 account in the array - that is the currently selected account
    web3.eth.getAccounts(function (error, result) {
        if (error) {
            setData('accounts_count', error, true);
        } else {
            accounts = result;
            setData('accounts_count', result.length, false);
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
            setData('coinbase', coinbase, false);
            // set the default accounts
            var defaultAccount = web3.eth.defaultAccount;
            if(!defaultAccount){
                web3.eth.defaultAccount =  result[0];
                defaultAccount = '[Undef]' + result[0];
            }

            defaultAccount = defaultAccount.substring(0,25)+'...';
            setData('defaultAccount', defaultAccount, false);
        }
        // Get the balances of all accounts doGetBalances
        doGetBalances(accounts)

        // This populates the SELECT boxes with the accounts
        addAccountsToSelects(accounts);
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

/**
 * This gets invoked for sending the transaction
 */

function    doSendTransaction()  {

    var transactionObject = createTransactionObjectJson();

    web3.eth.sendTransaction(transactionObject, function(error, result) {

        if(error){
            setData('send_transaction_error_or_result', error, true);
        } else {
            setData('send_transaction_error_or_result', result, false);
            // set the link to ether scan
            var etherscanLinkA=document.getElementById('etherscan_io_tx_link');
            etherscanLinkA.href = createEtherscanIoUrl('tx',result);
            etherscanLinkA.innerHTML='etherscan.io'
            //console.log(etherscanLinkA)
        }
    });
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
 * This invokes the contract function
 * locally on the node with no state change propagation
 */
function    doContractFunctionCall()  {
    // This leads to the invocation of the method locally
    var instance = createContractInstance();


   // instance.balanceOf(accounts[0]).(function(result){
     //   console.log(result);
  //  });

}

/**
 * send Transaction costs Gas. State changes are recorded on the chain.
 */
function    doContractSendCall()   {
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

/**
 * Starts the filter watch for events with options specified by the user
 */


function    doFilterWatchStart()   {
    //1. Stop the wtach if its already ON
    doFilterStopWatching();
    //2. Reset the UI
    setData('watch_event_count','0',false);

    //3. Create the filter option
    var options = generateFilterOptions();
    console.log('FILTER Watch Options:', JSON.stringify(options));

    //4. Set the applied watch filter UI Input box
    document.getElementById('applied_watch_filter').value=JSON.stringify(options);

    //5. Create instance of the filter
    filterWatch = web3.eth.filter(options);

    //6. Now start watching
    filterWatch.watch(function(error,result){
        if(error){
            console.error('Filter Watch Error: ',error);
        } else {
            filterEventCounter++;
            // Update the UI for the counter
            setData('watch_event_count', filterEventCounter, false);

            // Updates the UI with received event
            addEventListItem('watch_events_list',result,5);
        }
    });
}

/**
 * Stop watching for events
 */

function    doFilterStopWatching()  {

    // 1. Stop watching if watching iactive
    if(filterWatch){
        filterWatch.stopWatching();
        filterWatch = undefined;
    }
    // 2. Reset the UI
    setData('watch_event_count','Not Watching',true);
    document.getElementById('applied_watch_filter').value='';

    // 3. Remove all of the past events from the list
    clearList('watch_events_list');

    // 4. reset the counter
    filterEventCounter = 0;
}

/**
 * Get the logs for the specified filter
 * Testnet sample contract address: 
 */

function    doFilterGetLogs()  {

    // 1. Clear the list
    clearList('get_logs_list');
    
    // 2. Create the filter option
    var options = generateFilterOptions();
    console.log('FILTER Get Options:', JSON.stringify(options));

    // 3. Set the applied watch filter UI Input box
    document.getElementById('applied_log_filter').value=JSON.stringify(options);

    // 4. Create the instance of the filter
    var filterGet = web3.eth.filter(options);

    // 5. Invoke get on filter with the callback function
    filterGet.get(function(error, result){
        if(error){
            console.log('GET Error:',error);
            setData('get_log_count',error, true);
        } else {
            // result = array of events
            // Update UI with the data received as an array of events
            setData('get_log_count',result.length, false);
            for(var i = 0; i < result.length ; i++){
                //console.log("Event.watch="+JSON.stringify(result[i]))
                addEventListItem('get_logs_list',result[i],50);
            }
        }
    });
}

/**
 * To start the event watching using the contract object
 */

function    doContractEventWatchStart() {

    if(contractEvent){
        doContractEventWatchStop();
    }

    // Reset the UI
    setData('watch_contract_instance_event_count','0',false);

    contractEvent = createContractEventInstance();

    contractEvent.watch(function(error, result){
        if(error){
            console.error('Contract Event Error');
        } else {
           
        //    console.log("Event.watch="+JSON.stringify(result))
            // increment the count watch_instance_event_count
            contractEventCounter++;
            setData('watch_contract_instance_event_count',contractEventCounter, false );

            addEventListItem('watch_contract_events_list',result,5);
        }
    });
}


/**
 * To stop the event watching using the contract object
 */

function    doContractEventWatchStop()   {

    if(contractEvent){
        contractEvent.stopWatching();
        contractEvent = undefined;
    }
    contractEventCounter = 0;
    clearList('watch_contract_events_list');
    setData('watch_contract_instance_event_count', '---', true);
}

/**
 * Gets the logs for the specific contract instance
 */

function doContractEventGet() {

    clearList('get_contract_instance_logs_list');
    setData('get_contract_instance_log_count', '---', true);
    var event = createContractEventInstance();
    event.get(function(error, result){
        if(error){
            setData('get_contract_instance_log_count',error,true);
        } else {
            setData('get_contract_instance_log_count',result.length, false);
            for(var i = 0; i < result.length ; i++){
                addEventListItem('get_contract_instance_logs_list',result[i],50);
            }
        }
    });
}

/**
 * Utility method for creating an instance of the event
 */
function createContractEventInstance(){
    var contractAddress = document.getElementById('contract_instance_address').value

    var contractInstance = createContractInstance(contractAddress);

    // geth the indexed data values JSON
    var indexedEventValues = document.getElementById('indexed_event_values').value
    indexedEventValues = JSON.parse(indexedEventValues)

    var additionalFilterOptions = document.getElementById('additional_filter_event_values').value;
    additionalFilterOptions = JSON.parse(additionalFilterOptions);

    return contractInstance.NumberSetEvent(indexedEventValues, additionalFilterOptions);
}

