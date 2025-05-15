import React, { useState, useEffect, useCallback } from 'react';
import s from './ScheduleReceptionDeputiesEdit.module.css';
import ContantContainerAdmin from "../../total/ContantContainerAdmin";

import API from '../../API';
import UploadFileAdminMono from 'total/UploadFileAdminMono';
import useDeleteFile from 'utils';

/* React-hook-form */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DocumentContainerDownload from 'Components/DocumentContainerDownload';

import instruction from './../../assets/img/admin/internetResources/instruction.png';
import Button from 'ComponentsAdmin/Button/Button';

const ScheduleReceptionDeputiesEdit = (props) => {

   const id = 3652;

   const [statusSend, setStatusSend] = useState({});
   const [loading, setLoading] = useState(true);
   const [unexpectedError, setUnexpectedError] = useState({});
   const [preload, setPreloading] = useState(false);

   const save = async () => {
      const form = getValues();
      const formData = new FormData();

      for (let key in form) {
         if (key !== 'value' &&
            key !== 'file_delete' &&
            form[key] !== null) {
            if (key === "file_add") {
               if (form[key]) {
                  formData.append(`file_add`, form[key])
               }
            } else formData.append(key, form[key]);
         }
      }

      try {
         const response = await API.postGraficOfDeputies(formData);
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
      file_add: yup.mixed().test("fileSize", "The file is too large", (value) => {
         if (!value.length) return true // attachment is optional
         return value[0].size <= 2000000
      })
         .required('Please select a file'), // Поле обязательно, если есть файл
   });

   const {
      watch, //для ререндера страницы при изменении состояния формы
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
         content_category_id: 6,
         id: id,
         name: 'График приема депутатов',
         value: [],
         file_add: [],
      }
   });

   watch();

   const deleteFile = useDeleteFile(setValue, getValues);

   const getItem = async () => {
      setLoading(true);
      try {
         const data = await API.getContent(id);
         const formattedData = {
            ...getValues(),
            name: data?.name || 'График приема депутатов',
            value: [data?.property?.document?.value[data?.property?.document?.value?.length - 1]],
         }
         reset(formattedData)
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error)
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      getItem();
   }, [])

   const handleFileChange = useCallback((file) => {
      handler(file, 'file_add'); // Сохраняем File для отправки
      handler(file || [], 'value');
      trigger('file_add');
   }, [setValue]);

   const handler = useCallback((file, name) => {
      setValue(name, file);
   }, [setValue]);

   const onSubmit = () => {
      setPreloading(true);
      save();
   };

   if (loading) {
      return <div>Загрузка...</div>; // Отображаем индикатор загрузки
   }

   return (
      <div className="mt54">
         <ContantContainerAdmin>
            {statusSend?.result ? (
               <div className="pageTitle mt160">{statusSend.title}</div>
            ) : <><h1 className="pageTitle">График приема депутатов</h1>

               <form onSubmit={handleSubmit(onSubmit)} className="text text_admin mt40">
                  <div className={` ${s.imgContainer}`}>
                     <img src={instruction} alt="" />
                  </div>
                  <div className='mt40'>
                     <UploadFileAdminMono
                        handler={handleFileChange}
                        title={'Загрузите документы в форматах: doc, docx, xls, xlsx, pdf, zip, rar'}
                        type={'single'}
                        keyData={'file_add'}
                        id={'gerb'}
                     />
                  </div>

                  {getValues()?.value[0] ? <div className='mt8 fileContainer'>
                     {getValues()?.value?.map(el => <DocumentContainerDownload
                        key={el.id}
                        id={el.id}
                        format={el.format}
                        title={el.name}
                        deleteFn={(id) => deleteFile(id)}
                     />)}
                  </div> : false}

                  <div className="rowContainer mt40">
                     <Button
                        isValid={isValid}
                        preload={preload}
                        classNames={'publishBtn'}
                        text={'Опубликовать'}
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
export default ScheduleReceptionDeputiesEdit;