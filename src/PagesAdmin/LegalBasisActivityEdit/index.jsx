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

const LegalBasisActivityEdit = ({ level }) => {

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);

   const saveDocument = (isPublished) => {
      const form = getValues();
      const formData = new FormData();

      const valueIsPublished = isPublished ? 1 : 0;

      for (let key in form) {
         if (key === "file_add") {
            if (form[key] && form[key] instanceof FileList) {
               for (let i = 0; form[key].length > i; i++) {
                  formData.append(`file_add[${i}]`, form[key].item(i))
               }
            }
         } else if (key === 'published') {
            formData.append(key, valueIsPublished)
         } else if (key === "file_delete") {
            if (Array.isArray(form[key]) && form[key].length) {
               form[key].forEach((id, index) => {
                  formData.append(`${key}[${index}]`, id);
               });
            }
         } else if (key !== 'value') {
            formData.append(key, form[key]);
         }
      }

      API.postChangeElement(formData)
         .then(response => setStatusSend(response))
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
         value: [],
         file_add: [],
         file_delete: [],
         published: 1,
      }
   });

   watch()

   window.getValues = getValues

   const handler = useCallback((name, value) => {
      setValue(name, value);
      trigger('file_add')
   }, [setValue]);

   const getItemDocument = async () => {
      setLoading(true);
      try {
         const data = await API.getPravosnov()
         const formattedData = {
            ...getValues(),
            value: data.document?.list
         }
         reset(formattedData)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error)
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getItemDocument();
   }, [])

   const deleteFile = useDeleteFile(setValue, getValues);

   const onSubmit = () => {
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
                     >Опубликовать</button>
                     {/* <button
                        type='submit'
                        className={`unpublished ${!isValid && 'disable'}`}
                        disabled={!isValid}
                        name="saveDraft"
                     >Сохранить без публикации</button> */}
                  </div>

               </form>
            </>}
         </ContantContainerAdmin>
      </div>
   )
}
export default LegalBasisActivityEdit;