import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './ContactsEdit.module.css';

import { useRequireAccessLevel, maskInput } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';
import API from 'API';
import Button from 'ComponentsAdmin/Button/Button';

const ContactsEdit = ({ level }) => {

   const id = 3646;

   const [statusSend, setStatusSend] = useState({});
   const [isReloading, setIsReloading] = useState(false);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const save = async () => {
      const form = getValues();
      const formData = new FormData();

      for (let key in form) {
         if (key !== 'image_preview_url' && key !== 'parties' && form[key] !== null) {
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
      phone: yup.string()
         .required('Укажите телефон')
         .transform((value) => {
            if (!value) return value; // Не преобразовывать, если значение отсутствует
            return value.startsWith('+7')
               ? '7' + value.slice(2).replace(/[^0-9]/g, '') // Если начинается с +7, заменяем +7 на 7
               : value.replace(/[^0-9]/g, ''); // Иначе просто удаляем все нецифровые символы
         })
         .test(
            'is-valid-digits',
            'Номер телефона должен содержать 11 цифр (включая 7 в начале)',
            (value) => {
               if (!value) return true; // Пропускаем undefined
               return value.length === 11; // Теперь ожидаем 11 цифр
            }
         )
         .test(
            'is-valid-format',
            'Используйте формат +7 (XXX) XXX-XX-XX',
            (value) => {
               if (!value) return true; // Пропускаем undefined
               if (value.length !== 11) return true; // Пропускаем, если не 11 цифр

               return /^[7]\(?\d{3}\)?\d{3}-?\d{2}-?\d{2}$/.test(value); // Изменили проверку формата
            }
         ),
      email: yup.string().email('Некорректный email').required('Обязательно'),
      address: yup.string()
         .typeError('Должно быть строкой')
         .min(5, 'Адрес должен содержать минимум 5 символов')
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
         address: '',
         name: '',
         text: '',
         phone: '',
         email: '',
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
            address: data?.address,
            phone: data?.phone,
            email: data?.email,
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

   const handler = useCallback((name, value) => {
      setValue(name, value);
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
            ) : <><h1 className="pageTitle">Контакты</h1>
               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">

                  <div className={`inputContainer`}>
                     <Textarea
                        type={'text'}
                        name={'text'}
                        errors={errors}
                        register={register}
                        label={'Описание'}
                        placeholder={'Введите описание'}
                        className={'inputTitle mt24'}
                        onChange={e => handler("text", e.target.value)}
                     />
                  </div>

                  <div className={'rowContainer'}>
                     <div className={`inputContainer columnInput mt24`}>
                        <Input
                           type={'tel'}
                           name={'phone'}
                           errors={errors}
                           register={register}
                           label={'Телефон'}
                           placeholder={'Телефон'}
                           className={'inputTitle mt24'}
                           onChange={e => handler("phone", maskInput(e.target.value, "+7 (000) 000-00-00"))}
                        />
                     </div>
                     <div className={`inputContainer columnInput mt24`}>
                        <Input
                           type={'mail'}
                           name={'email'}
                           errors={errors}
                           register={register}
                           label={'Почта'}
                           placeholder={'Почта'}
                           className={'inputTitle mt24'}
                           onChange={e => handler("email", e.target.value)}
                        />
                     </div>
                  </div>

                  <div className={`inputContainer mt24`}>
                     <Input
                        type={'text'}
                        name={'address'}
                        errors={errors}
                        register={register}
                        label={'Адрес'}
                        placeholder={'Введите адрес'}
                        className={'inputTitle mt24'}
                        onChange={e => handler("address", e.target.value)}
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
export default ContactsEdit;