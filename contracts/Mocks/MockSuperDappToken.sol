// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockSuperDappToken is Ownable, ERC20 {
    constructor() ERC20("SuperDapp", "SUPR") Ownable(msg.sender) {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }
}
