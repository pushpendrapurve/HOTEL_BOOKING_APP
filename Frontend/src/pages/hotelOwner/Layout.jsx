import React,{useEffect} from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const {isOwner, navigate, user} = useAppContext();
  
  useEffect(() => {
    // Only redirect if user is loaded and is not an owner
    if (user && !isOwner) {
      navigate('/');
    }
  }, [isOwner, user, navigate]);
  
  // Show loading or nothing while checking owner status
  if (!user) {
    return null;
  }
  
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
