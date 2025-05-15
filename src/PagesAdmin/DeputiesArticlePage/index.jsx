import React, { useState, useEffect, useCallback } from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './DeputiesArticlePage.module.css';

import '../../total/quill.snow.css';
import { ROUTER } from '../../config';
import { NavLink } from 'react-router-dom';
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
import Button from 'ComponentsAdmin/Button/Button';

const DeputiesArticlePage = ({ level }) => {

   const [statusSend, setStatusSend] = useState({});
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const saveDeputat = async (isPublished) => {
      const form = getValues();
      const formData = new FormData();

      const valueIsPublished = isPublished ? 1 : 0;

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
      name: yup.string()
         .required('ФИО обязательно для заполнения')
         .test(
            'is-fio',
            'Некорректный формат ФИО.  Должно быть три слова, разделенных пробелами.',
            (value) => {
               if (!value) return false; // required проверит на пустоту

               const words = value.trim().split(/\s+/); // Разделяем по пробелам (и убираем лишние)
               return words.length === 3;
            }
         )
         .test(
            'is-cyrillic',
            'ФИО должно содержать только кириллические символы.',
            (value) => {
               if (!value) return true; // Пропускаем, если значение отсутствует
               return /^[а-яА-ЯёЁ\s-]+$/.test(value); // Проверяем на кириллицу, пробелы и дефисы
            }
         )
         .test(
            'name-case',
            'Каждое слово должно начинаться с заглавной буквы или быть полностью в верхнем регистре.',
            (value) => {
               if (!value) return true; // Пропускаем, если значение отсутствует
               const words = value.split(/\s+/);
               return words.every(word => /^[А-ЯЁ][а-яё-]+$|^[А-ЯЁ]+$/.test(word)); // Проверяем каждое слово
            }
         ),
      description: yup.string() //typeError выводит ошибку, когда не строка
         .test(
            'notEmpty',
            'Обязательно',
            (value) => {
               if (!value) return false;
               const cleanedValue = value.replace(/<p><br><\/p>/gi, '').trim();
               return cleanedValue.length > 0;
            }
         ),
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
      email: yup.string().email('Некорректный email'),
      party: yup.object().typeError('Обязательно').required(),
      image_preview: yup.mixed().test("fileSize", "The file is too large", (value) => {
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
      trigger, //для запуска ручной валидации поля
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
         name: '',
         text: '',
         description: '',
         image_preview: null,
         image_preview_url: '',
         phone: '',
         email: '',
         party: '',
         parties: [],
         published: 1,
      }
   });

   watch();

   const getParty = async () => {
      try {
         const data = await API.getParty();
         handler(data, 'parties');
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      }
   }

   useEffect(() => {
      getParty()
   }, []);

   const handleImageChange = useCallback((file) => {
      handler(file, 'image_preview'); // Сохраняем File для отправки

      if (file) {
         const url = window.URL.createObjectURL(file);
         handler(url, 'image_preview_url')
      } else {
         handler('', 'image_preview_url')
      }
      trigger('image_preview')
   }, [setValue]);

   useEffect(() => {
      return () => {
         // Отзываем URL при размонтировании
         const imageUrl = getValues('image_preview_url');
         if (imageUrl) {
            window.URL.revokeObjectURL(imageUrl);
         }
      };
   }, []);

   const handler = useCallback((value, key) => {
      setValue(key, value);
   }, [])

   const onSubmit = () => {
      setPreloading(true);
      if (document.activeElement.attributes.name.value === 'publish') {
         saveDeputat(true);
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         saveDeputat(false);
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
               <NavLink to={ROUTER.admin.deputies} className='breadcrumbsFrom'>Депутаты</NavLink>
               <span className='breadcrumbsTo'> / Добавить депутата </span>
            </div>
            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle mt40">Депутат</h1>
               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">
                  <div className='mt40'>
                     <UploadFileAdminMono
                        handler={handleImageChange}
                        title={'Загрузите обложку в форматах: jpeg, png'}
                        type={'single'}
                        keyData={'image_preview'}
                     />
                  </div>

                  <div className={`inputContainer mt24`}>
                     <Input
                        type={'text'}
                        name={'name'}
                        errors={errors}
                        register={register}
                        label={'ФИО'}
                        placeholder={'ФИО'}
                        className={'inputTitle mt24'}
                        onChange={e => handler(e.target.value, "name")}
                     />
                  </div>
                  <div className={s.inputContainerRow}>
                     <div className={`inputContainer mt24`}>
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
                     <div className={`inputContainer mt24`}>
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
                     <ReactQuillForm
                        name={'description'}
                        errors={errors}
                        label={'Описание'}
                        placeholder={'Текст о депутате'}
                        control={control}
                     />
                  </div>

                  <div className="inputContainer mt24">
                     <div className="body-s-400 ml8">Партия</div>
                     <ReactSelect
                        name='party'
                        valuesOptions={getValues('parties')}//Сюда передать данные списка выбора
                        isMulti={false}//множественный выбор
                        placeholder={'Партия'}
                        initialValue={getValues('parties')}//Выбранное/ые данные по дефолту. Если isMulti true, то передавать массив!
                        labelName={'name'}//Какие данные отображать в label (видимые пользователем)
                        valueName={'id'}//Какие данные отображать в value (видимые только нам)
                        isSearchable={true}//Тут можно отключить поиск
                        /* Взаимодействие с react-hook-form */
                        control={control}//для валидации с react-hook-form\
                        errors={errors}
                     />
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

               <div className="pageTitle mt40">Предпросмотр:</div>

               <Deputates
                  img={getValues('image_preview_url')}
                  name={getValues('name')}
                  tel={getValues('phone') || ''}
                  email={getValues('email') || ''}
                  text={getValues('description')}
                  description={getValues('description')}
                  partyId={getValues('party')}
               /></>}


         </ContantContainerAdmin>
      </div>
   )
}
export default DeputiesArticlePage;