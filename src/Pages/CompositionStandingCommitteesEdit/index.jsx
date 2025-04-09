import React, { useState, useEffect, useCallback } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './CompositionStandingCommitteesEdit.module.css';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';
import ReactQuillForm from 'ComponentsAdmin/FormElements/ReactQuill';

const CompositionStandingCommitteesEdit = () => {

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);

   const saveNews = (isPublished) => {
      const form = getValues();
      const formData = new FormData();

      const valueIsPublished = isPublished ? 1 : 0;

      /* for (let key in form) {
         if (key !== 'file_url' &&
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

      API.postChangeElement(formData)
         .then(response => setStatusSend(response)) */
   };


   /* React-hook-form */
   const schema = yup.object({
      text: yup.string() //typeError выводит ошибку, когда не строка
         .test(
            'notEmpty',
            'Обязательно',
            (value) => {
               if (!value) return false;
               const cleanedValue = value.replace(/<p><br><\/p>/gi, '').trim();
               return cleanedValue.length > 0;
            }
         ),
   }).required();

   const {
      watch,
      register,
      formState: {
         errors,
         isValid,
      },
      trigger,
      handleSubmit,
      control,
      reset,
      setValue,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 1,
         text: '',
      }
   });

   watch();

   const getItemNews = async () => {
      setLoading(true);
      try {
         /* const data = await API.getItemNews() */
         /* const formattedData = {
            ...getValues(),
            name: data?.name,
            text: data?.text,
            file_url: [data?.file],
            published_from_date: formatDateToEurope(data?.published_from?.split(' ')[0]),
            published_from_time: data?.published_from?.split(' ')[1]?.slice(0, 5),
            favorite: data?.favorite,
         }
         reset(formattedData) */
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getItemNews();
   }, [])

   const handleImageChange = useCallback((file) => {
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

   if (loading) {
      return <div>Загрузка...</div>; // Отображаем индикатор загрузки
   }

   return (
      <div className='mt54'>
         {statusSend?.result ? (
            <div className="pageTitle mt160">{statusSend.title}</div>
         ) : <><h1 className="pageTitle">Состав постоянных комиссий</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">

               <div className={`inputContainer mt24`}>
                  <ReactQuillForm
                     name={'text'}
                     errors={errors}
                     label={'Описание'}
                     placeholder={'Введите описание'}
                     control={control}
                  />
               </div>

               <div className="rowContainer mt40">
                  <button
                     type='submit'
                     className={`publishBtn ${!isValid && 'disable'}`}
                     disabled={!isValid}
                     name="publish"
                  >Сохранить</button>
               </div>
            </form>

         </>}
      </div>
   )
}
export default CompositionStandingCommitteesEdit;