import React, { useCallback, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import s from './FormElements.module.css';
import { useController } from 'react-hook-form';

const ReactQuillForm = ({
   name,
   errors,
   label,
   placeholder,
   control
}) => {
   const { field } = useController({
      name,
      control,
   });

   const modules = {
      toolbar: [
         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
         ['clean']
      ],
      clipboard: {
         matchVisual: false
      }
   };

   return (
      <div className={`inputContainer ${s.inputContainer}`}>

         <label className='body-s-400 ml8' htmlFor={name}>{label}</label>
         <div className={`mt8 ${errors[name] && s.err}`}>
            <ReactQuill
               id={name}
               value={field.value || ''}
               onChange={field.onChange}
               placeholder={placeholder}
               theme="snow"
               modules={modules}
               onBlur={field.onBlur}
            />
         </div>
         {errors[name] && <div className={s.messageErr}>{errors[name].message || 'Error!'}</div>}
      </div>
   );
};

export default ReactQuillForm;