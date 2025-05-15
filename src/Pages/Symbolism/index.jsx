import React, { useCallback, useEffect, useState } from 'react';
import s from './Symbolism.module.css';
import ContantContainerMain from '../../total/ContantContainerMain';
import { ROUTER } from '../../config';
import { NavLink } from 'react-router-dom';
import DocumentContainerDownload from '../../Components/DocumentContainerDownload';
import gimn from '../../assets/audio/gimn.mp3';

import API from 'API';
import { formatDateToEurope } from 'utils';

const Symbolism = (props) => {

   const initialState = {
      charter: {},
      coatOfArm: {},
      flag: {},
      logo: {},
      anthem: {},
   }

   const [data, setData] = useState(initialState);

   const getDataAll = async () => {
      try {
         const [
            charter,
            coatOfArm,
            flag,
            logo,
            anthem
         ] = await Promise.all([
            API.getContent(3636),
            API.getContent(3637),
            API.getContent(3638),
            API.getContent(3639),
            API.getContent(3640)
         ])

         setData({
            charter,
            coatOfArm,
            flag,
            logo,
            anthem
         })
      } catch (error) {
         console.error("Ошибка при загрузке данных:", error)
      }
   }

   useEffect(() => {
      getDataAll()
   }, [])

   return (
      <div>
         <ContantContainerMain>
            <div className={`mt40 breadcrumbs`}>
               <NavLink to={ROUTER.main} className='breadcrumbsFrom'>Совет депутатов</NavLink>
               <span className='breadcrumbsTo'> / Устав и символика</span>
            </div>
            <div className='text'>
               <div className={`mt40 ${s.subtitle}`}>Устав</div>
               <div className={`mt40`}>{data?.charter?.text}</div>
               <div className={`mt40`}>
                  {data?.charter?.property?.document?.value?.map((el, i) => <DocumentContainerDownload
                     key={el.i}
                     document={el.src}
                     documentName={el.name}
                     title={el.name}
                     text={`${el.size} KB`}
                     date={formatDateToEurope(el.created_at.split(' ')[0])}
                     format={el.src.split('.')[1]}
                  />)}

               </div>
               <div className={`mt80 ${s.subtitle}`}>Символика</div>

               {/* Герб */}
               <div className="mt40">
                  <div className={s.flexContainer}>
                     <div className={s.imgContainer}>
                        <img src={data?.coatOfArm?.property?.document?.value?.[0]?.src} alt="" />
                     </div>
                     <div className={s.textContainer}>
                        <div className={`${s.textBodyCard}`}>
                           <div className={s.titleCard}>{data?.coatOfArm?.name}</div>
                           <div className="mt14">{data?.coatOfArm?.text}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Флаг */}
               <div className="mt40">
                  <div className={s.flexContainer}>
                     <div className={s.imgContainer}>
                        <img src={data?.flag?.property?.document?.value?.[0]?.src} alt="" />
                     </div>
                     <div className={s.textContainer}>
                        <div className={`${s.textBodyCard}`}>
                           <div className={s.titleCard}>{data?.flag?.name}</div>
                           <div className="mt14">{data?.flag?.text}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Логотип */}
               <div className="mt40">
                  <div className={s.flexContainer}>
                     <div className={s.imgContainer}>
                        <img src={data?.logo?.property?.document?.value?.[0]?.src} alt="" />
                     </div>
                     <div className={s.textContainer}>
                        <div className={`${s.textBodyCard}`}>
                           <div className={s.titleCard}>{data?.logo?.name}</div>
                           <div className="mt14">{data?.logo?.text}</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt80">
                  <div className="pageTitle">Гимн городского округа Химки</div>
                  <div className="mt40">
                     <audio className={s.gimn} src={gimn} controls />
                  </div>

                  <div className="mt40 text" dangerouslySetInnerHTML={{ __html: data?.anthem?.text }}>
                     {/* <div>Химки навеки в истории нашей,</div>
                     <div>Память о подвиге нам дорога-</div>
                     <div>Слава защитникам, насмерть стоявшим,</div>
                     <div>И сокрушившим врага.</div>
                     <br />
                     <div>Припев:</div>
                     <div>Химки - родной и любимый наш город,</div>
                     <div>Славу тебе мы поем!</div>
                     <div>Химки сегодня по- прежнему молод,</div>
                     <div>Город, в котором живем!</div>
                     <br />
                     <div>В Химках проложена в космос дорога,</div>
                     <div>Город науки и город труда,</div>
                     <div>Для нашей Отчизны сделал ты много,</div>
                     <div>В наших сердцах навсегда!</div>
                     <br />
                     <div>В Химках проложена в космос дорога,</div>
                     <div>Город науки и город труда,</div>
                     <div>Для нашей Отчизны сделал ты много,</div>
                     <div>В наших сердцах навсегда!</div>
                     <br />
                     <div>С каждой минутой мощней и красивей</div>
                     <div>Города нашего славный полет!</div>
                     <div>Вместе с народом, вместе с Россией</div>
                     <div>Химки к победам идет!</div> */}
                  </div>

                  {/* <div className="description mt32">
                     Слова А. Б. Моргунова, музыка Д. А. Дронова
                  </div> */}
               </div>
            </div>
         </ContantContainerMain>
      </div>
   )
}
export default Symbolism;