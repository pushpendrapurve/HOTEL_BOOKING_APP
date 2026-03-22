import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { BedDouble, Search } from "lucide-react";

const Rooms = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/admin/rooms", { headers: authHeaders });
        if (data.success) setRooms(data.rooms);
      } catch {
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = rooms.filter(
    (r) =>
      r.roomType?.toLowerCase().includes(search.toLowerCase()) ||
      r.hotel?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Rooms</h1>
          <p className="text-slate-500 text-sm mt-0.5">{rooms.length} total rooms</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 w-56"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <BedDouble size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No rooms found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">#</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Room</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Hotel</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">City</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Price/Night</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Amenities</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((room, i) => (
                  <tr key={room._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {room.images?.[0] ? (
                          <img src={room.images[0]} alt={room.roomType} className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <BedDouble size={14} className="text-cyan-500" />
                          </div>
                        )}
                        <span className="text-slate-800 font-medium">{room.roomType}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{room.hotel?.name || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-500">{room.hotel?.city || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-800 font-medium">₹{room.pricePerNight?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities?.slice(0, 3).map((a) => (
                          <span key={a} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                        {room.amenities?.length > 3 && (
                          <span className="text-xs text-slate-400">+{room.amenities.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${room.isAvailable !== false ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {room.isAvailable !== false ? "Available" : "Unavailable"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
