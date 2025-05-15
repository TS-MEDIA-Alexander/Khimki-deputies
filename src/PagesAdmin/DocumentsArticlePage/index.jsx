import React, { useState, useEffect, useCallback } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './DocumentsArticlePage.module.css';

/* import UploadFile from '../../total/UploadFile'; */
import { ROUTER } from '../../config';
import { NavLink } from 'react-router-dom';
import UploadFileAdmin from 'total/UploadFileAdmin';
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

const DocumentsArticlePage = ({ level }) => {

   const [statusSend, setStatusSend] = useState({});
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
         } else if (key !== 'value' && key !== "file_delete") {
            formData.append(key, form[key]);
         }
      }

      try {
         const response = await API.postAddElement(formData);
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
      text: yup.string() //typeError выводит ошибку, когда не строка
         .test(
            'notEmpty',
            'Обязательно',
            (value) => {
               if (!value) return false;
               const cleanedValue = value?.replace(/<p><br><\/p>/gi, '')?.trim();
               return cleanedValue.length > 0;
            }
         ),
      file_add: yup.mixed().test("fileSize", "The file is too large", (value) => {
         if (!value?.length > 1) return true // attachment is optional
         return value[0]?.size <= 2000000
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
      reset,
      setValue,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 4,
         name: '',
         text: '',
         value: [],
         file_add: [],
         file_delete: [],
         published: 1,
      }
   });

   const deleteFile = useDeleteFile(setValue, getValues);

   const handler = useCallback((name, value) => {
      setValue(name, value);
      trigger([]);
   }, [setValue]);

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

   return (
      <div className="mt54">
         <ContantContainerAdmin>
            <div className={`breadcrumbs`}>
               <NavLink to={ROUTER.admin.documents} className='breadcrumbsFrom'>Документы</NavLink>
               <span className='breadcrumbsTo'> / Добавить документ </span>
            </div>

            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle mt40">Документ</h1>
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

                  <div className='mt8'>
                     {getValues()?.value?.map(el => <DocumentContainerDownload
                        key={el.id}
                        id={el.id}
                        format={el.format}
                        title={el.name}
                        deleteFn={(id) => deleteFile(id)}
                     />)}
                  </div>

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
      </div >
   )
}
export default DocumentsArticlePage;