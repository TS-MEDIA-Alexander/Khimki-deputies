import React from 'react';
import s from './ScheduleReceptionDeputies.module.css';
import Table from '../Table';
import graphPriema from '../../assets/tables/Deputies/graph-priema.json';

const ScheduleReceptionDeputies = ({ isActive }) => {

   return (
      <div className={`${s.tabPage} ${isActive === 'scheduleReceptionDeputies' && s.active}`}>
         <Table table={graphPriema} style={s} />
      </div>
   )
}
export default ScheduleReceptionDeputies;