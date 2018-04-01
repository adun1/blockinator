
contract  SoldierContract {
    // Array Index
    uint8   public  identity;
    uint256 public power;
    address public  owner;
    bytes32 public  name;
    bytes32 public  rank;

  // Constructor
  function  SoldierContract(uint8 id, address own, bytes32 nm) payable{
    identity    = id;
    name        = nm;
    owner       = own;
    
    //Random Number Generator
    power       = uint(sha3(block.timestamp)) % 300;
    
    rank(power);
  }

  function rank(uint256 power) private {
      if(power < 50) {
          rank = 'private';
      } else if(rank < 150) {
          rank = 'corporal';
      } else if(rank < 300) {
          rank = 'sergeant';
      }
  }
  
  // Transfer ownership
  function  transferOwnership (address newOwner, bytes32 newSoldierName) {
    owner = newOwner;
    name = newSoldierName;
  }

   // checks if caller is the owner
  function  isOwner(address addr) returns(bool) {
    return (addr == owner);
  }

}

contract SoldierFactory {

  SoldierContract[] soldiers;
  
  uint8    public   soldierPrice;

  function SoldierFactory(uint8  numberOfSoldiers, uint8   price) payable {
    for(uint8 i = 0; i < numberOfSoldiers; i++){
      soldiers.push(new SoldierContract(i, this, "unNamed"));
    }
    soldierPrice = price;
  }

  // Anyone can pay the price and purchase available soldiers

  function  purchase(bytes32 name) payable {

    if(msg.value < soldierPrice) /*throw*/ revert();
    // Look for available asset i.e., one that is not sold yet
    for(uint8 i = 0; i < soldiers.length; i++){
        // Check if soldier factoy is the owner
        if(soldiers[i].isOwner(this)){
            soldiers[i].transferOwnership(msg.sender, name);
            return;
        }

    }
    // No more soldiers available - so throw an exception
    /**throw**/ revert();
  }



  // Returns the information about the soldier contract at specified index
  function  getInfo(uint8 soldierIndex) constant returns(uint8, address, bytes32){
    return (soldiers[soldierIndex].identity(),soldiers[soldierIndex].owner(),soldiers[soldierIndex].name());
  }
  // Returns the soldier contract address
  function  getSoldierContractAddress(uint8 soldierIndex) returns (address){
    return address(soldiers[soldierIndex]);
  }

  // Returns name of the owner based on the soldier index
  function  getOwnerName(uint8 soldierIndex) constant returns(bytes32){
    bytes32  namer = soldiers[soldierIndex].name();
    return namer;
  }
  // Returns the count of the soldiers
  function  getSoldiersCount() constant returns (uint){
    return soldiers.length;
  }
  
}