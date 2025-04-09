import React from 'react';
import ContantContainerAdmin from '../../total/ContantContainerAdmin';
import s from './CharterAndSymbols.module.css';

import { useRequireAccessLevel } from 'utils';
import CharterAndSymbolsComponent from 'ComponentsAdmin/CharterAndSymbolsComponent';
import CharterAndSymbolsCoatOfArms from 'ComponentsAdmin/CharterAndSymbolsCoatOfArms';
import CharterAndSymbolsFlag from 'ComponentsAdmin/CharterAndSymbolsFlag';
import CharterAndSymbolsLogo from 'ComponentsAdmin/CharterAndSymbolsLogo';
import CharterAndSymbolsAnthem from 'ComponentsAdmin/CharterAndSymbolsAnthem';

const CharterAndSymbols = ({ level }) => {

   const accessLevel = useRequireAccessLevel(level)
   if (!accessLevel) {
      return null;
   }

   return (
      <div className="mt54">
         <ContantContainerAdmin>

            <h1 className="pageTitle">Устав и символика</h1>
            <CharterAndSymbolsComponent />

            <h2 className="pageTitle mt40">Символика</h2>
            <CharterAndSymbolsCoatOfArms/>
            <CharterAndSymbolsFlag/>
            <CharterAndSymbolsLogo/>

            <h2 className="pageTitle mt40">Гимн городского округа Химки</h2>
            <CharterAndSymbolsAnthem/>

         </ContantContainerAdmin>
      </div>
   )
}
export default CharterAndSymbols;