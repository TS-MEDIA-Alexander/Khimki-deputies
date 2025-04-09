import React from 'react';
import ContantContainerMain from '../../total/ContantContainerMain';
import logo from '../../assets/img/logos/full-logo-footer.svg';
import s from './Footer.module.css';
import { NavLink } from 'react-router-dom';
import { ROUTER } from '../../config';

const Footer = (props) => {
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
                  <div className="mt48">
                     <div className="description">+7 (495) 793-50-55</div>
                     <div className="description mt12">sovetdep-himki@yandex.ru</div>
                     <a href='https://yandex.ru/maps/-/CDto4BlU' target='_blank' className="description mt12">141400, Московская область, <br /> г. Химки, ул. Московская, д.15</a>
                  </div>
               </div>
               <div className={s.column}>
                  <div className={s.footerTitle}>Интернет-ресурсы</div>
                  <div className={s.columnContainer}>
                     <div className={s.column}>
                        <a href='http://www.kremlin.ru/' target='_blank' className="description mt12">Сайт Президент Российской Федерации</a>
                        <a href='http://www.council.gov.ru/' target='_blank' className="description mt12">Совет Федерации РСФСР</a>
                        <a href='http://www.duma.gov.ru/' target='_blank' className="description mt12">Государственная Дума Федерального Собрания РФ</a>
                        <a href='http://www.szrf.km.duma.gov.ru/' target='_blank' className="description mt12">Совет законодателей российской федерации</a>
                        <a href='https://mosreg.ru/' target='_blank' className="description mt12">Правительство Московской области</a>
                     </div>
                     <div className={`ml20 ${s.column}`}>
                        <a href='https://www.oprf.ru/about/interaction/region_chambers/1445/1435/newsitem/7812' target='_blank' className="description mt12">Общественной палаты Московской области</a>
                        <div href='http://www.moscow_reg.vybory.izbirkom.ru/region/moscow_reg' target='_blank' className="description mt12">Избирательная комиссия Московской области</div>
                        <a href='http://www.admhimki.ru/' target='_blank' className="description mt12">Администрация городского округа Химки</a>
                        <a href='https://ksphimki.ru/' target='_blank' className="description mt12">Контрольно-счётная палата городского округа Химки </a>
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