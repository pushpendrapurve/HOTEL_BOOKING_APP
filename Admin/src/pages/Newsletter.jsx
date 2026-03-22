import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { Mail, Search } from "lucide-react";

const Newsletter = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/admin/newsletter", { headers: authHeaders });
        if (data.success) setSubscribers(data.subscribers);
      } catch {
        toast.error("Failed to load subscribers");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = subscribers.filter((s) =>
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Newsletter Subscribers</h1>
          <p className="text-slate-500 text-sm mt-0.5">{subscribers.length} subscribers</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email..."
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
            <Mail size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">#</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Subscribed On</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => (
                  <tr key={sub._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <Mail size={13} className="text-pink-500" />
                        </div>
                        <span className="text-slate-700">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
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

export default Newsletter;
