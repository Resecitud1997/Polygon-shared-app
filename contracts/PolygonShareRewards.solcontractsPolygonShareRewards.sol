// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PolygonShareRewards {
    address public owner;
    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    // El sistema deposita aquí las ganancias generadas por compartir internet
    function depositEarnings(address user) external payable {
        balances[user] += msg.value;
    }

    // Retiro sin Gas (Llamado a través de Gelato Relay)
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No tienes saldo acumulado");
        
        balances[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Fallo el envio de Polygon");
    }

    receive() external payable {}
}
