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
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex h-full'>
        <Sidebar/>
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
          <Outlet/>  
        </div>
      </div>
    </div>
  )
}

export default Layout
