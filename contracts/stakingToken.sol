// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingToken is ERC20 {


constructor( string memory _name, string memory _symbol, uint _ammount) ERC20(_name, _symbol)  {
_mint(msg.sender, _ammount );
}

}