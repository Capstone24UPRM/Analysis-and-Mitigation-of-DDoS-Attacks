"use client";  // This ensures it's a client component
import React, { useState, useEffect } from "react";
import {BsPersonFill, BsThreeDotsVertical} from 'react-icons/bs'
import TopCards from "@/components/TopCards";

const People  = () => {
    const [peopleData, setPeopleData] = useState([]);
    const [loading, setLoading] = useState(true); // Optional loading state
    const [error, setError] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [cardsData, setCardsData] = useState([
        {
          label: 'Total Users',
          value: null,
          loading: true,
          error: null,
        },
        {
          label: 'Country with most users',
          value: null,
          loading: true,
          error: null,
        },
        {
          label: 'City with most users',
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
          'http://127.0.0.1:5000/DummyWebsite/statistics/customerCount',
          (data) => data[1][0].num_people
        );
        fetchCardData(
          1,
          'http://127.0.0.1:5000/DummyWebsite/statistics/countryMostUsers',
          (data) => data[1][0].country
        );
        fetchCardData(
          2,
          'http://127.0.0.1:5000/DummyWebsite/statistics/cityMostUsers',
          (data) => data[1][0].city
        );
      }, []);

      
    useEffect(() => {
        fetch('http://127.0.0.1:5000/DummyWebsite/statistics/getAllPeople')
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
              setPeopleData(itemsArray);
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

    const filteredPeople = peopleData.filter((person) => {
        const fullName = `${person.first_name} ${person.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex justify-between p-4">
                <h2>People</h2>
            </div>
            <TopCards cardsData={cardsData}/>
            <div className="p-4">
                <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-autolg:h-[70vh] h-[50vh] overflow-scroll">
                <div className="my-3 p-2">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                    </div>
                    <ul>
                        {filteredPeople.map((person, id) => (
                            <li key={id} className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
                                <div className="flex items-center">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <BsPersonFill className="text-purple-800"/>
                                    </div>
                                    <div className="pl-4">
                                    <p className="text-gray-800 font-bold">{person.first_name + ' ' + person.last_name}</p>
                                    <p className="text-gray-400 text-sm">{person.email}</p>
                                    <p className="text-gray-400 text-sm">{person.telephone}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 sm:text-left text-right">{person.city + ', ' + person.country}</p>
                                <p className="hidden sm:flex">{Array.isArray(person.devices) ? person.devices.join(', '): person.devices}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default People