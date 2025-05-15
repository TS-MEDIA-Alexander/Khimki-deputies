
import React from 'react';
import s from './Button.module.css';
import preloader from '../../assets/icons/preloader.svg';

const Button = ({ isValid, preload, classNames, text}) => {
   return (
      <button
         type='submit'
         className={`${classNames} ${(!isValid || preload) ? 'disable' : ''}`}
         disabled={!isValid || preload}
         name="publish"
      >
         {preload && <img src={preloader} alt="" className='preloader' />}
         {text}</button>
   )
}

export default Button;
