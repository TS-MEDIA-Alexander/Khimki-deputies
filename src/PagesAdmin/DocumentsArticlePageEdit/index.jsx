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

const DocumentsArticlePageEdit = ({ level }) => {

   const docId = useParams().id.slice(3);

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
         file_add: [],
         file_delete: [],
         published: 1,
      }
   });

   watch()

   window.getValues = getValues

   const handler = useCallback((name, value) => {
      setValue(name, value);
   }, [setValue]);

   const getItemDocument = async () => {
      setLoading(true);
      try {
         const data = await API.getItemDocument(docId)
         const formattedData = {
            ...getValues(),
            name: data.document?.name,
            text: data.document?.text,
            value: data.document?.property?.document?.value
         }
         reset(formattedData)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error)
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      if (docId) { // Загружаем данные только если docId есть
         getItemDocument();
      } else {
         setLoading(false);
      }
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
export default DocumentsArticlePageEdit;