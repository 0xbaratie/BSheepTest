// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "hardhat/console.sol";

contract SheepUp1155 is ERC1155 {
    struct SheepStatus {
        uint level;
        uint shippedAt;
    }
    struct PlayerTapCount {
        uint count;
        uint tappedAt;
    }
    struct PlayerShipCount {
        uint count;
        uint shippedAt;
    }

    event Sheepened(uint indexed sheepId, uint level, uint shippedAt);
    event Shipped(address indexed sender, uint level);

    /**
     * id 1: sheep count
     * id 2: tap count
     * id 3: ship count
     */
    uint constant SHEEP_ID = 1;
    uint constant TAP_ID = 2;
    uint constant SHIP_ID = 3;
    //caps
    uint public constant SHIP_CAP = 10000000;
    uint public constant PLAYER_TAP_COUNT_CAP = 100;
    uint public constant PLAYER_SHIP_COUNT_CAP = 3;
    //staminas
    uint public constant TAP_COUNT_RECOVER_SECOND = 108;
    uint public constant SHIP_COUNT_RECOVER_SECOND = 3600;

    /** variables */
    uint public currentSheepId = 0;
    uint public maxShipCount = 0;
    // mapping( sheepId => SheepStatus )
    mapping(uint => SheepStatus) public sheepStatus;
    // mapping( player => stamina )
    mapping(address => PlayerTapCount) public playerTapCount;
    mapping(address => PlayerShipCount) public playerShipCount;
    // mapping( player => point )
    mapping(address => uint) public point;

    constructor() ERC1155("") {}

    function uri(uint256 _id) public view override returns (string memory) {
        //TODO
    }

    function getPlayerTapStamina(address _sender) public view returns (uint) {
        uint _count = playerTapCount[_sender].count;
        if (_count > 0) {
            uint _tappedAt = playerTapCount[_sender].tappedAt;
            uint _reducedCount = (block.timestamp - _tappedAt) /
                TAP_COUNT_RECOVER_SECOND;

            _count = (_count < _reducedCount) ? 0 : _count - _reducedCount;
        }
        return PLAYER_TAP_COUNT_CAP - _count;
    }

    function getPlayerShipStamina(address _sender) public view returns (uint) {
        uint _count = playerShipCount[_sender].count;
        if (_count > 0) {
            uint _shippedAt = playerShipCount[_sender].shippedAt;
            uint _reducedCount = (block.timestamp - _shippedAt) /
                SHIP_COUNT_RECOVER_SECOND;

            _count = (_count < _reducedCount) ? 0 : _count - _reducedCount;
        }
        return PLAYER_SHIP_COUNT_CAP - _count;
    }

    function mint() external {
        currentSheepId++;
        _mint(msg.sender, SHEEP_ID, 1, "");
        emit Sheepened(currentSheepId, 0, 0);
    }

    function taps(uint[] memory _sheepIds) external {
        uint _len = _sheepIds.length;
        for (uint i = 0; i < _len; i++) {
            tap(_sheepIds[i]);
        }
    }

    function tap(uint _sheepId) public {
        uint _count = playerTapCount[msg.sender].count;
        if (_count > 0) {
            uint _tappedAt = playerTapCount[msg.sender].tappedAt;
            uint _reducedCount = (block.timestamp - _tappedAt) /
                TAP_COUNT_RECOVER_SECOND;

            _count = (_count < _reducedCount) ? 0 : _count - _reducedCount;
        }
        if (_count >= PLAYER_TAP_COUNT_CAP) {
            revert("Tap cap reached");
        }
        playerTapCount[msg.sender] = PlayerTapCount(
            _count + 1,
            block.timestamp
        );

        if (_sheepId > currentSheepId) {
            revert("Sheep does not exist");
        }

        point[msg.sender]++;

        SheepStatus storage _status = sheepStatus[_sheepId];
        _status.level++;
        emit Sheepened(_sheepId, _status.level, _status.shippedAt);

        _mint(msg.sender, TAP_ID, 1, "");
    }

    function ship(uint _sheepId) external {
        uint _count = playerShipCount[msg.sender].count;
        if (_count > 0) {
            uint _shippedAt = playerShipCount[msg.sender].shippedAt;
            uint _reducedCount = (block.timestamp - _shippedAt) /
                SHIP_COUNT_RECOVER_SECOND;

            _count = (_count < _reducedCount) ? 0 : _count - _reducedCount;
        }
        if (_count >= PLAYER_SHIP_COUNT_CAP) {
            revert("Ship cap reached");
        }
        playerShipCount[msg.sender] = PlayerShipCount(
            _count + 1,
            block.timestamp
        );

        if (maxShipCount >= SHIP_CAP) {
            revert("Ship cap reached");
        }

        if (_sheepId > currentSheepId) {
            revert("Sheep does not exist");
        }

        //emit the level of sheep
        uint _oldLevel = sheepStatus[_sheepId].level;
        point[msg.sender] += (_oldLevel * 10);
        emit Shipped(msg.sender, _oldLevel);

        //initiate the sheep
        uint __shippedAt = block.timestamp;
        sheepStatus[_sheepId] = SheepStatus(0, __shippedAt);
        emit Sheepened(_sheepId, 0, __shippedAt);

        _mint(msg.sender, SHIP_ID, 1, "");
        maxShipCount++;
    }
}
