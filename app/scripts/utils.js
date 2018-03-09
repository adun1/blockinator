/**
 * Contains utility functions for managing the UI
 */

// Holds the base URL for etherscan.io
var etherscanBaseUrl='https://rinkeby.etherscan.io/';


/**
 * Creates a list item for the account in the account list
 */
function addAccountsToList(listId,index,account){
    var li = document.createElement('LI');
    var input = document.createElement('INPUT')
    input.value = account;
    input.id = 'account'+index;
    input.disabled=true;
    li.appendChild(input)
    var list = document.getElementById(listId);
    list.appendChild(li)
}


/**
 * Creates a list item for the balance in the account balance list
 */
function addAccountBalancesToList(listId,index,accountBalance){
    var li = document.createElement('LI');
    li.class='ready'
    var input = document.createElement('P');
    input.class = 'ready';
    input.innerText=accountBalance+' Ether';
    li.appendChild(input);
    var list = document.getElementById(listId);
    list.appendChild(li)
}

/**
 * Create the etherscan link
 */
function    createEtherscanIoUrl(type,hashOrNumber){

    // For TestRPC - this URL will have no meaning as the
    // Etherscan.io will not know about the Tx Hash

    var url = etherscanBaseUrl;
    if(type === 'tx'){
        url += 'tx/'+hashOrNumber;
    } else if(type === 'block'){
        url += 'block/'+hashOrNumber;
    } else if(type === 'address'){
        url += 'address/'+hashOrNumber;
    } 
    return url;
}

/**
 * Sets the href in the <a> tag for etherscan.io
 */
function   setEtherscanIoLink(aId, type, hashOrNumber){
    var etherscanLinkA=document.getElementById(aId);
    etherscanLinkA.href = createEtherscanIoUrl(type,hashOrNumber);
    if(hashOrNumber)
        etherscanLinkA.innerHTML='etherscan.io';
    else
        etherscanLinkA.innerHTML='';
}

/**
 * Sets the Result UI components for the Execute call/Send Call
 */
function    setExecuteResultUI(callType,functionName, parameter, return_value, txHash, error){

    setEtherscanIoLink('invoke_contracttransactionhash_link', 'tx', txHash);
}

