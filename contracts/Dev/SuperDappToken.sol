// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract SuperDappToken is Initializable, ERC20Upgradeable {
    function initialize() public initializer {
        __ERC20_init("SuperDapp", "SUPR");
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }
}
