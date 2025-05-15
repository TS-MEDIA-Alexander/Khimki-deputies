import React, { useEffect, useState } from "react";
import s from "./ScheduleReceptionDeputies.module.css";
import Table from "../Table";
import graphPriema from "../../assets/tables/Deputies/graph-priema.json";
import API from "API";

const ScheduleReceptionDeputies = () => {

   const [data, setData]=useState({});

   const getItem = async () => {
      try {
         const value = await API.getContent(3652);
         setData(value)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error)
      } 
   }

   useEffect(() => {
      getItem();
   }, [])
  return (
    <div>
      {data?.graphic? <Table table={data?.graphic} style={s} />: 'Загрузка...'}
     
    </div>
  );
};
export default ScheduleReceptionDeputies;
