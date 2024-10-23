'use client';

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MdSchema } from "react-icons/md"; // Updated icon
import { FaUserCircle } from "react-icons/fa"; // Profile icon
import Link from 'next/link'; // Use Link to navigate

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0 PY'); // Set initial balance
  const logoRef = useRef<HTMLDivElement>(null); // Ref for logo animation

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      console.error('MetaMask is not detected');
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAccount(accounts[0]); // Store the first account address
        console.log('Connected account:', accounts[0]);

        // Fetch the balance here (for example purposes, set to 15 DC)
        setBalance('15 PY'); // Replace this with your logic to fetch balance
      } catch (error) {
        console.error("User denied wallet connection or another error occurred:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 bg-transparent text-white z-50"> {/* Reverted background to transparent and text color to white */}
      <div 
        ref={logoRef} 
        className="flex items-center font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-violet-700" // Changed logo gradient to violet
      >
        <a href="/">CuraCo</a>
      </div>
      <div className="flex items-center space-x-4">
        {/* Connect MetaMask Button */}
        <button 
          onClick={isConnected ? undefined : connectWallet} 
          className="text-white bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 transition duration-300 px-4 py-2 rounded-lg transform hover:scale-105" // Changed button gradient to violet
        >
          {isConnected ? `${account?.substring(0, 6)}...${account?.substring(account.length - 4)}` : "Connect MetaMask"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
