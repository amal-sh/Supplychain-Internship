// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    
    struct Product {
        string farmerId;
        string productType;
        string productName;
        string harvestDate;
        string quantity;
        uint256 timestamp;
    }

    Product[] public products;

    event ProductAdded(
        string farmerId,
        string productType,
        string productName,
        string harvestDate,
        string quantity,
        uint256 timestamp,
        address addedBy
    );

    function addProduct(
        string memory _farmerId,
        string memory _productType,
        string memory _productName,
        string memory _harvestDate,
        string memory _quantity
    ) public {
        Product memory newProduct = Product({
            farmerId: _farmerId,
            productType: _productType,
            productName: _productName,
            harvestDate: _harvestDate,
            quantity: _quantity,
            timestamp: block.timestamp
        });

        products.push(newProduct);

        emit ProductAdded(
            _farmerId,
            _productType,
            _productName,
            _harvestDate,
            _quantity,
            block.timestamp,
            msg.sender
        );
    }

    function getProduct(uint256 index) public view returns (
        string memory farmerId,
        string memory productType,
        string memory productName,
        string memory harvestDate,
        string memory quantity,
        uint256 timestamp
    ) {
        require(index < products.length, "Invalid index");
        Product memory p = products[index];
        return (p.farmerId, p.productType, p.productName, p.harvestDate, p.quantity, p.timestamp);
    }

    function getProductCount() public view returns (uint256) {
        return products.length;
    }
}
