import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AMENITIES_LIST = [
  "Free Wifi",
  "Free Breakfast",
  "Room Service",
  "Mountain View",
  "Pool Access",
];

const EditModal = ({ room, onClose, onSave, axios, token }) => {
  const [inputs, setInputs] = useState({
    roomType: room.roomType,
    pricePerNight: room.pricePerNight,
    amenities: AMENITIES_LIST.reduce((acc, a) => {
      acc[a] = room.amenities.includes(a);
      return acc;
    }, {}),
  });
  const [newImages, setNewImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);
      const amenities = Object.keys(inputs.amenities).filter((k) => inputs.amenities[k]);
      formData.append("amenities", JSON.stringify(amenities));

      const hasNewImages = Object.values(newImages).some(Boolean);
      if (hasNewImages) {
        Object.values(newImages).forEach((file) => {
          if (file) formData.append("images", file);
        });
      }

      const { data } = await axios.put(`/api/rooms/${room._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        // Pass updated fields back so parent can update state without refetch
        onSave({
          roomType: inputs.roomType,
          pricePerNight: +inputs.pricePerNight,
          amenities: Object.keys(inputs.amenities).filter((k) => inputs.amenities[k]),
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Room</h2>
          <button onClick={onClose}>
            <img src={assets.closeIcon} alt="close" className="h-5 w-5 opacity-60 hover:opacity-100" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Images */}
          <p className="text-sm text-gray-700 mb-1">Current Images</p>
          <div className="flex gap-2 mb-4 flex-wrap">
            {room.images.map((img, i) => (
              <img key={i} src={img} alt="room" className="h-16 w-20 object-cover rounded border" />
            ))}
          </div>

          {/* Replace Images */}
          <p className="text-sm text-gray-700 mb-1">Replace Images <span className="text-xs text-gray-400">(optional)</span></p>
          <div className="flex gap-3 mb-4 flex-wrap">
            {Object.keys(newImages).map((key) => (
              <label htmlFor={`editImg${key}`} key={key} className="cursor-pointer">
                <img
                  className="h-13 w-16 object-cover rounded border opacity-80"
                  src={newImages[key] ? URL.createObjectURL(newImages[key]) : assets.uploadArea}
                  alt=""
                />
                <input
                  type="file"
                  accept="image/*"
                  id={`editImg${key}`}
                  hidden
                  onChange={(e) => setNewImages({ ...newImages, [key]: e.target.files[0] })}
                />
              </label>
            ))}
          </div>

          {/* Room Type & Price */}
          <div className="flex gap-4 flex-wrap mb-4">
            <div className="flex-1 min-w-36">
              <p className="text-sm text-gray-700 mb-1">Room Type</p>
              <select
                value={inputs.roomType}
                onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full text-sm"
              >
                <option value="Single Bed">Single Bed</option>
                <option value="Double Bed">Double Bed</option>
                <option value="Luxury Bed">Luxury Bed</option>
                <option value="Family Suite">Family Suite</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-700 mb-1">Price <span className="text-xs">/night</span></p>
              <input
                type="number"
                className="border border-gray-300 rounded p-2 w-24 text-sm"
                value={inputs.pricePerNight}
                onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })}
              />
            </div>
          </div>

          {/* Amenities */}
          <p className="text-sm text-gray-700 mb-1">Amenities</p>
          <div className="flex flex-col gap-1 mb-6 text-gray-500 text-sm">
            {AMENITIES_LIST.map((amenity, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.amenities[amenity]}
                  onChange={() =>
                    setInputs({
                      ...inputs,
                      amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] },
                    })
                  }
                />
                {amenity}
              </label>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm rounded bg-primary text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const { axios, token, user, currency, navigate, isOwner } = useAppContext();

  useEffect(() => {
    if (!user || !token || !isOwner) {
      toast.error("Please login as hotel owner to access this page");
      navigate("/login");
    }
  }, [user, token, isOwner, navigate]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (roomId) => {
    const { data } = await axios.post(
      "/api/rooms/toggle-availability",
      { roomId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (data.success) {
      toast.success(data.message);
      // Flip availability in local state instantly
      setRooms((prev) =>
        prev.map((r) => r._id === roomId ? { ...r, isAvailable: !r.isAvailable } : r)
      );
    } else {
      toast.error(data.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const { data } = await axios.delete(`/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        // Remove from local state instantly
        setRooms((prev) => prev.filter((r) => r._id !== roomId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchRooms();
  }, [user]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Price / night</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Available</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Manage</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{item.roomType}</td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.amenities.join(", ")}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {currency} {item.pricePerNight}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 text-center">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      onChange={() => toggleAvailability(item._id)}
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                    />
                    <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                  </label>
                </td>
                <td className="py-3 px-4 border-t border-gray-300 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditingRoom(item)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(item._id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRoom && (
        <EditModal
          room={editingRoom}
          axios={axios}
          token={token}
          onClose={() => setEditingRoom(null)}
          onSave={(updatedFields) => {
            setRooms((prev) =>
              prev.map((r) =>
                r._id === editingRoom._id ? { ...r, ...updatedFields } : r
              )
            );
            setEditingRoom(null);
          }}
        />
      )}
    </div>
  );
};

export default ListRoom;
