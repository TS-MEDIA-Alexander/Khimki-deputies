import React, { useState, useEffect, useCallback } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './LegalBasisActivityEdit.module.css';

import UploadFileAdmin from '../../total/UploadFileAdmin';
import { ROUTER } from '../../config';
import { NavLink } from 'react-router-dom';
import API from 'API';
import DocumentContainerDownload from 'Components/DocumentContainerDownload';
import { useDeleteFile, useRequireAccessLevel } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from 'ComponentsAdmin/Button/Button';

const LegalBasisActivityEdit = ({ level }) => {

   const id = 3641;

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const saveDocument = async () => {
      const form = getValues();
      const formData = new FormData();

      for (let key in form) {
         if (key === "file_add") {
            if (form[key] && form[key] instanceof FileList) {
               for (let i = 0; form[key].length > i; i++) {
                  formData.append(`file_add[${i}]`, form[key].item(i))
               }
            }
         } else if (key !== 'value' &&
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
      file_add: yup.mixed().test("fileSize", "The file is too large", (value) => {
         if (!value.length) return true // attachment is optional
         return value[0].size <= 2000000
      }),
   }).required();

   const {
      register,
      watch,
      formState: {
         errors,
         isValid,
      },
      trigger, //для запуска ручной валидации поля
      handleSubmit,
      reset,
      setValue,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 6,
         id: id,
         value: [],
         file_add: [],
         file_delete: [],
      }
   });

   watch()

   const handler = useCallback((name, value) => {
      setValue(name, value);
      trigger('file_add')
   }, [setValue]);

   const getItem = async () => {
      setLoading(true);
      try {
         const data = await API.getContent(id)
         const formattedData = {
            ...getValues(),
            name: data?.name,
            value: data?.property?.document?.value,
         }
         reset(formattedData)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error)
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getItem();
   }, [])

   const deleteFile = useDeleteFile(setValue, getValues);

   const onSubmit = () => {
      setPreloading(true);
      if (document.activeElement.attributes.name.value === 'publish') {
         saveDocument(true);
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         saveDocument(false);
      }
   };

   const accessLevel = useRequireAccessLevel(level)
   if (!accessLevel) {
      return null;
   }

   if (loading) {
      return <div>Загрузка...</div>; // Отображаем индикатор загрузки
   }

   return (
      <div className="mt54">
         <ContantContainerAdmin>

            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle">Правовая основа деятельности</h1>
               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">

                  <div className='mt24'>
                     <UploadFileAdmin
                        value={getValues('file_delete')}
                        handler={handler}
                        title={'Загрузите документы в форматах: doc, docx, xls, xlsx, pdf, zip, rar'}
                        fileName={getValues('name')}
                        discription={' '}
                        keyData={'file_add'} //ключ, по которому будет добавляться файлы
                     />
                  </div>

                  {getValues()?.value?.[0] ? <div className='mt8 fileContainer'>
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
                        text={'Опубликовать'}
                        name={'publish'}
                     />
                  </div>

               </form>
            </>}
            {unexpectedError?.title ? (
               <div className="pageTitle err">{unexpectedError.title}</div>
            ) : false}
         </ContantContainerAdmin>
      </div>
   )
}
export default LegalBasisActivityEdit;