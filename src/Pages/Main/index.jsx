import React, { useEffect, useState } from 'react';
import ContantContainerMain from '../../total/ContantContainerMain';
import s from './Main.module.css';

import { ROUTER } from '../../config';
import { NavLink } from 'react-router-dom';

import API from '../../API';

/* Компоненты */
import NewsLong from '../../Components/NewsLong';

/* Баннеры */
import GovernmentServices from '../../BannersComopnents/GovernmentServices';
import GovernmentServicesLarge from '../../BannersComopnents/GovernmentServicesLarge';
import SVO from '../../BannersComopnents/svo';
/* import ChannelTG from '../../BannersComopnents/ChannelTG'; */

import DocumentContainerDownload from '../../Components/DocumentContainerDownload';
import MainNews from '../../Components/MainNews';

const Main = (props) => {

   /* Запрашиваем новости */
   const [news, setNews] = useState([]);

   useEffect(() => {
      API.getNews(1, 4)
         .then(data => setNews(data))
   }, [])

   return (
      <div>
         <ContantContainerMain>

            <section className={`mt40 ${s.lastNewsContainer}`}>

               {news && <MainNews mainNews={news[0]} />}

               <div className={`${s.newsContainer} ${s.mt64Mobile}`}>
                  <div className="subTitle">Последние новости</div>
                  <div className="bannerArrowContainer mt24">
                     <NewsLong btnText={'Все новости'} news={news} />
                  </div>
                  <NavLink to={ROUTER.news} className={`mt24 btnW ${s.showMore}`}>Все новости</NavLink>
               </div>
            </section>

            <div className={`mt80 ${s.bannersContainer}`}>
               <div className={`${s.governmentServicesLargeBanner}`}>
                  <GovernmentServicesLarge />
               </div>

               <div className={s.governmentServicesBanner}>
                  <GovernmentServices />
               </div>
            </div>


            <section className={s.programAdministratorContainer}>
               <div className="mt80 subTitle">Последние документы</div>
               <div className="mt40 columnContainer">
                  <div className={`bannerArrowContainer ${s.mobilBannerRow}`}>
                     <div>
                        <DocumentContainerDownload title='Решение от 26.12.2023 № 28/1' text='О внесении изменений в решение Совета депутатов городского округа Химки Московской области от 29.11.2022 № 15/1 «О бюджете городского округа Химки Московской области на 2023 год и на плановый период 2024 и 2025 годов»' date='26.12.2023' />
                     </div>
                     <div className="mt32">
                        <DocumentContainerDownload title='Решение от 30.11.2023 № 26/10' text='О досрочном прекращении полномочий депутата Совета депутатов городского округа Химки Московской области  Кашникова Николая Александровича' date='30.11.2023' />
                     </div>
                     <div className="mt32">
                        <DocumentContainerDownload title='Решение от 30.11.2023 № 26/7' text='О внесении изменений в Правила благоустройства территории городского округа Химки Московской области, утвержденные решением Совета депутатов городского округа Химки Московской области от 02.12.2020 № 41/6' date='30.11.2023' />
                     </div>
                     <div className="mt32">
                        <DocumentContainerDownload title='Решение от 30.11.2023 № 26/6' text='Об утверждении Прогнозного плана приватизации имущества, находящегося в муниципальной собственности городского округа Химки Московской области, на 2024 год' date='30.11.2023' />
                     </div>
                     <div className="mt32">
                        <DocumentContainerDownload title='Решение от 30.11.2023 № 26/3' text='О принятии движимого имущества из государственной собственности Московской области в муниципальную собственность городского округа Химки Московской области' date='30.11.2023' />
                     </div>
                  </div>
               </div>
            </section>

         </ContantContainerMain>

      </div>
   )
}
export default Main;