import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Hotel, BedDouble,
  CalendarCheck, Mail, Shield, X, MessageSquare,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/users", label: "Users", icon: Users },
  { to: "/owners", label: "Hotel Owners", icon: Building2 },
  { to: "/hotels", label: "Hotels", icon: Hotel },
  { to: "/rooms", label: "Rooms", icon: BedDouble },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/newsletter", label: "Newsletter", icon: Mail },
  { to: "/contacts", label: "Contact Messages", icon: MessageSquare },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-white/5 z-30 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">StayHere</p>
              <p className="text-indigo-400 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/5">
          <p className="text-slate-600 text-xs">v1.0.0 · StayHere Admin</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
