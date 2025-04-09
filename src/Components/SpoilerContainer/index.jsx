import React, { Children } from 'react';
import s from './SpoilerItem.module.css';

const SpoilerItem = ({ children, title }) => {
   return (
      <div className={`borderMain ${s.spoilerContainer}`}>
         <div className={`bgMain ${s.spoilerHeader}`}>{title}</div>
         <div className={s.spoilerContentContainer}>
            {children}
         </div>
      </div>
   )
}
export default SpoilerItem;