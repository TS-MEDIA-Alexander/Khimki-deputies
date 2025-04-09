import React, { useState, useCallback, useEffect } from 'react';
import s from './InternetResources.module.css';
import ContantContainerAdmin from 'total/ContantContainerAdmin';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from 'ComponentsAdmin/FormElements/Input';
import { useRequireAccessLevel } from 'utils';
import API from 'API';

const InternetResources = ({ level }) => {
   const [isReloading, setIsReloading] = useState(false);
   const [statusSend, setStatusSend] = useState({});

   const saveNews = (isPublished) => {
      /*const form = getValues();
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
      } */

      /* API.postAddElement(formData)
         .then(response => {
            setStatusSend(response);
            reset();
         }) */
   };

   /* React-hook-form */
   /* const sourceSchema = yup.string()
      .typeError('Должно быть строкой')
      .min(2, 'Заголовок должен быть минимум 2 символа')
      .max(120, 'Не более 120 символов')
      .required('Обязательно');

   const urlSchema = yup.string()
      .matches(
         /^https?:\/\/.+/,
         'Некорректный URL: должен начинаться с http:// или https://'
      );
 */

   const schema = yup.object().shape({
      links: yup.array().of(
         yup.object().shape({
            name: yup.string().typeError('Должно быть строкой')
               .min(2, 'Заголовок должен быть минимум 2 символа')
               .max(120, 'Не более 120 символов')
               .required('Обязательно'),
            link: yup.string().url('Invalid URL').required('Link is required'),
         })
      ),
   });

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
         links: []
      }
   });

   const handler = useCallback((file, name) => {
      /* setValue(name, file); */
   }, [/* setValue */]);

   const onSubmit = () => {
      if (document.activeElement.attributes.name.value === 'publish') {
         saveNews(true);
      } else if (document.activeElement.attributes.name.value === 'saveDraft') {
         saveNews(false);
      }
   };

   /* window.getValues = getValues; */

   const loadResources = useCallback(async () => {
      setIsReloading(true);
      try {
         const data = await API.getContent(1, 14, 5);
         console.log(data)
         reset(data)
        /*  const formattedData = {}
         data.link.list.forEach((el, i) => {
            formattedData['name${i}'] = el.name;
            formattedData['URL${i}'] = el.link;
         }) */

         /* const formattedData = {
            ...getValues(),
            name: list?.deputat?.name,
            link: data?.deputat?.text,
         } */
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setIsReloading(false)
      }
   })

   useEffect(() => {
      loadResources()
   }, [])

   const accessLevel = useRequireAccessLevel(level);
   if (!accessLevel) {
      return null;
   }

   if (isReloading) {
      return <p>Загрузка...</p>
   }

   return (
      <div>
         <ContantContainerAdmin>
            <div className="pageTitle mt40">Интернет-ресурсы</div>
            <form onSubmit={console.log(1111)/* handleSubmit(onSubmit) */} className="text text_admin mt40">
               {[].map(el => <div className="rowContainer mt24">
                  <div className="inputContainer columnInput">
                     <Input
                        type={'text'}
                        name={el.name}
                        /* errors={errors} */
                        /* register={register} */
                        label={'Заголовок'}
                        placeholder={'Название ресурса'}
                        className={'inputTitle'}
                        onChange={e => handler(e.target.value, el.name)}
                     />
                  </div>
                  <div className="inputContainer columnInput">
                     <Input
                        type={'text'}
                        name={el.URL}
                        /* errors={errors}
                        register={register} */
                        label={'Ссылка '}
                        placeholder={'Ссылка на ресурс '}
                        className={'inputTitle'}
                        onChange={e => handler(e.target.value, el.URL)}
                     />
                  </div>
               </div>)}

               <div className="rowContainer mt40">
                  <button
                     type='submit'
                     className={`publishBtn ${/* !isValid &&  */'disable'}`}
                     /* disabled={!isValid} */
                     name="publish"
                  >Опубликовать</button>
                  <button
                     type='submit'
                     className={`unpublished ${/* !isValid &&  */'disable'}`}
                     /* disabled={!isValid} */
                     name="saveDraft"
                  >Сохранить без публикации</button>
               </div>
            </form>
         </ContantContainerAdmin>
      </div>
   )
}

export default InternetResources;
