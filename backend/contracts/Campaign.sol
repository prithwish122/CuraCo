// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Campaign {
    struct CampaignDetails {
        string title;
        string description;
        uint256 amountRequired;
        uint256 amountCollected;
        address payable creator;
        bool isActive; // Added to track if the campaign is active
    }

    CampaignDetails[] public campaigns;

    event CampaignCreated(
        uint256 campaignId,
        string title,
        string description,
        uint256 amountRequired,
        address creator
    );

    event DonationReceived(
        uint256 campaignId,
        address donor,
        uint256 amount
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _amountRequired
    ) public {
        require(_amountRequired > 0, "Amount required should be greater than 0");

        CampaignDetails memory newCampaign = CampaignDetails({
            title: _title,
            description: _description,
            amountRequired: _amountRequired,
            amountCollected: 0,
            creator: payable(msg.sender),
            isActive: true
        });

        campaigns.push(newCampaign);
        emit CampaignCreated(campaigns.length - 1, _title, _description, _amountRequired, msg.sender);
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        require(_campaignId < campaigns.length, "Campaign does not exist");
        CampaignDetails storage campaign = campaigns[_campaignId];

        require(campaign.isActive, "Campaign is not active");
        require(msg.value > 0, "Donation amount should be greater than 0");
        require(campaign.amountCollected < campaign.amountRequired, "Campaign already fully funded");

        campaign.amountCollected += msg.value;
        campaign.creator.transfer(msg.value); // Transfer the donation to the campaign creator

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    function getCampaigns() public view returns (CampaignDetails[] memory) {
        return campaigns;
    }

    function getCampaign(uint256 _campaignId) public view returns (CampaignDetails memory) {
        require(_campaignId < campaigns.length, "Campaign does not exist");
        return campaigns[_campaignId];
    }
}
