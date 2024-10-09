"use client";
import React, { useState, useEffect } from "react";
import {BsPersonFill, BsStarFill, BsThreeDotsVertical} from 'react-icons/bs'
import TopCards from "@/components/TopCards";


const Promotions = () => {
    const [promoData, setPromoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cardsData, setCardsData] = useState([
        {
          label: 'Total Promotions',
          value: null,
          loading: true,
          error: null,
        },
        {
          label: 'Promotios responded',
          value: null,
          loading: true,
          error: null,
        },
        {
          label: 'Promotions not responded',
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
          'http://127.0.0.1:5000/DummyWebsite/statistics/totalPromotions',
          (data) => data[1][0].total_promotions
        );
        fetchCardData(
          1,
          'http://127.0.0.1:5000/DummyWebsite/statistics/totalRespondedPromotions',
          (data) => data[1][0].total_responded_promotions
        );
        fetchCardData(
          2,
          'http://127.0.0.1:5000/DummyWebsite/statistics/totalNotRespondedPromotions',
          (data) => data[1][0].total_not_responded_promotions
        );
      }, []);

      useEffect(() => {
        fetch('http://127.0.0.1:5000/DummyWebsite/statistics/topCompaniesPromotionsCount')
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
              setPromoData(itemsArray);
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
                <h2>Promotions</h2>
            </div>
            <TopCards cardsData={cardsData}/>
            <div className="p-4">
                <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
                    <div className="my-3 p-2 grid grid-cols-2 items-center justify-between cursor-pointer">
                        <h1>Top 10 products with most promotions</h1>
                        <span className="text-right">Promotion Count</span>
                    </div>
                    <ul>
                        {promoData.map((item, id) => (
                            <li key={id} className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid grid-cols-2 items-center justify-between cursor-pointer">
                                <div className="flex items-center">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <BsStarFill className="text-purple-800"/>
                                    </div>
                                    <p className="pl-4">{item.promotion_name}</p>
                                </div>
                                <p className="text-gray-600 text-right">{item.num_promotions}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Promotions