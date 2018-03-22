contract SoldierContract {

    mapping (address => uint256) public balanceOf;

    /* initial soldier supply */
    function SoldierContract(
        uint256 initialSupply
        ) {
        balanceOf[msg.sender] = initialSupply;              
    }

    /* Send soldiers */
    function transfer(address _to, uint256 _value) {
        require(balanceOf[msg.sender] >= _value);          
        require(balanceOf[_to] + _value >= balanceOf[_to]); 
        balanceOf[msg.sender] -= _value;                   
        balanceOf[_to] += _value;                          
    }
    
    /* fighting costs */
    function fight(address _to) {
        
        if (balanceOf[msg.sender] > balanceOf[_to]) {
            
            balanceOf[msg.sender] += balanceOf[_to];
            balanceOf[_to] = 0;
            
        } else if (balanceOf[msg.sender] < balanceOf[_to]) {
            
            balanceOf[_to] += balanceOf[msg.sender];
            balanceOf[msg.sender] = 0;
            
        } else if (balanceOf[msg.sender] == balanceOf[_to]) {
            
            balanceOf[_to] -= balanceOf[_to]/2;
            balanceOf[msg.sender] -= balanceOf[msg.sender]/2;
            
        }
    }
}
