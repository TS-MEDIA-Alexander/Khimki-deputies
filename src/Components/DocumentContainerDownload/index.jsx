import React from "react";
import s from "./DocumentContainerDownload.module.css";
import clearX from '../../assets/icons/clearX.svg';
import IconWordPdfText from "Components/IconWordPdfText";

const DocumentContainerDownload = ({
   document,
   documentName,
   title,
   text,
   date,
   format,
   id,
   deleteFn
}) => {

   return (
      <div className={s.documentContainer}>
         <a
            target="_blank"
            rel="noopener noreferrer"
            download={documentName}
            href={document}
            className={s.link}
         >
            <div className={s.imgContainer}>
               {/* {format?.toLowerCase().includes("doc") ? (
                  <img className={`${s.documentIcon} ${s.DOCX}`} src={doc} alt="" />
               ) : format?.toLowerCase().includes("xls") ? (
                  <img className={`${s.documentIcon} ${s.XLS}`} src={xls} alt="" />
               ) : format?.toLowerCase().includes("zip") ||
                  format?.toLowerCase().includes("rar") ? (
                  <img
                     className={`${s.documentIcon} ${s.ARCHIVE}`}
                     src={archive}
                     alt=""
                  />
               ) :
                  format?.toLowerCase().includes("png") ? (
                     <img
                        className={`${s.documentIcon} ${s.ARCHIVE}`}
                        src={archive}
                        alt=""
                     />
                  ) : (
                     <img className={`${s.documentIcon} ${s.PDF}`} src={pdf} alt="" />
                  )} */}
               {
                  format?.match(/(jpg|jpeg|png|gif|svg)$/i) ?
                     <IconWordPdfText type={'IMG'} /> :
                     format?.match(/(doc|docx)$/i) ? <IconWordPdfText type={'DOCX'} /> :
                        format?.match(/(PDF)$/i) ? <IconWordPdfText type={'PDF'} /> :
                        format?.match(/(xlsx|xls)$/i) ? <IconWordPdfText type={'XLS'} /> :
                           <IconWordPdfText type={'anotherFile'} />
               }
            </div>
            <div className={s.textInner}>
               <div className={s.title}>{title}.{format}</div>
               <div className="mt4"></div>
               {text}
            </div>
         </a>
         {deleteFn && <div onClick={() => deleteFn(id)} className={s.deleteBtn}><img src={clearX} alt="" /></div>}
         {date && <div className={s.datePublication}>от {date}</div>}
      </div>
   );
};
export default DocumentContainerDownload;
