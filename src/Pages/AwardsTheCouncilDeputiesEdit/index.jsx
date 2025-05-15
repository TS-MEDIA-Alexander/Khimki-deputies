import React, { useState, useEffect, useCallback } from 'react';
import s from './AwardsTheCouncilDeputiesEdit.module.css';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import ReactQuillForm from 'ComponentsAdmin/FormElements/ReactQuill';
import API from 'API';
import Button from 'ComponentsAdmin/Button/Button';

const AwardsTheCouncilDeputiesEdit = () => {

   const id = 3642;

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);


   const save = async () => {
      const form = JSON.stringify(getValues());
      const formData = new FormData();

      formData.append('content_category_id', 6);
      formData.append('id', id);
      formData.append('name', 'Награды Совета депутатов');
      formData.append('json', form);

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
      name: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .min(2, 'Заголовок должен быть минимум 2 символа')
         .max(120, 'Не более 120 символов')
         .required('Обязательно'),
      description: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .min(2, 'Заголовок должен быть минимум 2 символа')
         .max(120, 'Не более 120 символов')
         .required('Обязательно'),
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
      name1: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .min(2, 'Заголовок должен быть минимум 2 символа')
         .max(120, 'Не более 120 символов')
         .required('Обязательно'),
      description1: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .min(2, 'Заголовок должен быть минимум 2 символа')
         .max(120, 'Не более 120 символов')
         .required('Обязательно'),
      text1: yup.string() //typeError выводит ошибку, когда не строка
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
         text: '',
         description: '',
         name1: '',
         text1: '',
         description1: '',
      }
   });

   watch();

   const getItem = async () => {
      setLoading(true);
      try {
         const data = await API.getContent(id)
         const formattedData = {
            ...getValues(),
            name: data?.name,
            text: data?.text,
            description: data?.description,
            name1: data?.name1,
            text1: data?.text1,
            description1: data?.description1,
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

   const handler = useCallback((file, name) => {
      setValue(name, file);
   }, [setValue]);

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
         ) : <><h1 className="pageTitle">Награды Совета депутатов</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">

               <div className={`inputContainer mt40`}>
                  <ReactQuillForm
                     name={'description'}
                     errors={errors}
                     label={'Решение'}
                     placeholder={'Утверждено Решением Совета депутатов от...'}
                     control={control}
                  />
               </div>

               <div className={`mt24`}>
                  <Input
                     type={'text'}
                     name={'name'}
                     errors={errors}
                     register={register}
                     label={'Заголовок'}
                     placeholder={'Не более 120 символов'}
                     className={'inputTitle mt24'}
                     onChange={(e) => handler(e.target.value, "name")}
                  />
               </div>

               <div className={`inputContainer mt24`}>
                  <ReactQuillForm
                     name={'text'}
                     errors={errors}
                     label={'Описание'}
                     placeholder={'Введите информацию о документе или перечне документов'}
                     control={control}
                  />
               </div>


               <h1 className="pageTitle mt40">Положение о благодарственном письме совета депутатов городского округа химки</h1>

               <div className={`inputContainer mt40`}>
                  <ReactQuillForm
                     name={'description1'}
                     errors={errors}
                     label={'Решение'}
                     placeholder={'Утверждено Решением Совета депутатов от...'}
                     control={control}
                  />
               </div>

               <div className={`mt24`}>
                  <Input
                     type={'text'}
                     name={'name1'}
                     errors={errors}
                     register={register}
                     label={'Заголовок'}
                     placeholder={'Не более 120 символов'}
                     className={'inputTitle mt24'}
                     onChange={(e) => handler(e.target.value, "name")}
                  />
               </div>


               <div className={`inputContainer mt24`}>
                  <ReactQuillForm
                     name={'text1'}
                     errors={errors}
                     label={'Описание'}
                     placeholder={'Введите информацию о документе или перечне документов'}
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
export default AwardsTheCouncilDeputiesEdit;