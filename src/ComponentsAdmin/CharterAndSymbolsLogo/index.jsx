import React, { useState, useEffect, useCallback } from 'react';
import s from './CharterAndSymbolsLogo.module.css';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';
import UploadFileAdminMono from 'total/UploadFileAdminMono';
import API from 'API';
import useDeleteFile from 'utils';
import DocumentContainerDownload from 'Components/DocumentContainerDownload';
import Button from 'ComponentsAdmin/Button/Button';

const CharterAndSymbolsLogo = () => {

   const id = 3639;

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const save = async (isPublished) => {
      const form = getValues();
      const formData = new FormData();

      for (let key in form) {
         if (key !== 'value' &&
            form[key] !== null) {
            if (key === "file_delete") {
               if (Array.isArray(form[key]) && form[key].length) {
                  form[key].forEach((id, index) => {
                     formData.append(`${key}[${index}]`, id);
                  });
               }
            } else formData.append(key, form[key]);
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
      name: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .min(2, 'Заголовок должен быть минимум 2 символа')
         .max(120, 'Не более 120 символов')
         .required('Обязательно'),
      text: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .min(2, 'Заголовок должен быть минимум 2 символа')
         .required('Обязательно'),
      file_add: yup.mixed().test("fileSize", "The file is too large", (value) => {
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
         content_category_id: 6,
         id: id,
         name: '',
         text: '',
         value: [],
         file_add: [],
         file_delete: [],
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
            value: [data?.property?.document?.value[0]],
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

   const deleteFile = useDeleteFile(setValue, getValues);

   const handleFileChange = useCallback((file) => {
      handler('file_add', file); // Сохраняем File для отправки
      handler('file_delete', [...getValues('file_delete'), getValues()?.value?.[0]?.id].filter(Boolean)); // Удаляем предыдущий файл
      handler('value', file || []);
      trigger('file_add');
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

   const handler = useCallback((name, file) => {
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
                     onChange={e => handler("name", e.target.value)}
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
                     onChange={(e) => handler("text", e.target.value)}
                  />
               </div>

               <div className='mt24'>
                  <UploadFileAdminMono
                     handler={handleFileChange}
                     title={'Загрузите документы в форматах: doc, docx, xls, xlsx, pdf, zip, rar'}
                     type={'single'}
                     keyData={'file_add'}
                     id={'logo'}
                  />
               </div>

               {getValues()?.value[0] ? <div className='mt8 fileContainer'>
                  {getValues()?.value?.map(el => <DocumentContainerDownload
                     key={el.id}
                     id={el.id}
                     format={el.format}
                     title={el.name}
                     deleteFn={(id) => deleteFile(id)}
                  />)}
               </div> : false}

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
export default CharterAndSymbolsLogo;