import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { CalendarCheck, Search } from "lucide-react";

const statusBadge = (isPaid, isCancel) => {
  if (isCancel) return "bg-red-100 text-red-600";
  if (isPaid) return "bg-emerald-100 text-emerald-700";
  return "bg-amber-100 text-amber-700";
};

const statusLabel = (isPaid, isCancel) => {
  if (isCancel) return "Cancelled";
  if (isPaid) return "Paid";
  return "Pending";
};

const Bookings = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/admin/bookings", { headers: authHeaders });
        if (data.success) setBookings(data.bookings);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = bookings.filter(
    (b) =>
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.hotel?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.room?.roomType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bookings</h1>
          <p className="text-slate-500 text-sm mt-0.5">{bookings.length} total bookings</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
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
            <CalendarCheck size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">#</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Guest</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Hotel</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Room</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Check-in</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Check-out</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-800 font-medium">{b.user?.name || "Unknown"}</p>
                      <p className="text-slate-400 text-xs">{b.user?.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-700">{b.hotel?.name || "—"}</p>
                      <p className="text-slate-400 text-xs">{b.hotel?.city}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{b.room?.roomType || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {b.checkInDate ? new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-800 font-medium">₹{b.totalPrice?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(b.isPaid, b.isCancel)}`}>
                        {statusLabel(b.isPaid, b.isCancel)}
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

export default Bookings;
