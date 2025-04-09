import React, { Children } from 'react';
import s from './SpoilerContainerAdmin.module.css';

const SpoilerContainerAdmin = ({ children, title }) => {
   return (
      <div className={`borderMain ${s.spoilerContainer}`}>
         <div className={` ${s.spoilerHeader}`}>{title}</div>
         <div className={s.spoilerContentContainer}>
            {children}
         </div>
      </div>
   )
}
export default SpoilerContainerAdmin;