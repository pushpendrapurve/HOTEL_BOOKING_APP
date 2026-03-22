import React,{useEffect} from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Clock } from 'lucide-react'

const Layout = () => {
  const {isOwner, navigate, user, hotelApproved, hasPendingHotel} = useAppContext();
  
  useEffect(() => {
    // Redirect only if logged in but has no hotel at all
    if (user && !isOwner && !hotelApproved && !hasPendingHotel) {
      navigate('/');
    }
  }, [isOwner, hotelApproved, hasPendingHotel, user, navigate]);
  
  if (!user) return null;

  // Show pending approval screen only for users with a pending hotel
  if (hasPendingHotel && !hotelApproved) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock size={30} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Approval Pending</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            Your hotel registration has been submitted successfully. Our admin team is reviewing your details. You'll get access to your dashboard once approved.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-amber-700 dark:text-amber-400 text-sm">
            ⏳ Usually takes 24–48 hours
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 text-sm text-primary hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Not approved and not pending — redirect will handle it, show nothing meanwhile
  if (!isOwner && !hotelApproved) return null;
  
  return (
    <div className='flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100'>
      <Navbar/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar/>
        <div className='flex-1 p-4 pt-10 md:px-10 overflow-y-auto'>
          <Outlet/>  
        </div>
      </div>
    </div>
  )
}

export default Layout
