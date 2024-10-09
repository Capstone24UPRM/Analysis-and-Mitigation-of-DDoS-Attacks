import React from "react";

const TopCards = ({ cardsData }) => {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 h-25">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="bg-white flex flex-col items-center justify-center w-full h-full border p-4 rounded-lg"
          >
            <div className="flex flex-col w-full pb-4 text-center">
              <p className="text-xl font-bold">{card.value}</p>
              <p className="text-gray-600">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default TopCards;