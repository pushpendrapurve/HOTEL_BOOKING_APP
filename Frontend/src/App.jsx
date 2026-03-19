import React from 'react'
import Navbar from './components/Navbar'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import ForgotPassword from './pages/ForgotPassword';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import LoginRegisterModal from './pages/LoginRegisterModal';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';
import Loader from './components/Loader';


const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");
  const {showHotelReg} = useAppContext();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <Toaster />
    {!isOwnerPath && <Navbar/>} 
    { showHotelReg && <HotelReg/>}
    <div className="min-h-[70vh]">
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/rooms' element={<AllRooms/>}/>
        <Route path='/rooms/:id' element={<RoomDetails/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/faq' element={<FAQ/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/loader/:nextUrl' element={<Loader/>}/>
        <Route path='/login' element={<LoginRegisterModal/>}/>
        <Route path='/register' element={<LoginRegisterModal/>}/>
        <Route path='/owner' element={<Layout/>}>
          <Route index element={<Dashboard/>} />
          <Route path='add-room' element={<AddRoom/>} />
          <Route path='list-room' element={<ListRoom/>} />
        </Route>
    </Routes>
    </div>
    <Footer/>
    </div>
  )
}

export default App
