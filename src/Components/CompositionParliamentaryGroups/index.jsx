import React, { useCallback, useEffect, useState } from 'react';
import s from './CompositionParliamentaryGroups.module.css';
import edinyaRossiaParty from '../../assets/icons/edinyaRossiaParty.svg';
import API from 'API';

const CompositionParliamentaryGroups = ({ isActive }) => {

   const [data, setData] = useState({})

   const getItem = useCallback(async () => {
      try {
         const data = await API.getContent(3645)
         setData(data)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      }
   })

   useEffect(() => {
      getItem();
   }, []);

   return (
      <div className={`${s.tabPage} ${isActive === 'compositionParliamentaryGroups' && s.active}`}>
         <div className="text">
            <div className={s.logoBlock}>
               <div className={s.imgContainer}><img src={edinyaRossiaParty} alt="" /></div>
               <div className={s.textBlock} dangerouslySetInnerHTML={{ __html: data?.text }}></div>
            </div>

            <div className={`pageTitle mt40 ${s.mobilMt20}`}>{data?.name}</div>

            <div className="mt40" dangerouslySetInnerHTML={{__html: data?.description}}></div>
         </div>

      </div>
   )
}
export default CompositionParliamentaryGroups;