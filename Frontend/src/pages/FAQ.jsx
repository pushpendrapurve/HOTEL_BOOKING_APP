import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const faqs = [
  {
    category: "Bookings",
    icon: "🗓️",
    items: [
      {
        q: "How do I make a booking?",
        a: "Browse available rooms, select your preferred dates and guests, then click 'Book Now'. You'll be guided through a secure checkout process. A confirmation email is sent instantly after payment.",
      },
      {
        q: "Can I modify my booking after confirmation?",
        a: "Yes. Head to 'My Bookings' from your profile menu. You can view booking details there. For changes to dates or room type, please contact the hotel directly using the contact info on your confirmation email.",
      },
      {
        q: "How far in advance can I book?",
        a: "You can book up to 12 months in advance. We recommend booking early for peak seasons and holidays to secure the best rates.",
      },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), UPI, and net banking — all processed securely through Stripe.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We never store your card details. All transactions are encrypted and handled by Stripe, a PCI-DSS Level 1 certified payment processor.",
      },
      {
        q: "When will I be charged?",
        a: "Your card is charged at the time of booking confirmation. You'll receive a payment receipt via email immediately after.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    icon: "↩️",
    items: [
      {
        q: "What is the cancellation policy?",
        a: "Cancellation policies vary by hotel and room type. The specific policy is displayed on the room details page before you confirm your booking.",
      },
      {
        q: "How long do refunds take?",
        a: "Approved refunds are processed within 5–7 business days back to your original payment method. You'll receive an email confirmation once the refund is initiated.",
      },
      {
        q: "What if the hotel cancels my booking?",
        a: "In the rare event a hotel cancels, you'll receive a full refund within 3 business days and our support team will help you find an alternative.",
      },
    ],
  },
  {
    category: "Account & Profile",
    icon: "👤",
    items: [
      {
        q: "How do I update my profile?",
        a: "Click your avatar in the top-right corner and select 'My Profile'. From there you can update your name, profile photo, and password.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "On the login page, click 'Forgot Password' and enter your registered email. You'll receive a reset link within a few minutes.",
      },
      {
        q: "Can I have both a user and hotel owner account?",
        a: "Your account can be upgraded to a hotel owner account by registering your hotel via 'List Your Hotel'. Both roles are managed under the same login.",
      },
    ],
  },
  {
    category: "Hotel Owners",
    icon: "🏨",
    items: [
      {
        q: "How do I list my hotel?",
        a: "After logging in, click 'List Your Hotel' in the navbar. Fill in your hotel details and submit. Once approved, you can start adding rooms from your owner dashboard.",
      },
      {
        q: "How do I manage room availability?",
        a: "In your owner dashboard under 'Room Listings', use the toggle switch next to each room to instantly enable or disable availability.",
      },
      {
        q: "How are payouts handled?",
        a: "Payouts are processed automatically after a guest's check-in date. Funds are transferred to your registered bank account within 3–5 business days.",
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ${open ? "shadow-md" : "hover:shadow-sm"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className={`text-sm font-medium pr-4 ${open ? "text-primary" : "text-gray-800 dark:text-gray-100"}`}>
          {q}
        </span>
        <span
          className={`text-xl text-gray-400 transition-transform duration-300 shrink-0 ${open ? "rotate-45 text-primary" : ""}`}
        >
          +
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
          {a}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { axios } = useAppContext();
  const allCategories = ["All", ...faqs.map((f) => f.category)];
  const filtered = activeCategory === "All" ? faqs : faqs.filter((f) => f.category === activeCategory);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await axios.post("/api/admin/contact", form);
      if (data.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 pt-32 pb-20 px-4 text-center relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 right-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-20 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

        <p className="text-blue-200 text-sm font-medium tracking-widest uppercase mb-3">Help Center</p>
        <h1 className="font-playfair text-4xl md:text-5xl text-white font-semibold mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-blue-100 text-base max-w-xl mx-auto">
          Everything you need to know about booking, payments, and managing your stay.
        </p>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-10 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-4xl mx-auto px-4 py-14 space-y-12">
        {filtered.map((section) => (
          <div key={section.category}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-playfair">{section.category}</h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-2" />
            </div>

            <div className="space-y-3">
              {section.items.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Contact Form */}
        <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <span className="text-3xl">💬</span>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 font-playfair mt-2">Still have questions?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Send us a message and we'll get back to you within 24 hours.</p>
          </div>

          <form onSubmit={handleContact} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                required
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this about?"
                required
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                required
                rows={4}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {sending ? "Sending..." : "Send Message →"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
