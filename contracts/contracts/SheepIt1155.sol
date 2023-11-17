// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SheepIt1155 is ERC1155 {
    struct SheepStatus {
        uint level;
        uint shippedAt;
    }

    event Sheepened(uint indexed sheepId, uint level, uint shippedAt);
    event Shipped(address indexed sender, uint level);

    /**
     * id 1: sheep count
     * id 2: sit count
     * id 3: ship count
     */
    uint constant SHEEP_COUNT = 1;
    uint constant SIT_COUNT = 2;
    uint constant SHIP_COUNT = 3;

    uint public maxSheepCount = 0;
    // mapping( sheepId => SheepStatus )
    mapping(uint => SheepStatus) public sheepLevel;
    // mapping( player => stamina )
    mapping(address => uint) public stamina;

    constructor() ERC1155("") {}

    function uri(uint256 _id) public view override returns (string memory) {
        //TODO
    }

    function mint() external {
        maxSheepCount++;
        _mint(msg.sender, SHEEP_COUNT, 1, "");
    }

    function sit(uint _sheepId) external {
        //TODO validation of stamina

        if (_sheepId > maxSheepCount) {
            revert("Sheep does not exist");
        }

        SheepStatus storage _status = sheepLevel[_sheepId];
        _status.level++;
        emit Sheepened(_sheepId, _status.level, _status.shippedAt);

        _mint(msg.sender, SIT_COUNT, 1, "");
    }

    function ship(uint _sheepId) external {
        //TODO validation of stamina

        if (_sheepId > maxSheepCount) {
            revert("Sheep does not exist");
        }

        //emit the levelo of sheep
        uint _oldLevel = sheepLevel[_sheepId].level;
        emit Shipped(msg.sender, _oldLevel);

        //initiate the sheep
        uint _shippedAt = block.timestamp;
        sheepLevel[_sheepId] = SheepStatus(0, _shippedAt);
        emit Sheepened(_sheepId, 0, _shippedAt);

        _mint(msg.sender, SHIP_COUNT, 1, "");
    }
}
