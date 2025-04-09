import React, { useState, useEffect, useCallback } from 'react';
import s from './CharterAndSymbolsLogo.module.css';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';
import UploadFileAdminMono from 'total/UploadFileAdminMono';

const CharterAndSymbolsLogo = () => {

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
      name: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
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
      file_CoatOfArms: yup.mixed().test("fileSize", "The file is too large", (value) => {
         if (!value.length) return true // attachment is optional
         return value[0].size <= 2000000
      }),
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
         name: '',
         text: '',
         file_CoatOfArms: null,
         file_url: '',
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
      handler(file, 'file_CoatOfArms'); // Сохраняем File для отправки

      if (file) {
         const url = window.URL.createObjectURL(file);
         handler(url, 'file_url')
      } else {
         handler('', 'file_url')
      }
      trigger('file_CoatOfArms')
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
      <div>
         {statusSend?.result ? (
            <div className="pageTitle mt160">{statusSend.title}</div>
         ) : <>
            <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">

               <div className="inputContainer mt40">
                  <Input
                     type={'text'}
                     name={'name'}
                     errors={errors}
                     register={register}
                     label={'Заголовок'}
                     placeholder={'Не более 120 символов'}
                     className={'inputTitle'}
                     onChange={e => handler(e.target.value, "name")}
                  />
               </div>

               <div className={`inputContainer mt24`}>
                  <Textarea
                     name={'text'}
                     errors={errors}
                     register={register}
                     label={'Описание'}
                     placeholder={'Введите информацию'}
                     control={control}
                     className={'textareaText'}
                     onChange={(e) => handler(e.target.value, "text")}
                  />
               </div>

               <div className='mt24'>
                  <UploadFileAdminMono
                     handler={handleImageChange}
                     title={'Загрузите обложку в форматах: jpeg, png'}
                     type={'single'}
                     keyData={'file_Logo'}
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
export default CharterAndSymbolsLogo;