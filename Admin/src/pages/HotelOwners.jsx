import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { Building2, Search } from "lucide-react";

const HotelOwners = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/admin/owners", { headers: authHeaders });
        if (data.success) setOwners(data.owners);
      } catch {
        toast.error("Failed to load owners");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = owners.filter(
    (o) => o.name?.toLowerCase().includes(search.toLowerCase()) || o.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Hotel Owners</h1>
          <p className="text-slate-500 text-sm mt-0.5">{owners.length} registered owners</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search owners..."
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
            <Building2 size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No owners found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">#</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Owner</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Hotel</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Location</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((owner, i) => (
                  <tr key={owner._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-semibold text-xs">
                          {owner.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-slate-800 font-medium">{owner.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{owner.email}</td>
                    <td className="px-5 py-3.5">
                      {owner.hotel ? (
                        <span className="text-slate-800 font-medium">{owner.hotel.name}</span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No hotel yet</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {owner.hotel ? `${owner.hotel.city}, ${owner.hotel.address}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(owner.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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

export default HotelOwners;
