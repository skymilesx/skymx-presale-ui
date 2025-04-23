// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SKYMXPresale is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public constant TOKENS_PER_ETH = 10000; // 1 ETH = 10,000 SKYMX
    uint256 public minPurchase = 0.01 ether;
    uint256 public maxPurchase = 10 ether;
    uint256 public constant PRESALE_SUPPLY = 500000000 * 10**18; // 500M tokens for presale
    uint256 public tokensSold;
    bool public isPresaleActive;
    
    mapping(address => uint256) public contributions;
    mapping(string => bool) public usedReferralCodes;
    mapping(address => bool) public hasUsedReferral;
    
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event ReferralApplied(address indexed user, string code);
    event PresaleStatusChanged(bool isActive);

    constructor(address _token) {
        token = IERC20(_token);
        isPresaleActive = false;
        _transferOwnership(_msgSender());
    }

    function startPresale() external onlyOwner {
        isPresaleActive = true;
        emit PresaleStatusChanged(true);
    }

    function stopPresale() external onlyOwner {
        isPresaleActive = false;
        emit PresaleStatusChanged(false);
    }

    function buyTokens() public payable nonReentrant {
        require(isPresaleActive, "Presale is not active");
        require(msg.value >= minPurchase, "Below minimum purchase amount");
        require(msg.value <= maxPurchase, "Exceeds maximum purchase amount");
        require(contributions[_msgSender()] + msg.value <= maxPurchase, "Would exceed max contribution");

        uint256 tokenAmount = msg.value * TOKENS_PER_ETH;
        require(tokensSold + tokenAmount <= PRESALE_SUPPLY, "Exceeds presale supply");

        contributions[_msgSender()] += msg.value;
        tokensSold += tokenAmount;

        require(token.transfer(_msgSender(), tokenAmount), "Token transfer failed");
        emit TokensPurchased(_msgSender(), msg.value, tokenAmount);
    }

    function applyReferralCode(string memory code) external {
        require(!hasUsedReferral[_msgSender()], "Already used a referral code");
        require(!usedReferralCodes[code], "Referral code already used");
        
        usedReferralCodes[code] = true;
        hasUsedReferral[_msgSender()] = true;
        emit ReferralApplied(_msgSender(), code);
    }

    function withdrawTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Token transfer failed");
    }

    function withdrawEth() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "Failed to withdraw ETH");
    }

    receive() external payable {
        buyTokens();
    }
} 