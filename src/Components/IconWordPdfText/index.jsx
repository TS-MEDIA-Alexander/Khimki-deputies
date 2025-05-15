import React from 'react';
import s from './IconWordPdfText.module.css';
import pdf from '../../assets/icons/pdf.svg';
import doc from '../../assets/icons/doc.svg';
import img from '../../assets/icons/img.svg';
import xls from '../../assets/icons/xls.svg';
import anotherFile from '../../assets/icons/anotherFile.svg';

const IconWordPdfText = ({type}) => {
   return (
      <div className={s.imgContainer}>
         {type === 'DOCX' ? <img className={`${s.documentIcon} ${s.DOCX}`} src={doc} alt="" /> : 
         type === 'PDF' ? <img className={`${s.documentIcon} ${s.PDF}`} src={pdf} alt="" />:
         type === 'XLS' ? <img className={`${s.documentIcon} ${s.XLS}`} src={xls} alt="" />:
         type === 'IMG' ? <img className={`${s.documentIcon} ${s.IMG}`} src={img} alt="" />:<img className={`${s.documentIcon}`} src={anotherFile} alt="" />}
      </div>
   )
}
export default IconWordPdfText;