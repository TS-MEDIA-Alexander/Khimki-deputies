import React from 'react';
import s from './MenuAdmin.module.css';

import { NavLink } from 'react-router-dom';
import { ROUTER } from '../../config';
import { useSelector } from 'react-redux';
import SpoilerContainerAdmin from 'ComponentsAdmin/SpoilerContainer';
import SpoilerItemAdmin from 'ComponentsAdmin/SpoilerContainer/SpoilerItemAdmin';

const MenuAdmin = (props) => {

   const currentAccesLevel = useSelector(state => state.auth.user.accessLevel)

   return (
      <div className={`${s.menuContainer} mt40`}>
         <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.news}>
            Новости
         </NavLink>
         {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.documents}>
            Документы
         </NavLink>}
         {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.internetResources}>
            Интернет-ресурсы
         </NavLink>}


         <SpoilerItemAdmin title={'Страницы'}>
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.charterAndSymbols}>
               Устав и символика
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.legalBasisActivity}>
               Правовая основа деятельности
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.deputies}>
               Структура Совета депутатов
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.scheduleReceptionDeputies}>
               График приема депутатов
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.awardsTheCouncilDeputiesEdit}>
               Награды Совета депутатов
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.rulesParliamentaryEthicsEdit}>
               Правила депутатской этики
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.compositionParliamentaryGroups}>
               Состав депутатских групп
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.compositionStandingCommitteesEdit}>
               Состав постоянных комиссий
            </NavLink>}
            {currentAccesLevel <= 1 && <NavLink className={({ isActive }) => (`body-m-400 ${s.linkMenu} ${isActive ? s.active : ''}`)} to={ROUTER.admin.contacts}>
               Контакты
            </NavLink>}
         </SpoilerItemAdmin>



      </div>
   )
}
export default MenuAdmin;