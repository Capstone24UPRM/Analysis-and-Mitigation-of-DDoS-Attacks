"use client";
import React, { useState, useEffect } from "react";
import TopCards from "@/components/TopCards";
import BarChart from "@/components/barchart";
import RecentTransfers from "@/components/recentTransfers";

export default function Home() {

  const [cardsData, setCardsData] = useState([
    {
      label: 'Store with most transactions',
      value: null,
      loading: true,
      error: null,
    },
    {
      label: 'Most used Device',
      value: null,
      loading: true,
      error: null,
    },
    {
      label: 'Customer with highest spending',
      value: null,
      loading: true,
      error: null,
    },
  ]);

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Transactions",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

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
      'http://127.0.0.1:5000/DummyWebsite/statistics/storeMostTransactions',
      (data) => data[1][0].store
    );
    fetchCardData(
      1,
      'http://127.0.0.1:5000/DummyWebsite/statistics/mostUsedDevice',
      (data) => data[1][0].device
    );
    fetchCardData(
      2,
      'http://127.0.0.1:5000/DummyWebsite/statistics/highestSpendingCustomer',
      (data) => `${data[1][0].first_name} ${data[1][0].last_name}`
    );

    // Function to fetch chart data for the bar chart
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/DummyWebsite/statistics/storeTransactionCounts"
        ); // Use your actual API endpoint here
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const data = await response.json();
        const labels = data[1].map((item) => item.store);
        const transactions = data[1].map((item) => item.num_transactions);

        // Update the bar chart data
        setBarData({
          labels: labels,
          datasets: [
            {
              label: "Number of Transactions per Store",
              data: transactions,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    // Fetch chart data
    fetchChartData();

  }, []);



  return (
    <div>
      <main className='bg-gray-100 min-h-screen'>
      <div className="flex justify-between px-4 pt-4">
            <h2>Dashboard</h2>
        </div>
        <TopCards cardsData={cardsData}/>
        <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
          <BarChart data={barData}/>
          <RecentTransfers />
        </div>
      </main>
    </div>
  );
}
