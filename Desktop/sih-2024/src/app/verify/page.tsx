"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SHA256 from "crypto-js/sha256";
import HashStorage from "../../contract/HashStorage.json";
import Loader from '../../../Components/Loader/page'
const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [name, setName] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [loader, setLoader] = useState(false);
  const [ipfsLink, setIpfsLink] = useState<string | null>(null); // State for IPFS link

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const { ethereum } = window as any;
    
    if (!ethereum) {
      alert("MetaMask is not installed. Please install it to use this application.");
      return;
    }
    
    const loadProvider = async () => {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const contractAddress = "0x096025BF9Cc091702ACA28F268ABba82c30418D2"; // Replace with your contract address
        const contract = new ethers.Contract(contractAddress, HashStorage.abi, signer);

        setAccount(address);
        setContract(contract);
        setProvider(provider);

      } catch (error) {
        console.error("Error loading provider:", error);
        alert("Failed to load provider. Please check your connection.");
      }
    };

    loadProvider();

    ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

    ethereum.on("chainChanged", () => {
      window.location.reload();
    });

  }, []); // Empty dependency array ensures this runs only once

  const storeHashOnBlockchain = async (value: string) => {
    try {
      const hash = SHA256(value).toString();
      const data = JSON.stringify({
        pinataOptions: { cidVersion: 1 },
        pinataMetadata: { name: "File name" },
        pinataContent: { hash: hash },
      });

      const resFile = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        headers: {
          pinata_api_key: "51a5653f847c1569cef9",
          pinata_secret_api_key: "c3bc0de9220a75c630862d893f7fb94220a48b9104e38d83d66d929c879dce29",
          "Content-Type": "application/json",
        },
      });

      const ipfsHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      await contract.storeHash(ipfsHash);
      console.log("Hash stored successfully on blockchain:", ipfsHash);
      setIpfsLink(ipfsHash); // Set the IPFS link in state
    } catch (error) {
      console.error("Error uploading hash:", error);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handlesubmit = async () => {
    setLoader(true);

    if (!name || !documentType || !file) {
        console.error("All fields are required.");
        setLoader(false);
        return;
    }
    const formData = new FormData();
    formData.append("uploadfile", file);
    formData.append("Documenttype", documentType);
    formData.append("Name", name);
    if (startdate) formData.append("startdate", startdate);
    if (enddate) formData.append("enddate", enddate);
    

    try {
        const response = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(response);

        const fileLink = response.data.fileLink;
        if (fileLink) {
            const extractionResponse = await axios.post("/api/getdata", { fileLink });
            const extractedData = extractionResponse.data.data;
            console.log(extractedData);
            await storeHashOnBlockchain(extractedData);
            
            // Trigger hashvalue function after storing hash on blockchain
        }

    } catch (error) {
        console.error(error);
    }

    setLoader(false);
};

// Move hashvalue to execute after the IPFS link is set
async function hashvalue() {
  if (ipfsLink) {
    try {
      // Fetch the hash data from IPFS
      const response3 = await axios.get(ipfsLink);
      console.log("IPFS data:", response3.data);

      // Send the hash and name to the verify endpoint
      const response4 = await axios.post("/api/verify", { hash: response3.data.hash, name: name });

      // Check the response status
      if (response4.status === 200) {
        alert("Verify successful");
      } else {
        alert("Verify failed");
      }
      console.log("Verification response:", response4.data);
    } catch (error:any) {
      // Log the error details
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        alert(`Verification failed: ${error.response.data.message}`);
      } else if (error.request) {
        // No response received
        console.error("No response received:", error.request);
        alert("Verification failed: No response from server");
      } else {
        // Other errors
        console.error("Error during verification:", error.message);
        alert(`Verification failed: ${error.message}`);
      }
    }
  }
}

    if(ipfsLink){
      hashvalue()
    }
  


    if(loader){
      return <div className="text-7xl text-white">
        <Loader />
      </div>
    }
  
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-11/12 md:w-8/12 lg:w-6/12">
          <h1 className="text-center text-4xl text-white mb-6 font-bold">Document Verify</h1>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-gray-400 mb-2" htmlFor="documentType">Select Document Type</label>
              <select
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Document Type</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Mark Sheet Class 10th">Mark Sheet Class 10th</option>
                <option value="Mark Sheet Class 12th">Mark Sheet Class 12th</option>
                <option value="PAN Card">PAN Card</option>
              </select>
            </div>
  
            <div className="flex flex-col">
              <label className="text-gray-400 mb-2" htmlFor="recipientName">Recipient Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Recipient name"
                className="w-full px-4 py-3 text-gray-900 bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
  
            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="flex flex-col w-full">
                <label className="text-gray-400 mb-2" htmlFor="issuingDate">Issuing Date</label>
                <input
                  type="date"
                  value={startdate}
                  onChange={(e) => setStartdate(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
  
              <div className="flex flex-col w-full mt-4 md:mt-0">
                <label className="text-gray-400 mb-2" htmlFor="expiringDate">Expiring Date (Optional)</label>
                <input
                  type="date"
                  value={enddate}
                  onChange={(e) => setEnddate(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
  
            <div className="flex flex-col">
              <label className="text-gray-400 mb-2" htmlFor="fileUpload">Upload File</label>
              <input
                type="file"
                onChange={handleProfileChange}
                className="w-full px-4 py-3 text-gray-900 bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
  
            <div className="w-full flex justify-center mt-6">
              <button
                type="button"
                onClick={handlesubmit}
                className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
              <button
                type="button"
                className="ml-4 w-full md:w-auto px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  };
  
  export default Page;