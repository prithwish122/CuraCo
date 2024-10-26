'use client';

import Navbar from './components/Navbar'; // Import the Navbar component
import React, { useState, useEffect } from 'react';
import { BrowserProvider, ethers } from "ethers";
import CampaignABI from "./contractsData/ContractABI.json";
import ContractAddress from "./contractsData/contractAddress.json"

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amountRequired, setAmountRequired] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [donationAmount, setDonationAmount] = useState<string>(''); // State to capture donation amount

  // Function to fetch campaigns from the contract
  const fetchCampaigns = async () => {
    if (!window.ethereum) return;

    const provider = new BrowserProvider(window.ethereum);
    const campaignContract = new ethers.Contract(ContractAddress.address, CampaignABI, provider);
    
    try {
      const campaignsData = await campaignContract.getCampaigns();
      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Function to handle the form submission and interact with the smart contract
  const createCampaign = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const campaignContract = new ethers.Contract(ContractAddress.address, CampaignABI, signer);
      
      const amountInWei = ethers.parseEther(amountRequired); // Convert to Wei

      // Send the transaction using the signer
      const tx = await campaignContract.createCampaign(title, description, amountInWei);
      await tx.wait(); // Wait for the transaction to be mined

      alert('Campaign Created Successfully!');
      setShowModal(false); // Close the modal after creating the campaign
      fetchCampaigns(); // Refresh campaigns after creation
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      alert(`Failed to create campaign: ${error.message}`);
    }
  };

  // Function to donate to a campaign
  const donateToCampaign = async (campaignId: number, amount: string) => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const campaignContract = new ethers.Contract(ContractAddress.address, CampaignABI, signer);
      
      const amountInWei = ethers.parseEther(amount); // Convert the amount to Wei

      // Call the donateToCampaign function
      const tx = await campaignContract.donateToCampaign(campaignId, { value: amountInWei });
      await tx.wait(); // Wait for the transaction to be mined

      alert('Donation Successful!');
      fetchCampaigns(); // Refresh campaigns after donation
    } catch (error: any) {
      console.error('Failed to donate:', error);
      alert(`Failed to donate: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-violet-900"> {/* Updated gradient to start from black to violet */}
 
      <div className="flex-1 flex flex-col justify-center items-center pt-20"> {/* Main content area */}
        
        {/* Blurry container for the title and button */}
        {/* <div className="bg-white backdrop-blur-md bg-opacity-20 p-8 rounded-lg shadow-lg mb-8 w-full max-w-md transform"> */}
        <p className="text-2xl text-white text-center from-sidebar-accent-foreground">Create campaigns and donate towards health emergencies.</p>
        {/* Changed text color to white */}
          <div className="flex justify-center">
            <button
              className="bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold py-3 px-6 rounded-lg transition duration-300 mt-4"
              onClick={() => setShowModal(true)}
            >
              Create Campaign
            </button>
          </div>
        {/* </div> */}

        {/* Displaying Campaigns */}
        <div className="mt-10 w-full max-w-6xl"> {/* Limit width for better alignment */}
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">Active Campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-violet-600 to-violet-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <h3 className="text-xl font-bold mb-2 text-white">{campaign.title}</h3>
                <p className="mb-2 text-gray-300">{campaign.description}</p>
                <p className="mb-2 text-gray-300">Amount Required: <span className="text-green-400">{parseInt(ethers.formatEther(campaign.amountRequired.toString())) - parseInt(ethers.formatEther(campaign.amountCollected.toString()))} AIA</span></p>
                <p className="mb-4 text-gray-300">Amount Donated: <span className="text-green-400">{ethers.formatEther(campaign.amountCollected.toString())} AIA</span></p>

                {/* Input for donation amount */}
                <input
                  type="number"
                  placeholder="Amount to donate (ETH)"
                  onChange={(e) => setDonationAmount(e.target.value)} // Capture donation amount
                  className="border border-purple-500 rounded-lg p-2 mb-2 w-full text-gray-900"
                />
                <button
                  className="bg-violet-500 hover:bg-violet-600 text-white py-2 px-4 rounded-lg transition duration-300"
                  onClick={() => donateToCampaign(index, donationAmount)} // Call the donate function
                >
                  Donate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal (Popup) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Create a New Campaign</h2>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-purple-300 rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-purple-300 rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Amount Required (in AIA)</label>
              <input
                type="text"
                className="w-full p-2 border border-purple-300 rounded-lg"
                value={amountRequired}
                onChange={(e) => setAmountRequired(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg"
                onClick={createCampaign}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
