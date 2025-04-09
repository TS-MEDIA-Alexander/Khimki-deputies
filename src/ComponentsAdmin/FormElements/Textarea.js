import React from 'react';
import s from './FormElements.module.css';

const Textarea = ({
   name,
   errors,
   register,
   label,
   placeholder,
   className,
   onChange
}) => {
   return (
      <div className={`inputContainer ${s.inputContainer}`}>
         <label className='body-s-400 ml8' htmlFor={name}>{label}</label>
         <textarea
            id={name}
            placeholder={placeholder}
            className={`${className} ${errors[name] && s.err}`}
            {...register(name)}
            onChange={onChange}
         />
         {errors[name] && <div className={s.messageErr}>{errors[name].message || 'Error!'}</div>}
      </div>
   )
}
export default Textarea;