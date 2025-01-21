import ContantContainerMain from "../../total/ContantContainerMain";
import s from "./Search.module.css";
import { NavLink } from "react-router-dom";
import { ROUTER } from "../../config";
import searchIcon from "../../assets/icons/search.svg";

const Search = (props) => {
  return (
    <div>
      <ContantContainerMain>
        <div className={`mt40 breadcrumbs`}>
          <NavLink to={ROUTER.main} className="breadcrumbsFrom">
            Главная
          </NavLink>
          <span className={"breadcrumbsTo"}> / Поиск</span>
        </div>
        <div className="mt40 pageTitle">Поиск</div>

        <div className="text">
          <div className={`mt40 ${s.inputContainer}`}>
            <img src={searchIcon} className={s.img} alt="" />
            <input placeholder="Поиск" />
          </div>
        </div>
      </ContantContainerMain>
    </div>
  );
};
export default Search;
