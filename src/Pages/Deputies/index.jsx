import React, { useState } from 'react';
import s from './Deputies.module.css';
import ContantContainerMain from '../../total/ContantContainerMain';
import { ROUTER } from '../../config';
import { NavLink } from 'react-router-dom';
import StructureCouncilDeputies from '../../Components/StructureCouncilDeputies';
import ScheduleReceptionDeputies from '../../Components/ScheduleReceptionDeputies';
import AwardsCouncilDeputies from '../../Components/AwardsCouncilDeputies';
import RulesParliamentaryEthics from '../../Components/RulesParliamentaryEthics';

const Deputies = (props) => {

   const [tabActive, settabActive] = useState('structureCouncilDeputies');

   return (
      <div>
         <ContantContainerMain>
            <div className={`mt40 breadcrumbs`}>
               <NavLink to={ROUTER.main} className='breadcrumbsFrom'>Совет депутатов</NavLink>
               <span className='breadcrumbsTo'> / Депутаты</span>
            </div>
            <div onClick={(el) => el.target.id && settabActive(el.target.id)} className={`${s.tabsContainerRow}  mt40`}>
               <div id='structureCouncilDeputies' className={`${s.tab} ${tabActive === 'structureCouncilDeputies' && s.active}`}>Структура Совета депутатов</div>
               <div id='scheduleReceptionDeputies' className={`${s.tab} ${tabActive === 'scheduleReceptionDeputies' && s.active}`}>График приема депутатов</div>
               <div id='awardsCouncilDeputies' className={`${s.tab} ${tabActive === 'awardsCouncilDeputies' && s.active}`}>Награды Совета депутатов</div>
               <div id='rulesParliamentaryEthics' className={`${s.tab} ${tabActive === 'rulesParliamentaryEthics' && s.active}`}>Правила депутатской этики</div>
            </div>

            <div className="mt80">
               <StructureCouncilDeputies isActive={tabActive} />
               <ScheduleReceptionDeputies isActive={tabActive} />
               <AwardsCouncilDeputies isActive={tabActive} />
               <RulesParliamentaryEthics isActive={tabActive} />
            </div>

         </ContantContainerMain>
      </div>
   )
}
export default Deputies;