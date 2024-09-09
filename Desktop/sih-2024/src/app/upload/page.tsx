"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SHA256 from "crypto-js/sha256";
import HashStorage from "../../contract/HashStorage.json";
import Loader from "../../../Components/Loader/page";

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
        hashvalue();
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
      const response3 = await axios.get(ipfsLink);
      console.log(response3.data.hash);
      const response4 = await axios.put("/api/savehash", { hash: response3.data.hash, name: name });
      console.log(response4);
    }
  }

  if (ipfsLink) {
    hashvalue();
  }

  if (loader) {
    return (
      <div className="text-7xl text-white">
        <Loader />
      </div>
    );
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-center text-4xl text-white mb-8 font-semibold">Document Upload</h1>
        <form className="flex flex-col gap-6">
          <select
            onChange={(e) => setDocumentType(e.target.value)}
            className="px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Document Type</option>
            <option value="Birth Certificate">Birth Certificate</option>
            <option value="Mark Sheet Class 10th">Mark Sheet Class 10th</option>
            <option value="Mark Sheet Class 12th">Mark Sheet Class 12th</option>
            <option value="PAN Card">PAN Card</option>
          </select>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Recipient name"
            className="px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 transition duration-200"
          />

          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="issuingDate" className="text-gray-400">Issuing Date</label>
              <input
                type="date"
                value={startdate}
                onChange={(e) => setStartdate(e.target.value)}
                className="px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 transition duration-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="expiringDate" className="text-gray-400">Expiring Date (Optional)</label>
              <input
                type="date"
                value={enddate}
                onChange={(e) => setEnddate(e.target.value)}
                className="px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>

          <input
            type="file"
            onChange={handleProfileChange}
            className="px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none bg-none outline-none focus:border-blue-500 transition duration-200"
          />

          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={handlesubmit}
              className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-500 border border-transparent rounded-lg font-bold transition duration-200"
            >
              Submit
            </button>
            <button
              type="button"
              className="ml-4 px-6 py-3 text-white bg-red-600 hover:bg-red-500 border border-transparent rounded-lg font-bold transition duration-200"
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
