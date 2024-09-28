"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SHA256 from "crypto-js/sha256";
import HashStorage from "../../contract/HashStorage.json";
import Loader from "../../Components/Loader/page";

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
    <section className="min-h-screen flex items-center justify-center">
    <div className="bg-gray-800 bg-opacity-30 shadow-lg rounded-lg p-8 w-11/12 md:w-8/12 lg:w-6/12">
      <h1 className="text-center text-4xl text-red-400 mb-6 font-bold">Document Upload</h1>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col ">
          <label className=" mb-2 text-sm font-semibold text-black" htmlFor="documentType">Select Document Type</label>
          <select
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 outline-red-400 bg-gray-200 border border-gray-400 rounded-md focus:outline-none "
          >
            <option value="">Select Document Type</option>
            <option value="Birth Certificate">Birth Certificate</option>
            <option value="Mark Sheet Class 10th">Mark Sheet Class 10th</option>
            <option value="Mark Sheet Class 12th">Mark Sheet Class 12th</option>
            <option value="PAN Card">PAN Card</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-black mb-2" htmlFor="recipientName">Recipient Email</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Recipient name"
            className="w-full px-4 py-3 text-gray-900 bg-gray-200 border outline-red-400 border-gray-400 rounded-md focus:outline-none "
          />
        </div>

        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold text-black mb-2" htmlFor="issuingDate">Issuing Date</label>
            <input
              type="date"
              value={startdate}
              onChange={(e) => setStartdate(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 bg-gray-200 border outline-red-400 border-gray-400 rounded-md focus:outline-none "
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className=" mb-2 text-sm font-semibold text-black" htmlFor="fileUpload">Upload File</label>
          <input
            type="file"
            onChange={handleProfileChange}
            className="w-full px-4 py-3 text-gray-900 bg-gray-200 border border-gray-400 rounded-md focus:outline-none outline-red-400"
          />
        </div>

        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            onClick={handlesubmit}
            className="w-full md:w-auto px-6 py-3 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-500 transition duration-300"
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
