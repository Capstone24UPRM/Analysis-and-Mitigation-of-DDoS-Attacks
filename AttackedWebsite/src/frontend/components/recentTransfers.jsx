import React, { useState, useEffect } from "react";
import {FaShoppingBag} from 'react-icons/fa'
import { GoArrowSwitch } from "react-icons/go";

const RecentTransfers = () => {
    const [transfersData, setTransfersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/DummyWebsite/statistics/transfersByDate')
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
        <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
            <h1>All transfers ordered from most recent</h1>
            <ul>
                {transfersData.map((transfer, id) => (
                    <li key={id} className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer">
                        <div className="bg-purple-100 rounded-lg p-3">
                            <GoArrowSwitch className="text-purple-800"/>
                        </div>
                        <div className="pl-4">
                            <p className="text-gray-800 font-bold">${transfer.amount}</p>
                        </div>
                        <p className="lg:flex md:hidden absolute right-6 text-sm">{new Date(transfer.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RecentTransfers