import React, { useCallback, useEffect } from 'react';
import s from './MainContainer.module.css';
import { Outlet } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import MessageCookies from 'Components/MessageCookies';
import { useDispatch, useSelector } from 'react-redux';
import API from 'API';
import { setContacts } from 'store/slice/contacts';

const MainContainer = ({setActive, active}) => {

   const dispatch=useDispatch();

   const getItem = useCallback(async () => {
      try {
         const data = await API.getContent(3646)
         dispatch(setContacts(data));
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } 
   })

   useEffect(() => {
      getItem();
   }, []);

   return (
      <div>
         <Header setActive={setActive} active={active}/>
         <MessageCookies />
         <Outlet/>
         <Footer/>
      </div>
   )
}
export default MainContainer;