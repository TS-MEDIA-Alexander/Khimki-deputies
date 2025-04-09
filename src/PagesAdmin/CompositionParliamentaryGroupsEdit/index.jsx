import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './CompositionParliamentaryGroupsEdit.module.css';

import ReactQuill from 'react-quill';
import '../../total/quill.snow.css';
import { ROUTER } from '../../config';
import { NavLink, useParams } from 'react-router-dom';
import API from '../../API';
import UploadFileAdminMono from 'total/UploadFileAdminMono';
import Deputates from 'Components/Deputates';
import ReactSelect from 'ComponentsAdmin/React-select';
import { useRequireAccessLevel, maskInput } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import ReactQuillForm from 'ComponentsAdmin/FormElements/ReactQuill';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';

const CompositionParliamentaryGroupsEdit = ({ level }) => {

   const [statusSend, setStatusSend] = useState({});
   const [isReloading, setIsReloading] = useState(false);

   const save = (isPublished) => {
      const form = getValues();
      const formData = new FormData();

      /* const valueIsPublished = isPublished ? 1 : 0;

      for (let key in form) {
         if (key !== 'image_preview_url' && key !== 'parties' && form[key] !== null) {
            if (key === 'party') {
               formData.append(key, form[key].value);
            } else if (key === 'published') {
               formData.append(key, valueIsPublished)
            } else {
               formData.append(key, form[key]);
            }
         }
      }

      API.postChangeElement(formData)
         .then(response => setStatusSend(response)) */
   };

   /* React-hook-form */
   const schema = yup.object({
      text: yup.string()
         .typeError('Должно быть строкой')
         .min(2, 'Поле должно содержать минимум 2 символа')
         .required('Описание обязательно'),
      name: yup.string()
         .typeError('Должно быть строкой')
         .min(2, 'Поле должно содержать минимум 2 символа')
         .required('Адрес обязателен'),
      description: yup.string()
         .typeError('Должно быть строкой')
         .min(2, 'Поле должно содержать минимум 2 символа')
         .required('Адрес обязателен'),
   }).required();

   const {
      watch,
      register,
      formState: {
         errors,
         isValid,
      },
      handleSubmit,
      control,
      reset,
      setValue,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 2,
         description: '',
         name: '',
         text: '',
      }
   });

   window.getValues = getValues;
   window.errors = errors;
   window.isValid = isValid;

   const load = useCallback(async () => {
      setIsReloading(true);
      try {
         /* const data = await API.getItemContacts(deputId)
         const formattedData = {
            ...getValues(),
            name: data?.deputat?.name,
            text: data?.deputat?.text,
            description: data?.deputat?.description,
            image_preview_url: data?.deputat?.image_preview,
            phone: data?.deputat?.phone,
            email: data?.deputat?.email,
            party: +data?.deputat?.party,
         }
         reset(formattedData) */
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setIsReloading(false)
      }
   })

   useEffect(() => {
      load();
   }, []);

   const handler = useCallback((value, key) => {
      setValue(key, value);
   }, [])

   const onSubmit = () => {
      if (document.activeElement.attributes.name.value === 'publish') {
         save(true);
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         save(false);
      }
   };

   const accessLevel = useRequireAccessLevel(level)
   if (!accessLevel) {
      return null;
   }

   if (isReloading) {
      return <p>Загрузка...</p>
   }

   return (
      <div className="mt54">
         <ContantContainerAdmin>
            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle">Состав депутатских групп</h1>
               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">

                  <div className={`inputContainer`}>
                     <Textarea
                        type={'text'}
                        name={'text'}
                        errors={errors}
                        register={register}
                        label={'Текст партии'}
                        placeholder={'Введите текст партии'}
                        className={'inputTitle mt24'}
                        onChange={e => handler(e.target.value, "text")}
                     />
                  </div>

                  <div className={`inputContainer columnInput mt24`}>
                     <Input
                        type={'text'}
                        name={'name'}
                        errors={errors}
                        register={register}
                        label={'Заголовок'}
                        placeholder={'Не более 120 символов'}
                        className={'inputTitle mt24'}
                        onChange={e => handler(e.target.value, "name")}
                     />
                  </div>

                  <div className={`inputContainer mt24`}>
                     <ReactQuillForm
                        name={'description'}
                        errors={errors}
                        label={'Описание'}
                        placeholder={'Введите описание'}
                        control={control}
                     />
                  </div>


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
export default CompositionParliamentaryGroupsEdit;