import React, { useState, useEffect, useCallback } from 'react';
import s from './CharterAndSymbolsComponent.module.css';

import API from 'API';
import DocumentContainerDownload from 'Components/DocumentContainerDownload';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';
import UploadFileAdminMono from 'total/UploadFileAdminMono';
import useDeleteFile from 'utils';

const CharterAndSymbolsComponent = () => {

   const id = 3620;

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);

   const saveNews = () => {
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

      API.postChangeElement(formData)
         .then(response => setStatusSend(response))
   };

   /* React-hook-form */
   const schema = yup.object({
      text: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .matches(
            /^[а-яА-Я0-9]+$/,
            'Недопустимые символы',
         ).required('Обязательно'),
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
         text: '',
         value: [],
         file_add: [],
         file_delete: [],
      }
   });

   watch();

   const getItemNews = async () => {
      setLoading(true);
      try {
         const data = await API.getContent(id)
         const formattedData = {
            ...getValues(),
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
      getItemNews();
   }, [])

   const deleteFile = useDeleteFile(setValue, getValues);

   const handleImageChange = useCallback((file) => {
      handler('file_add', file); // Сохраняем File для отправки
      handler('file_delete', [...getValues('file_delete'), getValues()?.value?.[0]?.id].filter(Boolean)); // Удаляем предыдущий файл
      handler('value', file || []);
      trigger('file_add');
   }, [setValue]);

   const handler = useCallback((name, file) => {
      setValue(name, file);
   }, [setValue]);

   const onSubmit = () => {
      /*  if (document.activeElement.attributes.name.value === 'publish') {
          saveNews(true);
       } else if (document.activeElement.attributes.name.value === 'saveDraft') {
          saveNews(false);
       } */
      saveNews()
   };

   if (loading) {
      return <div>Загрузка...</div>; // Отображаем индикатор загрузки
   }

   return (
      <div>
         {statusSend?.result ? (
            <div className="pageTitle mt160">{statusSend.title}</div>
         ) : <><form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">

            <div className={`inputContainer mt40`}>
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
                  handler={handleImageChange}
                  title={'Загрузите документы в форматах: doc, docx, xls, xlsx, pdf, zip, rar'}
                  type={'single'}
                  keyData={'file_add'}
               />
            </div>

            {getValues()?.value?.length ? <div className='mt8 fileContainer'>
               {getValues()?.value?.map(el => <DocumentContainerDownload
                  key={el.id}
                  id={el.id}
                  format={el.format}
                  title={el.name}
                  deleteFn={(id) => deleteFile(id)}
               />)}
            </div> : false}

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
export default CharterAndSymbolsComponent;