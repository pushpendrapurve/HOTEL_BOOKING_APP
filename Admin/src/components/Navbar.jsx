import React from "react";
import { Menu, LogOut, Shield } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const Navbar = ({ onMenuClick }) => {
  const { admin, logout } = useAdmin();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden lg:block">
          <h2 className="text-slate-800 font-semibold text-sm">Admin Dashboard</h2>
          <p className="text-slate-400 text-xs">Manage your platform</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-slate-800 text-sm font-medium leading-none">{admin?.name}</p>
            <p className="text-slate-400 text-xs mt-0.5">{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 text-sm transition-all"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
