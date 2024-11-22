import React from 'react';
import ContantContainerMain from '../../total/ContantContainerMain';
import s from './CommunalServices.module.css';

import { NavLink } from "react-router-dom";
import { ROUTER } from '../../config';
import arrow from '../../assets/icons/arrow_btn_link.svg';


const CommunalServices = (props) => {
   return (
      <div>
         <ContantContainerMain>
            <div className={`mt80 breadcrumbs`}>
               <NavLink to={ROUTER.activity.main} className='breadcrumbsFrom'>Деятельность</NavLink>
               <span className='breadcrumbsTo'> / ЖКХ</span>
            </div>
            <div className={`mt24 pageTitle`}>ЖКХ</div>

            <div className={`mt80 borderMain ${s.linkContainer}`}>
               <NavLink /* to={ROUTER.khimkiDistrict.unionSummerResidents} */ className={`${s.link}`}>Управляющие организации г. о. Химки<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.associationApartmentBuildingsKhimki} */ className={`mt24 ${s.link}`}>Реестр смены управления МКД<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Оплатить жилищно-коммунальные услуги<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Содействие управлению многоквартирными домами<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Раздельный сбор мусора<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Ежемесячная денежная компенсация<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Дни открытых дверей<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Графики отключения горячей воды<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Плановые отключения электроэнергии<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Общее собрание собственников помещений в многоквартирном доме в форме заочного голосования с использованием системы (ЕАИС ЖКХ Московской области)<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>График включения отопления в городском округе Химки на 2020 год<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Социальная газификация<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Ремонт подъездов с использованием средств субсидий<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
               <NavLink /* to={ROUTER.khimkiDistrict.mooAgainstCorruption} */ className={`mt24 ${s.link}`}>Новости<div className={`btnCircleG ${s.imgContainer}`}><img src={arrow} alt="" /></div></NavLink>
            </div>

            <div className="mt80 pageSubtitle">Cделаем подмосковье безопасным вместе! </div>
            <div className={`mt38 text`}>
               <p>
                  В 2023 году в Химках дополнительно установят 2000 камер видеонаблюдения, подключенные к системе «Безопасный регион». В первую очередь более 700 видеокамер установят на детских и спортивных площадках. Видеофиксация будет работать непрерывно, а видеоархив доступен не менее 30 суток, что позволит существенно снизить уровень преступности и повысить безопасность.
               </p>
               <p>
                  Всего в округе установлены более 5000 камер – на улицах, контейнерных площадках, во дворах, парках, скверах, на входных группа подъездов многоквартирных домов, у социально значимых объектов и торговых центров. В планах администрации Химок покрыть видеонаблюдением всю территорию города, включая поселения Луневское и Кутузовское, которые вошли в состав округа с 1 января 2023 года.
               </p>
               <p>
                  За 2022 год с помощью камер видеонаблюдения, подключенных к системе «Безопасный регион», раскрыто 198 преступлений и зафиксировано 2500 правонарушений
               </p>

            </div>


         </ContantContainerMain>
      </div>
   )
}
export default CommunalServices;