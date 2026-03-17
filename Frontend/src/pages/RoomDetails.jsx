import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import ContactModal from "../components/ContactModal";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const {id} = useParams();
  const {rooms, token, axios, navigate, user} = useAppContext()
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showContactModal, setShowContactModal] = useState(false);

  const [isAvailable, setIsAvailable] = useState(false)

  //check if the room is Available
  const checkAvailability = async()=>{
    try {
      //check is check-In date is greater than check-our date
      if(checkInDate >= checkOutDate){
        toast.error('Check-In Date should be less than Check-Out Date')
        return;
      }
      const {data} = await axios.post('/api/bookings/check-availability',{room: id, checkInDate, checkOutDate})
      if(data.success){
        if(data.isAvailable){
          setIsAvailable(true)
          toast.success('Room is available')
        }else{
           setIsAvailable(false)
          toast.error('Room is not available')
        }
      }else{
        toast.error(data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
  }

  // onSumitHandler function to check availability & book the room
  const onSumitHandler = async(e)=>{
    try {
      e.preventDefault();
      
      // Check if user is logged in
      if (!user || !token) {
        toast.error('Please login to book a room');
        navigate('/login');
        return;
      }
      
      if(!isAvailable){
        return checkAvailability();
      }else{
        const {data} = await axios.post('/api/bookings/book',{room: id,checkInDate,checkOutDate,guests,paymentMethods:"Pay At Hotel"},{headers :{Authorization: `Bearer ${token}`}})
        if(data.success){
          toast.success(data.message)
          navigate('/my-bookings')
          scrollTo(0,0)
        }else{
          console.log(data.message);
          toast.error(data.message)
        }
      } 
    } catch (error) {
       toast.error(error.message)
    }
  }

  // Fetch reviews for the room
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/room/${id}`);
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      const { data } = await axios.post('/api/reviews', {
        room: id,
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const room = rooms.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
    fetchReviews();
  }, [rooms, id]);

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {showContactModal && (
          <ContactModal 
            hotel={room.hotel} 
            onClose={() => setShowContactModal(false)} 
          />
        )}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="font-inter text-sm">{room.roomType}</span>{" "}
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>
        {/* room rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating rating={averageRating} />
          <p className="ml-2">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
        </div>

        {/* Room address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* Room Image */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Room Image"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="Room Image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Room Price */}
          <p className="text-2xl font-medium">₹{room.pricePerNight}/night</p>
        </div>

        {/* CheckIn CheckOut Form */}
        <form onSubmit={onSumitHandler} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">

          {!user && (
            <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <div className="text-yellow-800 mb-3">
                <span className="text-2xl">🔒</span>
                <p className="text-lg font-medium mt-2">Login Required</p>
                <p className="text-sm">Please login to book this room and access all features</p>
              </div>
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition-all font-medium"
              >
                Login Now
              </button>
            </div>
          )}

          {user && (
            <>
              <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
                  <div className='flex flex-col'>
                    <label htmlFor="checkInDate" className="font-medium">
                    Check-In</label>
                    <input onChange={(e)=>setCheckInDate(e.target.value) } min={new Date().toISOString().split('T')[0]} type="date" id="checkInDate" placeholder="Check-In"
                    className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" required/>
                  </div>
                  <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
                  <div className='flex flex-col'>
                    <label htmlFor="checkOutDate" className="font-medium">
                    Check-Out</label>
                    <input onChange={(e)=>setCheckOutDate(e.target.value) } min={checkInDate} disabled={!checkInDate} type="date" id="checkOutDate" placeholder="Check-Out"
                    className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" required/>
                  </div>
                  <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
                  <div className='flex flex-col'>
                    <label htmlFor="guests" className="font-medium">
                    Guests</label>
                    <input onChange={(e)=>setGuests(e.target.value) } value={guests} type="number" id="guests" placeholder="1"
                    className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" required/>
                  </div>
              </div>

              <button type="submit" className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer">
              {isAvailable? "Book Now" : "Check Availability"}
              </button>
            </>
          )}
        </form>
        {/* Common specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index)=>(
            <div key={index} className="flex items-start gap-2">
              <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5"/>
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.</p>
        </div>

          {/* Hosted by */}
        <div className="flex flex-col items-start gap-4 mb-10">
          <div className="flex gap-4">
            <div>
              <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating rating={averageRating} />
                <p className="ml-2">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              if (!user || !token) {
                toast.error('Please login to contact hotel owner');
                navigate('/login');
                return;
              }
              setShowContactModal(true);
            }}
            className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer"
          >
            Contact Now
          </button>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-300 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-playfair">Guest Reviews</h2>
            {user && (
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull transition-all"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-2xl"
                    >
                      {star <= newReview.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full border border-gray-300 rounded p-3 outline-none"
                  rows="4"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull transition-all"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{review.user?.name || 'Anonymous'}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
