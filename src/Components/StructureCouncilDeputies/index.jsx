import React from 'react';
import s from './StructureCouncilDeputies.module.css';
import Deputates from '../Deputates';

import Dryannov from '../../assets/img/deputates/Dryannov.png';
import Abramov from '../../assets/img/deputates/Abramov.png';
import Aliyev from '../../assets/img/deputates/Aliyev.png';
import Belyaeva from '../../assets/img/deputates/Belyaeva.png';
import Bolotova from '../../assets/img/deputates/Bolotova.png';
import Malinovsky from '../../assets/img/deputates/Malinovsky.png';

import KPRFlogo from '../../assets/img/parties/KPRF.svg';
import yedinayaRossiyalogo from '../../assets/img/parties/yedinayaRossiya.svg';
import spravedlivayaRossiyalogo from '../../assets/img/parties/spravedlivayaRossiya.svg';

const StructureCouncilDeputies = ({ isActive }) => {

   const spravedlivayaRossiya = { name: '«Справедливая Россия»', logo: spravedlivayaRossiyalogo };
   const KPRF = { name: 'КПРФ', logo: KPRFlogo };
   const yedinayaRossiya = { name: '«ЕДИНАЯ РОССИЯ»', logo: yedinayaRossiyalogo };

   return (
      <div className={`${s.tabPage} ${isActive === 'structureCouncilDeputies' && s.active}`}>
         <div className={`${s.columnContainer}`}>
            <div>
               <div className="pageTitle">Депутаты</div>
               <Deputates
                  img={Dryannov}
                  name={'Дряннов Александр Павлович'}
                  tel={'+7 (495) 793-50-55'}
                  email={'sovetdep-himki@yandex.ru'}
                  vkLink={'https://vk.com/public215781194'}
                  okLink={'https://ok.ru/group/70000000517828'}
                  text={"Совет депутатов городского округа Химки Московской области, Заместитель председателя Совета депутатов городского округа Химки Московской области <br /><br /> Депутат по избирательному округу №3"}
                  party={yedinayaRossiya}
               />
               <Deputates
                  img={Abramov}
                  name={'Абрамов Роман Андреевич'}
                  tel={'+7 (984) 444-43-33'}
                  email={'Abramov_Roman_Andreyevich@mail.ru'}
                  vkLink={'https://vk.com/public215781194'}
                  okLink={'https://ok.ru/group/70000000517828'}
                  text={`Индивидуальный предприниматель <br /><br /> Депутат по избирательному округу №4 <br /><br /> Член постоянных депутатских комиссий: <br /><br /> <ol> 
            <li>Комиссия по вопросам образования, культуры, спорта, социальной политики и делам молодежи</li>
            <li>Комиссия по вопросам промышленности, транспорта, потребительского рынка и предпринимательства</li>
            </ol>`}
                  party={KPRF}
               />
               <Deputates
                  img={Aliyev}
                  name={'Алиев Ханоглан Сале-оглы'}
                  tel={'+7 (926) 257-78-26'}
                  email={'alievxc@yandex.ru'}
                  vkLink={'https://vk.com/public215781194'}
                  okLink={'https://ok.ru/group/70000000517828'}
                  text={`Генеральный директор ООО "София - А" <br /><br /> Депутат по избирательному округу №2 <br /><br /> Член постоянных депутатских комиссий: <br /><br /> <ol> 
            <li>Комиссия по вопросам образования, культуры, спорта, социальной политики и делам молодежи</li>
            <li>Комиссия по вопросам промышленности, транспорта, потребительского рынка и предпринимательства</li>
            </ol>`}
                  party={spravedlivayaRossiya}
               />
               <Deputates
                  img={Belyaeva}
                  name={'Беляева Ирина Михайловна'}
                  tel={'+7 (910) 483-93-31'}
                  email={'belyaeva.irishka@yandex.ru'}
                  vkLink={'https://vk.com/public215781194'}
                  okLink={'https://ok.ru/group/70000000517828'}
                  text={`Муниципальное бюджетное общеобразовательное учреждение Гимназия № 4, учитель. <br /><br /> Депутат по избирательному округу №2 <br /><br /> Член постоянных депутатских комиссий: <br /><br /> <ol> 
            <li>Комиссия по вопросам законодательства, местного самоуправления и депутатской этики</li>
            <li>Комиссия по вопросам образования, культуры, спорта, социальной политики и делам молодежи</li>
            </ol>`}
                  party={yedinayaRossiya}
               />
               <Deputates
                  img={Bolotova}
                  name={'Болотова Галина Александровна'}
                  tel={'+7 (903) 616-63-45'}
                  email={'galina.bolotova@mail.ru'}
                  vkLink={'https://vk.com/public215781194'}
                  okLink={'https://ok.ru/group/70000000517828'}
                  text={`Детский сад комбинированного вида № 56 "Ромашка", заведующий
            <br /><br /> Депутат по избирательному округу №3
            <br /><br /> Заместитель руководителя депутатского объединения партии "Единая Россия" в Совете депутатов городского округа Химки
            <br /><br /> Член постоянных депутатских комиссий
            <br /><br /><ol> 
            <li>Комиссия по вопросам образования, культуры, спорта, социальной политики и делам молодежи</li>
            <li>Комиссия по вопросам промышленности, транспорта, потребительского рынка и предпринимательства</li>
            </ol>`}
                  party={yedinayaRossiya}
               />
            </div>
            <div>
               <div className="pageTitle">Председатель совета депутатов</div>
               <Deputates
                  img={Malinovsky}
                  name={'Малиновский Сергей Константинович'}
                  text={`
                  Родился 17 октября 1984 года в городе Исфара Ленинабадской области республики Таджикистан.<br /><br />
                  Окончил с отличием Международный юридический институт при Министерстве юстиции Российской Федерации.<br /><br />
                  С 2003 года по 2015 год проходил службу в органах внутренних дел Российской Федерации.<br /><br />
                  В 2011 году окончил Московский университет Министерства внутренних дел Российской Федерации по специальности "юриспруденция".<br /><br />
                  С 2015 года по 2021 год работал в Администрации городского округа Химки Московской области.<br /><br />
                  В 2020 году окончил Академию народного хозяйства при Президенте РФ. Присвоена степень магистра по специальности "государственное и муниципальное управление".<br /><br />
                  19 сентября 2021 года избран депутатом Совета депутатов городского округа Химки Московской области.<br /><br />
                  04 октября 2021 года избран Председателем Совета депутатов городского округа Химки Московской области.<br /><br />
                  Женат. Трое детей.

                  `}
               />
            </div>
         </div>
      </div>
   )
}
export default StructureCouncilDeputies;