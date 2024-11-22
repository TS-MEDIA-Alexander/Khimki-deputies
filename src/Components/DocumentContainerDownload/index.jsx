import React from 'react';
import s from './DocumentContainerDownload.module.css';
import pdf from '../../assets/icons/pdf.svg';
import doc from '../../assets/icons/doc.svg';

const DocumentContainerDownload = ({ document, documentName, title, text, date, type }) => {
   return (
      <div className={s.documentContainer}>
         <a
            download={documentName}
            href={document} className={s.link}>
            <div className={s.imgContainer}>
               {type === 'DOCX' ? <img className={`${s.documentIcon} ${s.DOCX}`} src={doc} alt="" /> : <img className={`${s.documentIcon} ${s.PDF}`} src={pdf} alt="" />}
            </div>
            <div className={s.textInner}>
               <div className={s.title}>{title}</div>
               <div className="mt4"></div>
               {text}
            </div>
         </a>
         {date && <div className={s.datePublication}>от {date}</div>}
      </div>
   )
}
export default DocumentContainerDownload;