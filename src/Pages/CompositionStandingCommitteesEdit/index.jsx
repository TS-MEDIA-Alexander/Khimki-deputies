import React, { useState, useEffect, useCallback } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './CompositionStandingCommitteesEdit.module.css';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuillForm from 'ComponentsAdmin/FormElements/ReactQuill';
import API from 'API';
import Button from 'ComponentsAdmin/Button/Button';

const CompositionStandingCommitteesEdit = () => {

   const id = 3644;

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const save = async () => {
      const form = getValues();
      const formData = new FormData();

      for (let key in form) {
         if (form[key] !== null) {
            formData.append(key, form[key]);
         }
      }

      try {
         const response = await API.postChangeElement(formData);
         if (response) {
            setStatusSend(response);
            reset();
            setUnexpectedError({});
         } else {
            setUnexpectedError({ result: 'err', title: 'Непредвиденная ошибка. Проверьте соединение с Интернетом' });
         }
      } catch (error) {
         console.error("Ошибка при сохранении:", error);
      } finally {
         setPreloading(false);
      }
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
      formState: {
         errors,
         isValid,
      },
      handleSubmit,
      control,
      reset,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 6,
         id: id,
         text: '',
      }
   });

   watch();

   const getItem = async () => {
      setLoading(true);
      try {
         const data = await API.getContent(id);
         const formattedData = {
            ...getValues(),
            name: data?.name,
            text: data?.text,
         }
         reset(formattedData)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getItem();
   }, [])

   const onSubmit = () => {
      setPreloading(true);
      save();
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
                  <Button
                     isValid={isValid}
                     preload={preload}
                     classNames={'publishBtn'}
                     text={'Сохранить'}
                     name={'publish'}
                  />
               </div>
            </form>
            {unexpectedError?.title ? (
               <div className="pageTitle err">{unexpectedError.title}</div>
            ) : false}

         </>}
      </div>
   )
}
export default CompositionStandingCommitteesEdit;