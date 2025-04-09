import React, { useEffect, useMemo } from 'react';

import Select from 'react-select';
import './ReactSelect.css';
import { useController } from 'react-hook-form';

//npm i react-select
/* 
npx tailwindcss init для стилизации
После этой команды создастся в одной дирректории с package.json tailwind.config.js
Внутри:
module.exports = {
   content: [],
   theme: {
     extend: {},
   },
   plugins: [],
 }
*/
/* 
В index.css прописать 
@tailwind base;
@tailwind components;
@tailwind utilities;
*/

const ReactSelect = (props) => {
   const {
      name,
      control,
      valuesOptions,
      valueName,
      labelName,
      isMulti,
      placeholder,
      isSearchable,
      errors,
      initialValue,
   } = props;

   const { field } = useController({
      name,
      control,
   });

   const options = useMemo(() => {
      if (!valuesOptions) {
         return [];
      }

      return valuesOptions.map(el => ({
         value: el[valueName],
         label: el[labelName],
      }));
   }, [valuesOptions, valueName, labelName]);

   useEffect(() => {
      const initialResult = isFinite(field?.value) ? options.find(el => el.value === field?.value) : field?.value
      field.onChange(initialResult)
   }, [options])

   return (
      <div>
         <div className={`${errors[name] ? 'react_select__err' : 'falseSelect'} mt8`}>
            <Select
               classNamePrefix='react_select'
               options={options}
               isMulti={isMulti}
               isLoading={!valuesOptions}
               placeholder={placeholder}
               isSearchable={isSearchable}
               value={field?.value}
               onBlur={field?.onBlur}
               onChange={(selectedOption) => field.onChange(selectedOption)}// Обрабатываем изменение
            /* isClearable */ //Добавляет крестик для очистки выбора
            />
         </div>
         {errors[name] && <div className='react_select__messageErr'>{errors[name].message || 'Error!'}</div>}
      </div>
   );
};

export default ReactSelect;