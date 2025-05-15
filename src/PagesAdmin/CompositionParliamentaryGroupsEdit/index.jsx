import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './CompositionParliamentaryGroupsEdit.module.css';

import '../../total/quill.snow.css';
import API from '../../API';
import { useRequireAccessLevel, maskInput } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import ReactQuillForm from 'ComponentsAdmin/FormElements/ReactQuill';
import Button from 'ComponentsAdmin/Button/Button';

const CompositionParliamentaryGroupsEdit = ({ level }) => {

   const id = 3645;

   const [statusSend, setStatusSend] = useState({});
   const [isReloading, setIsReloading] = useState(false);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const save = async () => {
      const form = getValues();
      const formData = new FormData();

      for (let key in form) {
         if (form[key] !== null) {
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
         content_category_id: 6,
         id: id,
         name: '',
         text: '',
         description: '',
      }
   });

   const getItem = useCallback(async () => {
      setIsReloading(true);
      try {
         const data = await API.getContent(id)
         const formattedData = {
            ...getValues(),
            name: data?.name,
            text: data?.text,
            description: data?.description,
         }
         reset(formattedData)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setIsReloading(false)
      }
   })

   useEffect(() => {
      getItem();
   }, []);

   const handler = useCallback((value, key) => {
      setValue(key, value);
   }, [])

   const onSubmit = () => {
      setPreloading(true);
      save();
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
                     <ReactQuillForm
                        name={'text'}
                        errors={errors}
                        label={'Текст партии'}
                        placeholder={'Введите текст партии'}
                        control={control}
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

         </ContantContainerAdmin>
      </div>
   )
}
export default CompositionParliamentaryGroupsEdit;