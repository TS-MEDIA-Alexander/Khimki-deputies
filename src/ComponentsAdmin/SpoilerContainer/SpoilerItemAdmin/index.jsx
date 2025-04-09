import React, { Children, useState, useRef } from 'react';
import s from './SpoilerItemAdmin.module.css';

import arrow from '../../../assets/icons/arrowDownSelect.svg';

const SpoilerItemAdmin = ({ children, title }) => {

   const itemRef = useRef(null);

   const [isOpen, setIsOpen] = useState(null);

   const clickHandler = (id) => {
      setIsOpen(!isOpen)
   }

   return (
      <div>
         <div className={`body-m-400 ${s.spoilerItemHead}`} onClick={clickHandler}>
            {children && <div className={s.btn}>
               <img className={isOpen ? s.rotate : ''} src={arrow} alt="" />
            </div>}
            {title}
         </div>
         <div
            style={
               isOpen ? { height: itemRef.current.scrollHeight } : { height: '0px' }
            }
            className={`${s.spoilerCollapse} `} ref={itemRef}>
            {children}
         </div>
      </div>
   )
}
export default SpoilerItemAdmin;