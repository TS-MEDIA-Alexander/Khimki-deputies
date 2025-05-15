
import React from 'react';
import s from './SearchInput.module.css';
import search from '../../assets/icons/search_admin.svg';

const SearchInput = ({ onKeyUp, placeholder, set, get }) => {
   return (
      <div className="searchContainer">
         <img src={search} alt="" />
         <input value={get} onChange={(e) => set(e.target.value)} onKeyUp={onKeyUp} className="searchInput" type="text" placeholder={placeholder} />
      </div>
   )
}

export default SearchInput;
