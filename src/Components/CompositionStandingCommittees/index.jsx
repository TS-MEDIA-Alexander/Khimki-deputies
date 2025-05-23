import React, { useEffect, useState } from 'react';
import s from './CompositionStandingCommittees.module.css';
import API from 'API';

const CompositionStandingCommittees = ({ isActive }) => {

   const [data, setData]=useState({})

   const getItem = async () => {
      try {
         const data = await API.getContent(3644);
         setData(data);
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      } 
   }

   useEffect(() => {
      getItem();
   }, [])

   return (
      <div className={`${s.tabPage} ${isActive === 'compositionStandingCommittees' && s.active}`}>
         <div className="text">
            <div className="pageTitle mt80">Состав постоянных депутатских комиссий</div>
            <div className={`mt40`} dangerouslySetInnerHTML={{__html: data?.text}}></div>
           {/*  <div className={`mt40 ${s.bold}`}>1.1. Комиссия по вопросам бюджета, финансовой, налоговой и экономической политики:</div>
            <ol>
               <li>Суслов В.И. - председатель</li>
               <li>Томашов Н.А.</li>
               <li>Васильев А.В. - заместитель председателя</li>
               <li>Монастырская И.В.</li>
               <li>Смирнова Н.И.</li>
               <li>Кавторева Т.И.</li>
               <li>Мирзонов В.А.</li>
               <li>Федоров А.Д.</li>
            </ol>

            <div className={`mt40 ${s.bold}`}>1.2. Комиссия по вопросам строительства, землепользования и экологии:</div>
            <ol>
               <li>Каримов А.М.- председатель</li>
               <li>Федоров А.Д.</li>
               <li>Демченко Г.А.</li>
               <li>Каныгина Н.Г.</li>
               <li>Спирина И.А.</li>
               <li>Герасимов В.А.</li>
               <li>Шаипов Р.Н. - заместитель председателя</li>
               <li>Монастырская И.В.</li>
            </ol>

            <div className={`mt40 ${s.bold}`}>1.3. Комиссия по вопросам законодательства, местного самоуправления и депутатской этики:</div>
            <ol>
               <li>Шаипов Р.Н. - председатель</li>
               <li>Каримов А.М. - заместитель председателя</li>
               <li>Иноземцев Е.В.</li>
               <li>Беляева И.М.</li>
               <li>Ишкова Ю.С.</li>
               <li>Кавторева Т.И.</li>
            </ol>

            <div className={`mt40 ${s.bold}`}>1.4. Комиссия по вопросам образования, культуры, спорта, социальной политики и делам молодежи:</div>
            <ol>
               <li>Герасимов В.А. - председатель</li>
               <li>Каныгина Н.Г.</li>
               <li>Мирзонов В.А.</li>
               <li>Алиев Х.С.</li>
               <li>Абрамов Р.А. - заместитель председателя</li>
               <li>Беляева И.М.</li>
               <li>Болотова Г.А.</li>
               <li>Иноземцев Е.В.</li>
               <li>Мамай Ю.В.</li>
            </ol>

            <div className={`mt40 ${s.bold}`}>1.5.Комиссия по вопросам промышленности, транспорта, потребительского рынка и предпринимательства:</div>
            <ol>
               <li>Томашов Н.А. - председатель</li>
               <li>Васильев А.В.</li>
               <li>Кашников Н.А.</li>
               <li>Алиев Х.С. - заместитель председателя</li>
               <li>Абрамов Р.А.</li>
               <li>Болотова Г.А.</li>
               <li>Спирина И.А.</li>
            </ol>

            <div className={`mt40 ${s.bold}`}>1.6. Комиссия по вопросам жилищно-коммунального хозяйства и благоустройства:</div>
            <ol>
               <li>Демченко Г.А. - и.о. председателя</li>
               <li>Ишкова Ю.С.</li>
               <li>Мамай Ю.В.</li>
               <li>Кашников Н.А.</li>
               <li>Смирнова Н.И.</li>
               <li>Суслов В.И.</li>
            </ol> */}

         </div>
      </div>
   )
}
export default CompositionStandingCommittees;