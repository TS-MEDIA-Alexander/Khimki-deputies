import React, { useState, useEffect, useCallback } from 'react';
import s from './NewsArticlePageEdit.module.css';
import ContantContainerAdmin from "../../total/ContantContainerAdmin";

import NewsArticle from '../../PagesAdmin/NewsArticle';
import { ROUTER } from '../../config';
import { NavLink, useParams } from 'react-router-dom';
import API from '../../API';
import UploadFileAdminMono from 'total/UploadFileAdminMono';
import CalendarSingle from '../../total/CalendarSingle'
import { maskInputTime, formatDateToEurope, formatDateToUS } from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import ReactQuillForm from 'ComponentsAdmin/FormElements/ReactQuill';

const NewsArticlePageEdit = (props) => {

   const newsId = useParams().id.slice(3);

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);

   const saveNews = (isPublished) => {
      const form = getValues();
      const formData = new FormData();

      const value = formatDateToUS(form.published_from_date) + " " + form.published_from_time + ":00";
      const valueIsPublished = isPublished ? 1 : 0;

      for (let key in form) {
         if (key !== 'image_preview_url' &&
            key !== 'published_from_date' &&
            key !== 'published_from_time' &&
            form[key] !== null) {
            if (key === 'published_from') {
               formData.append(key, value)
            } else if (key === 'published') {
               formData.append(key, valueIsPublished)
            } else
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
      description: yup.string().typeError('Должно быть строкой')//typeError выводит ошибку, когда не строка
         .max(500, 'Не более 500 символов'),
      text: yup.string().nullable()
         .test('notEmpty', 'Обязательно', (value) => {
            if (!value) return false;
            const cleanedValue = String(value).replace(/<p><br><\/p>/gi, '').trim();
            return cleanedValue.length > 0;
         }),
      published_from_time: yup.string()
         .required('Обязательно')
         .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени (hh:mm)')
         .test(
            'validTime',
            'Недопустимое время',
            (value) => {
               if (!value) return true; // Пропускаем, если значение отсутствует (required уже проверит это)

               const [hours, minutes] = value.split(':');
               const parsedHours = parseInt(hours, 10);
               const parsedMinutes = parseInt(minutes, 10);

               if (isNaN(parsedHours) || isNaN(parsedMinutes)) {
                  return false; // Не удалось преобразовать в число
               }

               return parsedHours >= 0 && parsedHours <= 23 && parsedMinutes >= 0 && parsedMinutes <= 59;
            }
         ),
      image_preview_url: yup.string().nullable(), // Допускаем null, если поле может быть пустым
      image_preview: yup.mixed().when('image_preview_url', {
         is: (image_preview_url) => image_preview_url,  // Проверяем, есть ли значение в image_preview_url
         then: () => yup.mixed().notRequired(), // Если image_preview_url есть, то image_preview не требуется
         otherwise: () => yup.mixed().test(
            'fileSize',
            'The file is too large',
            (value) => {
               if (!value || !value[0]) return false; // image_preview обязателен, проверяем, что он есть
               return value[0].size <= 2000000;
            }
         ).required('Image is required'),
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
      control,
      reset,
      setValue,
      getValues,
   } = useForm({
      mode: 'all',
      resolver: yupResolver(schema),
      defaultValues: {
         content_category_id: 1,
         id: newsId,
         name: '',
         description: '',
         text: '',
         image_preview: null,
         image_preview_url: null,
         published_from_date: '',
         published_from_time: '',
         published_from: '',
         published: 1,
         favorite: 0
      }
   });

   window.getValues = getValues

   watch();

   const getItemNews = async () => {
      setLoading(true);
      try {
         const data = await API.getItemNews(newsId)
         const formattedData = {
            ...getValues(),
            name: data?.name,
            description: data?.description || '',
            text: data?.text,
            image_preview_url: data?.image_preview,
            published_from_date: formatDateToEurope(data?.published_from?.split(' ')[0]),
            published_from_time: data?.published_from?.split(' ')[1]?.slice(0, 5),
            favorite: data?.favorite,
         }
         reset(formattedData);
         trigger(null)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      if (newsId) { // Загружаем данные только если newsId есть
         getItemNews();
      } else {
         setLoading(false);
      }
   }, [newsId])

   const handleImageChange = useCallback((file) => {
      handler(file, 'image_preview'); // Сохраняем File для отправки

      if (file) {
         const url = window.URL.createObjectURL(file);
         handler(url, 'image_preview_url')
      } else {
         handler('', 'image_preview_url')
      }
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

   const handler = useCallback((file, name) => {
      setValue(name, file);
      trigger(null);
   }, [setValue]);

   const onSubmit = () => {
      if (document.activeElement.attributes.name.value === 'publish') {
         saveNews(true);
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         saveNews(false);
      }
   };

   if (loading) {
      return <div>Загрузка...</div>; // Отображаем индикатор загрузки
   }

   return (
      <div className="mt54">
         <ContantContainerAdmin>
            <div className={`breadcrumbs`}>
               <NavLink to={ROUTER.admin.news} className='breadcrumbsFrom'>Новости</NavLink>
               <span className='breadcrumbsTo'> / {getValues("name")} </span>
            </div>

            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle mt40">Редактировать новость</h1>
               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">
                  <div className='mt40'>
                     <UploadFileAdminMono
                        name={'image_preview'}
                        key={'image_preview'}
                        handler={handleImageChange}
                        title={'Загрузите обложку в форматах: jpeg, png'}
                        type={'single'}
                        keyData={'image_preview'}
                        selectedFile={getValues('image_preview')}
                     />
                  </div>

                  <div className="rowContainer mt24">
                     <div className="calendarContainer">
                        <CalendarSingle onChange={e => handler(e, "published_from_date")} />
                        <div className="inputContainer">
                           <div className="body-s-400 ml8">Дата</div>
                           <input
                              onChange={() => false}
                              placeholder='DD:MM:YY'
                              className='inputCalendar inputTitle'
                              type="text"
                              value={getValues("published_from_date")}
                           />
                        </div>
                     </div>

                     <div className="inputContainer">
                        <Input
                           type={'text'}
                           name={'published_from_time'}
                           errors={errors}
                           register={register}
                           label={'Время'}
                           placeholder={'HH:MM'}
                           className={'inputTitle'}
                           onChange={e => handler(maskInputTime(e.target.value), "published_from_time")}
                        />
                     </div>
                  </div>

                  <div className={`inputContainer mt24`}>
                     <Input
                        type={'text'}
                        name={'name'}
                        errors={errors}
                        register={register}
                        label={'Заголовок'}
                        placeholder={'Не более 120 символов'}
                        className={'inputTitle mt24'}
                        onChange={(e) => handler(e.target.value, "name")}
                     />
                  </div>
                  <div className={`mt24`}>
                     <Input
                        type={'text'}
                        name={'description'}
                        errors={errors}
                        register={register}
                        label={'Подзаголовок'}
                        placeholder={'Не обязателен для заполнения'}
                        className={'inputTitle mt24'}
                        onChange={(e) => handler(e.target.value, "description")}
                     />
                  </div>

                  <div className={`inputContainer mt24`}>
                     <ReactQuillForm
                        name={'text'}
                        errors={errors}
                        label={'Описание'}
                        placeholder={'Введите текст новости'}
                        control={control}
                     />
                  </div>

                  <div className="checkboxContainer mt24">
                     <input
                        className='mainInput'
                        onChange={() => handler(getValues("favorite") ? 0 : 1, "favorite")}
                        checked={getValues('favorite')}
                        type="checkbox"
                        name="checkboxMain"
                        id='checkboxMain'
                     />
                     <label htmlFor="checkboxMain">Сделать новость главной</label>
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

               <div className="h3-600 mt40">Предпросмотр:</div>

               <NewsArticle
                  img={getValues("image_preview_url")}
                  title={getValues("name")}
                  text={getValues("text")}
               />
            </>}
         </ContantContainerAdmin>
      </div >
   )
}
export default NewsArticlePageEdit;