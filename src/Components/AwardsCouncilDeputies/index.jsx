import React, { useCallback, useEffect, useState } from "react";
import s from "./AwardsCouncilDeputies.module.css";
import gerb from "../../assets/img/khimkiDistrict/Symbolism/gerb.png";
import API from "API";

const AwardsCouncilDeputies = () => {

   const [data, setData] = useState({});

   const getItem = useCallback(async () => {
      try {
         const value = await API.getContent(3642)
         setData(value)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      }
   }, [])

   useEffect(() => {
      getItem();
   }, [])

   return (
      <div>
         <div className="text">
            <div className={s.logoBlock}>
               <div className={s.imgContainer}>
                  <img src={gerb} alt="" />
               </div>
               <div className={s.textBlock} dangerouslySetInnerHTML={{ __html: data?.description }}></div>
            </div>

            <div className={`pageTitle mt40 ${s.mobilMt20}`}>{data?.name}</div>

            <div className="mt40" dangerouslySetInnerHTML={{ __html: data?.text }}></div>

            <div className={`${s.logoBlock} mt80`}>
               <div className={s.imgContainer}>
                  <img src={gerb} alt="" />
               </div>
               <div className={s.textBlock} dangerouslySetInnerHTML={{ __html: data?.description1 }}></div>
            </div>

            <div className={`pageTitle mt40 ${s.mobilMt20}`}>{data?.name1}</div>

            <div className="mt40" dangerouslySetInnerHTML={{__html: data?.text1}}></div>
         </div>
      </div>
   );
};
export default AwardsCouncilDeputies;
