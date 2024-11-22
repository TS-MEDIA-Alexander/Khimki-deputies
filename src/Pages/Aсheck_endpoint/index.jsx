import React, { useState } from 'react';
import s from './Aсheck_endpoint.module.css';
import ContantContainerMain from '../../total/ContantContainerMain';
import API from '../../API';


const Aсheck_endpoint = (props) => {

   const end_point = () => {
      API.end_point()
   }

   const delaraEnd_point = () => {
      API.delaraEnd_point()
   }

   const delaraPublicEnd_point = () => {
      API.delaraPublicEnd_point()
   }

   return (
      <div>
         <ContantContainerMain>
            <br />
            <br />
            <br />
            <br />
            <div className="rowBlock">
               <button onClick={end_point} className={s.btnG}>https://admhimki.ru/end_point.php </button>
               <button onClick={delaraEnd_point} className={s.btnB}>https://admhimki.ru/delara/end_point.php </button>
               <button onClick={delaraPublicEnd_point} className={s.btnM}>https://admhimki.ru/delara/public/end_point.php </button>
            </div>

         </ContantContainerMain>
      </div>
   )
}
export default Aсheck_endpoint;