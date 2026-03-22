import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { Trash2, Search, Hotel as HotelIcon, BedDouble, CheckCircle, XCircle } from "lucide-react";

const Hotels = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get("/api/admin/hotels", { headers: authHeaders });
      if (data.success) setHotels(data.hotels);
    } catch {
      toast.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleApprove = async (id) => {
    try {
      const { data } = await axios.patch(`/api/admin/hotels/${id}/approve`, {}, { headers: authHeaders });
      if (data.success) {
        toast.success("Hotel approved");
        setHotels((prev) => prev.map((h) => h._id === id ? { ...h, isApproved: true } : h));
      }
    } catch { toast.error("Failed to approve"); }
  };

  const handleReject = async (id) => {
    try {
      const { data } = await axios.patch(`/api/admin/hotels/${id}/reject`, {}, { headers: authHeaders });
      if (data.success) {
        toast.success("Hotel rejected");
        setHotels((prev) => prev.map((h) => h._id === id ? { ...h, isApproved: false } : h));
      }
    } catch { toast.error("Failed to reject"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this hotel and all its rooms?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/hotels/${id}`, { headers: authHeaders });
      if (data.success) {
        toast.success("Hotel deleted");
        setHotels((prev) => prev.filter((h) => h._id !== id));
      }
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = hotels.filter(
    (h) => h.name?.toLowerCase().includes(search.toLowerCase()) || h.city?.toLowerCase().includes(search.toLowerCase())
  );

  const pending = hotels.filter((h) => !h.isApproved).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Hotels
            {pending > 0 && (
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">{pending} pending</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{hotels.length} listed properties</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotels..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 w-56" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <HotelIcon size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No hotels found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">#</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Hotel</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Location</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Owner</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Rooms</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Contact</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((hotel, i) => (
                  <tr key={hotel._id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${!hotel.isApproved ? "bg-amber-50/40" : ""}`}>
                    <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {hotel.images?.[0] ? (
                          <img src={hotel.images[0]} alt={hotel.name} className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <HotelIcon size={15} className="text-indigo-500" />
                          </div>
                        )}
                        <span className="text-slate-800 font-medium">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{hotel.city}</td>
                    <td className="px-5 py-3.5 text-slate-500">{hotel.ownerDetails?.name || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-slate-600">
                        <BedDouble size={13} className="text-indigo-400" />
                        {hotel.roomCount}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{hotel.contact || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${hotel.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {hotel.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {!hotel.isApproved ? (
                          <button onClick={() => handleApprove(hotel._id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all">
                            <CheckCircle size={13} /> Approve
                          </button>
                        ) : (
                          <button onClick={() => handleReject(hotel._id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                            <XCircle size={13} /> Revoke
                          </button>
                        )}
                        <button onClick={() => handleDelete(hotel._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
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

export default Hotels;
