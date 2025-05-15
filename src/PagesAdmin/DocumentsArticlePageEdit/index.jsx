import React, { useState, useEffect, useCallback } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './DocumentsArticlePageEdit.module.css';

import UploadFileAdmin from '../../total/UploadFileAdmin';
import { ROUTER } from '../../config';
import { NavLink, useParams } from 'react-router-dom';
import API from 'API';
import DocumentContainerDownload from 'Components/DocumentContainerDownload';
import { useDeleteFile, useRequireAccessLevel } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';
import Button from 'ComponentsAdmin/Button/Button';

const DocumentsArticlePageEdit = ({ level }) => {

   const docId = useParams().id.slice(3);

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const saveDocument = async (isPublished) => {
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
      name: yup.string()
         .typeError('Должно быть строкой')
         .min(2, 'Заголовок должен быть минимум 2 символа')
         .max(120, 'Не более 120 символов')
         .required('Обязательно'),
      text: yup.string()
         .typeError('Должно быть строкой')
         .min(2, 'Описание должно быть минимум 2 символа')
         .required('Обязательно'),
      file_add: yup.mixed()
         .nullable()  //  <--- Разрешаем null
         .test("fileSize", "The file is too large", (file_add) => {
            if (!file_add) return true;

            if (file_add instanceof FileList) {
               if (file_add.length === 0) return true;
               if (file_add[0]?.size > 2000000) return false;
            } else if (Array.isArray(file_add)) {
               if (file_add.length === 0) return true;
               if (file_add[0]?.size > 2000000) return false;
            }
            return true;
         }),
      value: yup.array().of(yup.object()).default([]),
   }).test(
      'either-value-or-file_add',
      'Должен быть хотя бы один файл в Value или File Add',
      function (values) {
         const { value, file_add } = values;

         const hasValue = Array.isArray(value) && value.length > 0;
         let hasFileAdd = false;

         //  Проверяем file_add только если он не null и не undefined
         if (file_add !== null && file_add !== undefined) {  //  <--- Изменено условие
            if (file_add instanceof FileList || Array.isArray(file_add)) {
               hasFileAdd = file_add.length > 0;
            }
         }

         if (!hasValue && !hasFileAdd) {
            return this.createError({
               path: 'file_add',
               message: 'Должен быть хотя бы один файл в Value или File Add',
            });
         }

         return true;
      }
   );

   const {
      register,
      watch,
      formState: {
         errors,
         isValid,
      },
      trigger,
      handleSubmit,
      reset,
      setValue,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 4,
         id: docId,
         name: '',
         text: '',
         value: [],
         file_add: null,
         file_delete: [],
         published: 1,
      }
   });

   watch()

   const handler = useCallback((name, value) => {
      setValue(name, value);
      trigger();
   }, [setValue]);

   const getItemDocument = async () => {
      setLoading(true);
      try {
         const data = await API.getItemDocument(docId);
         if (data && data.document) {
            const formattedData = {
               ...getValues(),
               name: data.document.name ?? '',
               text: data.document.text ?? '',
               value: data.document.property?.document?.value ?? []
            };
            reset(formattedData);
            await trigger();
         } else {
            // Если данные не получены, устанавливаем значения по умолчанию
            reset({
               content_category_id: 4,
               id: docId,
               name: '',
               text: '',
               value: [],
               file_add: [],
               file_delete: [],
               published: 1,
            });
            await trigger();
         }
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (docId) { // Загружаем данные только если docId есть
         getItemDocument();
      } else {
         setLoading(false);
      }
   }, [])

   const deleteFile = useDeleteFile(setValue, getValues, trigger);

   const onSubmit = () => {
      setPreloading(true);
      if (document.activeElement.attributes.name.value === 'publish') {
         saveDocument(true)
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         saveDocument(false)
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
            <div className={`breadcrumbs`}>
               <NavLink to={ROUTER.admin.documents} className='breadcrumbsFrom'>Документы</NavLink>
               <span className='breadcrumbsTo'> / Редактировать документ </span>
            </div>

            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle mt40">Редактировать документ</h1>
               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">
                  <div className={`inputContainer mt24`}>
                     <Input
                        type={'text'}
                        name={'name'}
                        errors={errors}
                        register={register}
                        label={'Заголовок документа'}
                        placeholder={'Заголовок документа'}
                        className={'inputTitle mt24'}
                        onChange={e => handler('name', e.target.value)}
                     />
                  </div>

                  <div className={`inputContainer mt24`}>
                     <Textarea
                        name={'text'}
                        errors={errors}
                        register={register}
                        label={'Описание'}
                        placeholder={'Описание'}
                        className={'textareaText'}
                        onChange={(e) => handler('text', e.target.value)}
                     />
                  </div>

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
                     <Button
                        isValid={isValid}
                        preload={preload}
                        classNames={'publishBtn'}
                        text={'Опубликовать'}
                        name={'publish'}
                     />
                     <Button
                        isValid={isValid}
                        preload={preload}
                        classNames={'unpublished'}
                        text={'Сохранить без публикации'}
                        name={'saveDraft'}
                     />
                  </div>

               </form>
               {unexpectedError?.title ? (
                  <div className="pageTitle err">{unexpectedError.title}</div>
               ) : false}
            </>}
         </ContantContainerAdmin>
      </div>
   )
}
export default DocumentsArticlePageEdit;