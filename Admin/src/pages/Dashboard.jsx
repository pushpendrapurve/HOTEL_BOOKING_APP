import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import {
  Users, Building2, Hotel, BedDouble, CalendarCheck, DollarSign, Mail, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/admin/dashboard", { headers: authHeaders });
        if (data.success) {
          setStats(data.stats);
          setRecentBookings(data.recentBookings);
          const filled = MONTHS.map((name, i) => {
            const found = data.monthlyBookings.find((m) => m._id === i + 1);
            return { name, bookings: found?.count || 0, revenue: found?.revenue || 0 };
          });
          setChartData(filled);
        }
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cards = [
    { icon: Users, label: "Total Users", value: stats?.totalUsers ?? 0, color: "bg-blue-500", sub: "Registered users" },
    { icon: Building2, label: "Hotel Owners", value: stats?.totalOwners ?? 0, color: "bg-violet-500", sub: "Active owners" },
    { icon: Hotel, label: "Hotels", value: stats?.totalHotels ?? 0, color: "bg-indigo-500", sub: "Listed properties" },
    { icon: BedDouble, label: "Rooms", value: stats?.totalRooms ?? 0, color: "bg-cyan-500", sub: "Available rooms" },
    { icon: CalendarCheck, label: "Bookings", value: stats?.totalBookings ?? 0, color: "bg-emerald-500", sub: "All time" },
    { icon: DollarSign, label: "Revenue", value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, color: "bg-amber-500", sub: "Paid bookings" },
    { icon: Mail, label: "Subscribers", value: stats?.subscribers ?? 0, color: "bg-pink-500", sub: "Newsletter" },
    { icon: TrendingUp, label: "Avg. Booking", value: stats?.totalBookings ? `₹${Math.round((stats?.totalRevenue ?? 0) / stats.totalBookings).toLocaleString()}` : "₹0", color: "bg-rose-500", sub: "Per booking" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-0.5">Platform-wide statistics at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Chart + Recent Bookings */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-slate-800 font-semibold mb-4">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar dataKey="bookings" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-slate-800 font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-8">No bookings yet</p>
            )}
            {recentBookings.map((b) => (
              <div key={b._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <CalendarCheck size={14} className="text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-800 text-xs font-medium truncate">{b.user?.name || "Unknown"}</p>
                  <p className="text-slate-500 text-xs truncate">{b.hotel?.name} · {b.room?.roomType}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${b.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {b.isPaid ? "Paid" : "Pending"}
                    </span>
                    <span className="text-xs text-slate-400">₹{b.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
