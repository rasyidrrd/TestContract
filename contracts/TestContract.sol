// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.3;

contract TestContract {
    event UpdatedMessages(string oldStr, string newStr);
    event FundsTransferred(address indexed sender, address indexed recipient, uint256 amount);

    string public message;

    constructor(string memory initMessage) {
        message = initMessage;
    }

    function update(string memory newMessage) public {
        string memory oldMsg = message;
        message = newMessage;
        emit UpdatedMessages(oldMsg, newMessage);
    }

    function transferFunds(address payable recipient) public payable {
        require(recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Transfer amount must be greater than 0");

        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Failed to transfer funds");

        emit FundsTransferred(msg.sender, recipient, msg.value);
    }
}
