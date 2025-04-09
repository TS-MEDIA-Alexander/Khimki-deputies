import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './ContactsEdit.module.css';

import { useRequireAccessLevel, maskInput } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import ReactQuillForm from 'ComponentsAdmin/FormElements/ReactQuill';
import Textarea from 'ComponentsAdmin/FormElements/Textarea';

const ContactsEdit = ({ level }) => {

   const [statusSend, setStatusSend] = useState({});
   const [isReloading, setIsReloading] = useState(false);

   const saveContacts = (isPublished) => {
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
         content_category_id: 2,
         address: '',
         name: '',
         text: '',
      }
   });

   const loadContacts = useCallback(async () => {
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
      loadContacts();
   }, []);

   const handler = useCallback((value, key) => {
      setValue(key, value);
   }, [])

   const onSubmit = () => {
      if (document.activeElement.attributes.name.value === 'publish') {
         saveContacts(true);
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         saveContacts(false);
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
                        onChange={e => handler(e.target.value, "text")}
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
                           onChange={e => handler(maskInput(e.target.value, "+7 (000) 000-00-00"), "phone")}
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
                           onChange={e => handler(e.target.value, "email")}
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
                        onChange={e => handler(e.target.value, "address")}
                     />
                  </div>


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
export default ContactsEdit;