import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { Trash2, Search, Users as UsersIcon } from "lucide-react";

const Users = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users", { headers: authHeaders });
      if (data.success) setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/users/${id}`, { headers: authHeaders });
      if (data.success) {
        toast.success("User deleted");
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} registered users</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
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
            <UsersIcon size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">#</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Joined</th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xs">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-slate-800 font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{user.email}</td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
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

export default Users;
