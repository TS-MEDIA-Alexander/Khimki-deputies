import React, { useEffect, useState } from 'react';
import s from './LegalBasisActivity.module.css';

import ContantContainerMain from '../../total/ContantContainerMain';

import { NavLink } from 'react-router-dom';
import { ROUTER } from '../../config';
import DocumentContainerDownload from '../../Components/DocumentContainerDownload';
import API from 'API';
import { formatDateToEurope } from 'utils';

const LegalBasisActivity = (props) => {

   const [data, setData] = useState();

   const getItem = async () => {
      try {
         const value = await API.getContent(3641)
         setData(value);
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error)
      }
   }

   useEffect(() => {
      getItem();
   }, [])

   return (
      <div>
         <ContantContainerMain>
            <div className={`mt40 breadcrumbs`}>
               <NavLink to={ROUTER.main} className='breadcrumbsFrom'>Совет депутатов</NavLink>
               <span className={'breadcrumbsTo'}> / Правовая основа деятельности</span>
            </div>
            <h1 className="mt80 pageTitle">Правовая основа деятельности</h1>

            {data?.property?.document?.value.map(el => <div className="mt32">
               <DocumentContainerDownload
                  key={el.i}
                  document={el.src}
                  documentName={el.name}
                  title={el.name}
                  text={`${el.size} KB`}
                  date={formatDateToEurope(el.created_at.split(' ')[0])}
                  format={el.src.split('.')[1]}
               />
            </div>)}
            {/* 
            <div className="mt40">
               <DocumentContainerDownload title='Приложение к решению 08-8.doc' text='164 KB' date='20.12.2023' type='DOCX' format={'DOCX'} />
            </div>
            <div className="mt32">
               <DocumentContainerDownload title='УСТАВ_окончательный_31.08.16.pdf' text='549.81 KB' date='20.12.2023' format={'DOCX'} />
            </div>
            <div className="mt32">
               <DocumentContainerDownload title='Федеральный закон от 06.10.2003 N 131-ФЗ (ред. от 05.12.2017.rtf' text='349.32 KB' date='20.12.2023' type='DOCX' format={'DOCX'} />
            </div> */}
         </ContantContainerMain>
      </div>
   )
}
export default LegalBasisActivity;