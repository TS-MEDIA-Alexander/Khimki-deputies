import React, { useState, useCallback, useEffect } from 'react';
import s from './InternetResources.module.css';
import ContantContainerAdmin from 'total/ContantContainerAdmin';

import { useRequireAccessLevel } from 'utils';
import API from 'API';

import preloader from '../../assets/icons/preloader.svg';

const InternetResources = ({ level }) => {

   const id = 3651;

   const [form, setForm] = useState([])

   const [isReloading, setIsReloading] = useState(false);
   const [statusSend, setStatusSend] = useState({});
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const save = async () => {
      const formData = new FormData();
      const value = JSON.stringify({ links: form });

      formData.append('content_category_id', 6);
      formData.append('id', id);
      formData.append('name', 'Интернет-ресурсы');
      formData.append('json', value);

      try {
         const response = await API.postChangeElement(formData);
         if (response) {
            setStatusSend(response);
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

   const handler = (index, field, value) => {
      // Создаем копию текущего состояния формы
      const newForm = [...form];

      // Обновляем значение поля в соответствующем объекте
      newForm[index][field] = value;

      // Обновляем состояние формы
      setForm(newForm);
   };

   const onSubmit = () => {
      setPreloading(true);
      save();
   };

   const getItem = useCallback(async () => {
      setIsReloading(true);
      try {
         const data = await API.getContent(id);
         setForm(data.links)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } finally {
         setIsReloading(false)
      }
   })

   useEffect(() => {
      getItem();
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
            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><div className="pageTitle mt40">Интернет-ресурсы</div>

               {form.map((el, i) => <div className="rowContainer mt24" key={i}>
                  <div className="inputContainer columnInput">
                     <div className={`inputContainer ${s.inputContainer}`}>
                        <label className='body-s-400 ml8' htmlFor={'name'}>Заголовок</label>
                        <input
                           type="text"
                           id={`name-${i}`}
                           placeholder={'Название ресурса'}
                           className={`inputTitle`}
                           value={el.name}
                           onChange={(e) => handler(i, 'name', e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="inputContainer columnInput">
                     <div className={`inputContainer ${s.inputContainer}`}>
                        <label className='body-s-400 ml8' htmlFor={'name'}>Ссылка на ресурс</label>
                        <input
                           type="text"
                           id={`name-${i}`}
                           placeholder={'Название ресурса'}
                           className={`inputTitle`}
                           value={el.link}
                           onChange={(e) => handler(i, 'link', e.target.value)}
                        />
                     </div>
                  </div>
               </div>
               )}

               <div className="rowContainer mt40">
                  <button
                     type='submit'
                     className={`publishBtn ${preload ? 'disable' : ''}`}
                     name="publish"
                     onClick={onSubmit}
                  >{preload && <img src={preloader} alt="" className='preloader' />}
                     Опубликовать</button>
               </div>
            </>}
            {unexpectedError?.title ? (
               <div className="pageTitle err">{unexpectedError.title}</div>
            ) : false}

         </ContantContainerAdmin>
      </div>
   )
}

export default InternetResources;
