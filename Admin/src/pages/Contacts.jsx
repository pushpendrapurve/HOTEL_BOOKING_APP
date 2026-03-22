import React, { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { MessageSquare, Trash2, Search, MailOpen, Mail } from "lucide-react";

const Contacts = () => {
  const { axios, authHeaders, toast } = useAdmin();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get("/api/admin/contacts", { headers: authHeaders });
      if (data.success) setContacts(data.contacts);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleOpen = async (contact) => {
    setSelected(contact);
    if (!contact.isRead) {
      await axios.patch(`/api/admin/contacts/${contact._id}/read`, {}, { headers: authHeaders });
      setContacts((prev) => prev.map((c) => c._id === contact._id ? { ...c, isRead: true } : c));
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this message?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/contacts/${id}`, { headers: authHeaders });
      if (data.success) {
        toast.success("Deleted");
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selected?._id === id) setSelected(null);
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const unread = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Contact Messages
            {unread > 0 && (
              <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">{unread} new</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{contacts.length} total messages</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 w-56"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <MessageSquare size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((c) => (
                <div
                  key={c._id}
                  onClick={() => handleOpen(c)}
                  className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors
                    ${selected?._id === c._id ? "bg-indigo-50 border-l-2 border-indigo-500" : ""}
                    ${!c.isRead ? "bg-indigo-50/40" : ""}`}
                >
                  <div className={`mt-0.5 shrink-0 ${!c.isRead ? "text-indigo-500" : "text-slate-300"}`}>
                    {c.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${!c.isRead ? "font-semibold text-slate-800" : "font-medium text-slate-700"}`}>
                        {c.name}
                      </p>
                      <span className="text-xs text-slate-400 shrink-0">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{c.subject}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.message}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(c._id, e)}
                    className="shrink-0 p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{selected.subject}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    From <span className="text-slate-700 font-medium">{selected.name}</span> · {selected.email}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(selected.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(selected._id, e)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="h-px bg-slate-100" />
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              <div className="pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-xl transition-colors"
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-48 text-slate-400">
              <MessageSquare size={36} className="mb-3 opacity-20" />
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
