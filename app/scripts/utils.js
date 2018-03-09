
// Holds the base URL for etherscan.io
var etherscanBaseUrl='https://rinkeby.etherscan.io/';


// Create the etherscan link
 
function    createEtherscanIoUrl(type,hashOrNumber){

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

// Sets the href in the <a> tag for etherscan.io
 
function   setEtherscanIoLink(aId, type, hashOrNumber){
    var etherscanLinkA=document.getElementById(aId);
    etherscanLinkA.href = createEtherscanIoUrl(type,hashOrNumber);
    if(hashOrNumber)
        etherscanLinkA.innerHTML='etherscan.io';
    else
        etherscanLinkA.innerHTML='';
}

// Sets the Result UI components for the Execute call/Send Call
function    setExecuteResultUI(callType, parameter, return_value, txHash, error){

    setEtherscanIoLink('invoke_contracttransactionhash_link', 'tx', txHash);
}

