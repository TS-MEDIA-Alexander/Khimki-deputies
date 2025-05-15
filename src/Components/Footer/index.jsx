import React, { useCallback, useEffect, useState } from 'react';
import ContantContainerMain from '../../total/ContantContainerMain';
import logo from '../../assets/img/logos/full-logo-footer.svg';
import s from './Footer.module.css';
import { NavLink } from 'react-router-dom';
import { ROUTER } from '../../config';
import API from 'API';
import { useSelector } from 'react-redux';

const Footer = (props) => {

   const [resources, setResources] = useState([])

   const getInternetResources = useCallback(async () => {
      try {
         const data = await API.getContent(3651);
         setResources(prev => data?.links || prev);
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error);
      }
   }, [])

   const size = Math.ceil(resources.length / 2);
   const firstResources = resources.slice(0, size);
   const secondResources = resources.slice(size);

   useEffect(() => {
      getInternetResources();
   }, [])

   const contacts = useSelector((state) => state.contacts);

   return (
      <div className={`mt160 ${s.footer}`}>
         <ContantContainerMain>
            <div className={s.columnContainer}>
               <div className={s.column}>
                  <NavLink to={ROUTER.main} className={s.logoBlock}>
                     <img src={logo} alt="" />
                     {/* <div className={s.textMain}>
                        <div className={s.titleAdministration}>СОВЕТ ДЕПУТАТОВ</div>
                        <div className={s.titleInfo}>Городского округа Химки Московской области</div>
                     </div> */}
                  </NavLink>
                  <div className={`mt48 ${s.contentContainer}`}>
                     <div className="description">{contacts?.phone}</div>
                     <div className="description mt12">{contacts?.email}</div>
                     <a href='https://yandex.ru/maps/-/CDto4BlU' target='_blank' className="description mt12">{contacts?.address}</a>
                  </div>
               </div>
               <div className={s.column}>
                  <div className={s.footerTitle}>Интернет-ресурсы</div>
                  <div className={s.columnContainer}>
                     <div className={s.column}>
                        {firstResources.map((el, i) => <a href={el.link} target='_blank' className="description mt12" key={i} >{el.name}</a>)}
                     </div>
                     <div className={`ml20 ${s.column}`}>
                        {secondResources.map((el, i) => <a href={el.link} target='_blank' className="description mt12" key={i} >{el.name}</a>)}
                     </div>
                  </div>
               </div>

               <div className={s.column}>
                  <div className={s.footerTitle}>Навигация</div>
                  {/* <div className="description mt12">Совет депутатов</div> */}
                  <NavLink to={ROUTER.documents} className="description mt12">Документы</NavLink>
                  <NavLink to={ROUTER.news} className="description mt12">Новости</NavLink>
                  <NavLink to={ROUTER.contacts.main} className="description mt12">Контакты</NavLink>
                  <a href='https://old.sdhimki.ru/elektronnaya-priemnaya/' target='_blank' className="description mt12">Электронная приемная </a>
               </div>
            </div>

            <div className={`${s.rowContainer}`}>
               <div className={s.info}>Сделано - TS Media</div>
               <div className={s.info}>© 2025 Официальный сайт «Совета депутатов Городского округа Химки». Все права защищены.</div>
            </div>
         </ContantContainerMain>
      </div>
   )
}
export default Footer;