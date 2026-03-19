import React, { useState } from 'react';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const ContactModal = ({ hotel, onClose }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use owner's email instead of hotel contact (which is a phone number)
    const ownerEmail = hotel.owner?.email;
    
    if (!ownerEmail) {
      toast.error("Hotel owner email not available");
      return;
    }
    
    // Create mailto link
    const subject = encodeURIComponent(`Inquiry about ${hotel.name}`);
    const body = encodeURIComponent(message);
    const mailtoLink = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    toast.success("Opening your email client...");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <img src={assets.closeIcon} alt="close" className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-playfair mb-4 dark:text-gray-100">Contact {hotel.name}</h2>
        
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            <span className="font-medium">Address:</span> {hotel.address}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <span className="font-medium">Contact:</span> {hotel.contact}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded p-3 outline-none"
            rows="5"
            placeholder="Write your message here..."
            required
          />
          
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull transition-all"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
