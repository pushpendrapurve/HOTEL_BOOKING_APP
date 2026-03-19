import React from "react";
import { Link } from "react-router-dom";
import { assets, maxGuestsMap } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  return (
    <Link
      to={"/rooms/" + room._id}
      onClick={() => scrollTo(0, 0)}
      key={room.id}
      className="group relative w-72 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl dark:shadow-gray-900 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={room.images[0]}
          alt={room.hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badge */}
        {index % 2 === 0 && (
          <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Best Seller
          </span>
        )}

        {/* Room type pill */}
        <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
          {room.roomType}
        </span>


      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-playfair text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight line-clamp-1">
            {room.hotel.name}
          </p>
          <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-900/30 text-amber-500 text-xs font-semibold px-2 py-0.5 rounded-full">
            <img src={assets.starIconFilled} alt="star" className="w-3 h-3" />
            4.5
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs mt-1.5">
          <img src={assets.locationIcon} alt="location" className="w-3.5 h-3.5 opacity-60" />
          <span className="line-clamp-1">{room.hotel.address}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">₹{room.pricePerNight}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500"> /night</span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Up to {maxGuestsMap[room.roomType] || 2} guest{(maxGuestsMap[room.roomType] || 2) > 1 ? "s" : ""}
            </p>
          </div>
          <span className="px-3.5 py-1.5 text-xs font-semibold bg-black dark:bg-primary text-white rounded-lg group-hover:bg-primary dark:group-hover:bg-primary/80 transition-colors duration-300 cursor-pointer">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
