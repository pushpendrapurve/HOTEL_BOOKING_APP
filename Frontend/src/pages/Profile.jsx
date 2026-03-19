import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Profile = () => {
  const { axios, token, user, setUser, navigate } = useAppContext();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setProfile(data.user);
        setName(data.user.name);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      if (newPassword) {
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);
      }

      const { data } = await axios.put("/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setProfile(data.user);
        // Update user in localStorage
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        const updated = { ...stored, name: data.user.name, image: data.user.image };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setImageFile(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const avatarSrc = imagePreview || profile.image || null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-16 px-4">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1">My Profile</h1>
        <p className="text-sm text-gray-400 mb-8">Manage your account details</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-200">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">
                    {profile.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-xs hover:bg-gray-800"
                title="Change photo"
              >
                ✎
              </label>
              <input type="file" id="profileImage" accept="image/*" hidden onChange={handleImageChange} />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">{profile.name}</p>
              <p className="text-sm text-gray-400">{profile.email}</p>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full capitalize">
                {profile.role === "hotelOwner" ? "Hotel Owner" : "User"}
              </span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Your name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            />
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password <span className="text-xs text-gray-400 font-normal">(leave blank to keep current)</span></p>

          {/* Current Password */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="••••••••"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-all disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  ); 
};

export default Profile;
