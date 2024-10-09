"use client";
import React, { useState, useEffect } from "react";
import TopCards from "@/components/TopCards";
import { GoArrowSwitch } from "react-icons/go";

const Transfers = () => {
    const [transfersData, setTransfersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cardsData, setCardsData] = useState([
        {
          label: 'Total Transfers',
          value: null,
          loading: true,
          error: null,
        },
        {
          label: 'Person who received most transfers',
          value: null,
          loading: true,
          error: null,
        },
        {
          label: 'Person who sent most transfers',
          value: null,
          loading: true,
          error: null,
        },
      ]);
    
      useEffect(() => {
        // Function to fetch data for a card
        const fetchCardData = async (index, apiEndpoint, formatter) => {
          try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${cardsData[index].label}`);
            }
            const data = await response.json();
            // Update the specific card's data
            setCardsData((prevCardsData) => {
              const newCardsData = [...prevCardsData];
              newCardsData[index] = {
                ...newCardsData[index],
                value: formatter(data),
                loading: false,
                error: null,
              };
              return newCardsData;
            });
          } catch (error) {
            setCardsData((prevCardsData) => {
              const newCardsData = [...prevCardsData];
              newCardsData[index] = {
                ...newCardsData[index],
                loading: false,
                error,
              };
              return newCardsData;
            });
          }
        };
    
        // Fetch data for each card
        fetchCardData(
          0,
          'http://127.0.0.1:5000/DummyWebsite/statistics/totalTransfers',
          (data) => data[1][0].total_transfers
        );
        fetchCardData(
          1,
          'http://127.0.0.1:5000/DummyWebsite/statistics/receivedMostTransfers',
          (data) => data[1][0].first_name + ' ' + data[1][0].last_name
        );
        fetchCardData(
          2,
          'http://127.0.0.1:5000/DummyWebsite/statistics/sentMostTransfers',
          (data) => data[1][0].first_name + ' ' + data[1][0].last_name
        );
      }, []);

      useEffect(() => {
        fetch('http://127.0.0.1:5000/DummyWebsite/statistics/largestTransfers')
          .then(response => {
            if (response.ok) {
              return response.json(); // Parse the response data as JSON
            } else {
              throw new Error('API request failed');
            }
          })
          .then(data => {
            if (data[0].status === "success") {
              const itemsArray = data[1];
              setTransfersData(itemsArray);
            } else {
              throw new Error('API returned an error status');
            }
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            setError(error);
            setLoading(false);
          });
      }, []);

      if (loading) {
        return (
          <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <p>Loading...</p>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <p>Error: {error.message}</p>
          </div>
        );
      }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex justify-between p-4">
                <h2>People</h2>
            </div>
            <TopCards cardsData={cardsData}/>
            <div className="p-4">
                <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-autolg:h-[70vh] h-[50vh] overflow-scroll">
                    <span>Top 10 highest transfers</span>
                <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
                         <span>Amount</span>
                         <span className="sm:text-left text-right">Sender</span>
                         <span className="hidden md:grid">Receipient</span>
                         <span className="hidden sm:grid">Date</span>
                    </div>
                    <ul>
                        {transfersData.map((transfer, id) => (
                            <li key={id} className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
                                <div className="flex items-center">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <GoArrowSwitch className="text-purple-800"/>
                                    </div>
                                    <div className="pl-4">
                                    <p className="text-gray-800 font-bold">{transfer.amount}</p>
                                    </div>
                                </div>
                                <p className="text-gray-800 font-bold sm:text-left text-right">{transfer.sender_first_name + ' ' + transfer.sender_last_name}</p>
                                <p className="text-gray-800 font-bold hidden md:flex">{transfer.recipient_first_name + ' ' + transfer.recipient_last_name}</p>
                                <p className="text-gray-600 sm:flex hidden justify-between items-center">{new Date(transfer.date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Transfers