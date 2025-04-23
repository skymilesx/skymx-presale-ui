// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SKYMXToken is ERC20, Ownable {
    uint256 private constant TOTAL_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    constructor() ERC20("SKYMX Token", "SKYMX") {
        _mint(_msgSender(), TOTAL_SUPPLY);
        _transferOwnership(_msgSender());
    }

    // Function to burn tokens
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    // Function to mint new tokens (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 