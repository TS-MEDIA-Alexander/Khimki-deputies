import React, { useState, useEffect, useCallback } from 'react';
import s from './ScheduleReceptionDeputiesEdit.module.css';
import ContantContainerAdmin from "../../total/ContantContainerAdmin";

import { ROUTER } from '../../config';
import { NavLink } from 'react-router-dom';
import API from '../../API';
import UploadFileAdminMono from 'total/UploadFileAdminMono';
import { formatDateToUS } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ScheduleReceptionDeputiesEdit = (props) => {

   const [statusSend, setStatusSend] = useState({});

   const saveNews = (isPublished) => {
      const form = getValues();
      const formData = new FormData();

      const value = formatDateToUS(form.published_from_date) + " " + form.published_from_time + ":00";
      const valueIsPublished = isPublished ? 1 : 0;

      for (let key in form) {
         if (key !== 'image_preview_url' &&
            key !== 'published_from_date' &&
            key !== 'published_from_time' &&
            form[key] !== null) {
            if (key === 'published_from') {
               formData.append(key, value)
            } else if (key === 'published') {
               formData.append(key, valueIsPublished)
            } else
               formData.append(key, form[key]);
         }
      }

      API.postAddElement(formData)
         .then(response => {
            setStatusSend(response);
            reset();
         })
   };

   /* React-hook-form */
   const schema = yup.object({
      /* file: yup.mixed().test("fileSize", "The file is too large", (value) => {
         debugger
         if (!value.length) return true // attachment is optional
         
         return value[0].size <= 2000
      }).required(), */
      file: yup.mixed().test("fileSize", "The file is too large", (value) => {
         debugger
         if (!value.length) return true // attachment is optional

         return value[0].size <= 2000
      }).required(),
   });

   const {
      watch, //для ререндера страницы при изменении состояния формы
      register,
      formState: {
         errors,
         isValid,
      },
      trigger, //для запуска ручной валидации поля
      handleSubmit,
      control,
      reset,
      setValue,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 0,
         file: null,
         file_url: '',
      }
   });

   window.getValues = getValues;
   window.errors = errors;
   window.isValid = isValid;

   watch();

   const handleFileChange = useCallback((file) => {

      handler(file, 'file'); // Сохраняем File для отправки

      if (file) {
         const url = window.URL.createObjectURL(file);
         handler(url, 'file_url')
      } else {
         handler('', 'file_url')
      }
      trigger('file')
   }, [setValue]);

   useEffect(() => {
      return () => {
         // Отзываем URL при размонтировании
         const imageUrl = getValues('file_url');
         if (imageUrl) {
            window.URL.revokeObjectURL(imageUrl);
         }
      };
   }, []);

   const handler = useCallback((file, name) => {
      setValue(name, file);
   }, [setValue]);

   const onSubmit = () => {
      if (document.activeElement.attributes.name.value === 'publish') {
         saveNews(true);
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         saveNews(false);
      }
   };

   return (
      <div className="mt54">
         <ContantContainerAdmin>
            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle">График приема депутатов</h1>
               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">
                  <div className='mt40'>
                     <UploadFileAdminMono
                        handler={handleFileChange}
                        title={'Загрузите график в форматах:  xls, xlsx'}
                        type={'single'}
                        keyData={'file_url'}
                     />
                  </div>

                  <div className="rowContainer mt40">
                     <button
                        type='submit'
                        className={`publishBtn ${!isValid && 'disable'}`}
                        disabled={!isValid}
                        name="publish"
                     >Опубликовать</button>
                     <button
                        type='submit'
                        className={`unpublished ${!isValid && 'disable'}`}
                        disabled={!isValid}
                        name="saveDraft"
                     >Сохранить без публикации</button>
                  </div>
               </form>
            </>}
         </ContantContainerAdmin>
      </div>
   )
}
export default ScheduleReceptionDeputiesEdit;