import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import HotelCard from "../components/HotelCard";

const moods = [
  {
    id: "romantic",
    label: "Romantic",
    emoji: "🌹",
    tagline: "Just the two of you",
    description: "Intimate escapes with luxury suites, pool access & room service",
    gradient: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-700",
    textColor: "text-rose-600 dark:text-rose-400",
    activeBg: "bg-gradient-to-br from-rose-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    filter: (room) =>
      (room.roomType === "Luxury Bed" || room.roomType === "Double Bed") &&
      (room.amenities.includes("Pool Access") || room.amenities.includes("Room Service")),
  },
  {
    id: "adventure",
    label: "Adventure",
    emoji: "🏔️",
    tagline: "Thrill seeker's paradise",
    description: "Mountain views, scenic stays & budget-friendly options",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-700",
    textColor: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    filter: (room) =>
      room.amenities.includes("Mountain View") || room.pricePerNight <= 4000,
  },
  {
    id: "family",
    label: "Family",
    emoji: "👨‍👩‍👧‍👦",
    tagline: "Memories for everyone",
    description: "Spacious family suites with breakfast & all-day room service",
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-700",
    textColor: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    filter: (room) =>
      room.roomType === "Family Suite" ||
      (room.amenities.includes("Free Breakfast") && room.amenities.includes("Room Service")),
  },
  {
    id: "solo",
    label: "Solo",
    emoji: "🎒",
    tagline: "Your journey, your rules",
    description: "Cozy single rooms with free wifi to stay connected",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-700",
    textColor: "text-violet-600 dark:text-violet-400",
    activeBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    filter: (room) =>
      room.roomType === "Single Bed" && room.amenities.includes("Free Wifi"),
  },
  {
    id: "luxury",
    label: "Luxury",
    emoji: "👑",
    tagline: "Nothing but the finest",
    description: "Premium suites with every amenity you could dream of",
    gradient: "from-yellow-500 to-amber-600",
    lightBg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-700",
    textColor: "text-yellow-600 dark:text-yellow-400",
    activeBg: "bg-gradient-to-br from-yellow-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    filter: (room) =>
      room.roomType === "Luxury Bed" && room.pricePerNight >= 6000,
  },
  {
    id: "budget",
    label: "Budget",
    emoji: "💰",
    tagline: "Smart stays, big savings",
    description: "Great value rooms with free wifi & breakfast included",
    gradient: "from-sky-500 to-blue-600",
    lightBg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-200 dark:border-sky-700",
    textColor: "text-sky-600 dark:text-sky-400",
    activeBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    filter: (room) =>
      room.pricePerNight <= 3000 && room.amenities.includes("Free Wifi"),
  },
];

const TripMood = () => {
  const { rooms, navigate } = useAppContext();
  const [selectedMood, setSelectedMood] = useState(null);

  const activeMood = moods.find((m) => m.id === selectedMood);

  const filteredRooms = useMemo(() => {
    if (!activeMood) return [];
    return rooms.filter(activeMood.filter).slice(0, 6);
  }, [selectedMood, rooms]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-20">

      {/* Hero */}
      <div className="text-center px-4 mb-14">
        <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
          New Feature
        </span>
        <h1 className="font-playfair text-4xl md:text-6xl text-gray-900 dark:text-white font-bold leading-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">Perfect Trip</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4 text-base md:text-lg max-w-xl mx-auto">
          Tell us how you're feeling and we'll match you with the perfect stay. No filters, just vibes.
        </p>
      </div>

      {/* How it works */}
      <div className="px-4 md:px-16 lg:px-24 xl:px-32 mb-14">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-primary mb-6">How Trip Mood Works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl">🎭</div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">1. Pick Your Mood</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Choose from 6 travel vibes — Romantic, Adventure, Family, Solo, Luxury, or Budget. Each mood represents a different travel style.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl">🔍</div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">2. Smart Matching</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                We instantly scan all available rooms and match them based on room type, amenities, and price range that fit your chosen vibe.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl">🏨</div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">3. Book Instantly</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Browse your curated results and book directly. No endless scrolling, no confusing filters — just the right rooms for you.
              </p>
            </div>

          </div>

          {/* Mood logic breakdown */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">What each mood looks for</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { emoji: "🌹", label: "Romantic", criteria: "Luxury/Double Bed · Pool Access · Room Service" },
                { emoji: "🏔️", label: "Adventure", criteria: "Mountain View · Budget-friendly · Under ₹4000" },
                { emoji: "👨‍👩‍👧‍👦", label: "Family", criteria: "Family Suite · Free Breakfast · Room Service" },
                { emoji: "🎒", label: "Solo", criteria: "Single Bed · Free Wifi · Compact & cozy" },
                { emoji: "👑", label: "Luxury", criteria: "Luxury Bed · All amenities · Above ₹6000" },
                { emoji: "💰", label: "Budget", criteria: "Under ₹3000 · Free Wifi · Best value" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                  <span className="text-xl mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{item.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{item.criteria}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mood Grid */}
      <div className="px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {moods.map((mood) => {
            const isActive = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(isActive ? null : mood.id)}
                className={`relative group flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
                  ${isActive
                    ? `${mood.activeBg} border-transparent text-white shadow-lg scale-105`
                    : `${mood.lightBg} ${mood.border} hover:scale-105 hover:shadow-md`
                  }`}
              >
                {/* bg image on hover */}
                {!isActive && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url(${mood.image})` }}
                  />
                )}
                <span className="text-3xl">{mood.emoji}</span>
                <span className={`text-sm font-semibold ${isActive ? "text-white" : mood.textColor}`}>
                  {mood.label}
                </span>
                <span className={`text-xs text-center leading-tight ${isActive ? "text-white/80" : "text-gray-400 dark:text-gray-500"}`}>
                  {mood.tagline}
                </span>
                {isActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Results Section */}
        {!selectedMood && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4 animate-bounce">👆</div>
            <p className="text-xl font-playfair text-gray-700 dark:text-gray-300">Pick a mood to get started</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm">We'll find the perfect rooms just for you</p>
          </div>
        )}

        {selectedMood && (
          <div className="animate-[fadeIn_0.4s_ease-in-out]">
            {/* Mood Banner */}
            <div className={`relative rounded-3xl overflow-hidden mb-10 h-52 md:h-64`}>
              <img
                src={activeMood.image}
                alt={activeMood.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 flex items-center px-8 md:px-14">
                <div>
                  <p className="text-white/70 text-sm uppercase tracking-widest mb-1">{activeMood.tagline}</p>
                  <h2 className="font-playfair text-3xl md:text-5xl text-white font-bold">
                    {activeMood.emoji} {activeMood.label} Stays
                  </h2>
                  <p className="text-white/80 mt-2 text-sm md:text-base max-w-md">{activeMood.description}</p>
                </div>
              </div>
            </div>

            {/* Room Cards */}
            {filteredRooms.length > 0 ? (
              <>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Found <span className="font-semibold text-gray-800 dark:text-gray-200">{filteredRooms.length}</span> rooms matching your vibe
                </p>
                <div className="flex flex-wrap gap-6 justify-start">
                  {filteredRooms.map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <button
                    onClick={() => navigate("/rooms")}
                    className={`px-8 py-3 rounded-full text-white font-medium text-sm bg-gradient-to-r ${activeMood.gradient} hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                  >
                    Explore All Rooms →
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="text-5xl mb-4">😔</div>
                <p className="text-xl font-playfair text-gray-700 dark:text-gray-300">No rooms found for this mood</p>
                <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm">Try another vibe or browse all rooms</p>
                <button
                  onClick={() => navigate("/rooms")}
                  className="mt-6 px-6 py-2.5 rounded-full bg-primary text-white text-sm hover:bg-primary/90 transition-all"
                >
                  Browse All Rooms
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripMood;
