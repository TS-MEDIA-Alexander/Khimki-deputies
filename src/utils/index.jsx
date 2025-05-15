import API from "API";
import { ROUTER } from "config";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

export function maskInput(value, mask) {
   var literalPattern = /[0\*]/;
   var numberPattern = /[0-9]/;
   var newValue = "";
   try {
      var maskLength = mask.length;
      var valueIndex = 0;
      var maskIndex = 0;

      for (; maskIndex < maskLength;) {
         if (maskIndex >= value.length) break;

         if (mask[maskIndex] === "0" && value[valueIndex].match(numberPattern) === null) break;

         // Found a literal
         while (mask[maskIndex].match(literalPattern) === null) {
            if (value[valueIndex] === mask[maskIndex]) break;
            newValue += mask[maskIndex++];
         }
         newValue += value[valueIndex++];
         maskIndex++;
      }

   } catch (e) {
      console.log(e);
   }
   return newValue
}

export function maskInputTime(val) {
   // Заменяем все недопустимые символы
   val = val.replace(/[^\dh:]/g, "");

   // Убираем первый символ, если он не 0, 1 или 2 (для часов)
   val = val.replace(/^[^0-2]/, "");

   // Если первый символ 2, то второй должен быть от 0 до 3
   val = val.replace(/^([2-9])[4-9]/, "$1");

   // Запрещаем ввод двоеточия или "h" в начале
   val = val.replace(/^[:h]/, "");

   // Если ввели две цифры и 'h', заменяем 'h' на ':'
   val = val.replace(/^(\d{2})h/, "$1:");

   // Ограничение часов (00-23)
   val = val.replace(/^([01][0-9])[^:h]/, "$1");
   val = val.replace(/^(2[0-3])[^:h]/, "$1");

   // Ограничение минут (00-59)
   val = val.replace(/^(\d{2}:[0-5])[^0-9]/, "$1");

   // Запрещаем ввод символов после 2 цифр минут
   val = val.replace(/^(\d{2}:\d[0-9])./, "$1");

   // Автоматическое добавление двоеточия, если введено две цифры (часы)
   if (/^\d{2}$/.test(val)) {
      val += ':';
   }

   // Если введены часы и первая цифра минут больше 5, заменяем ее на 5
   val = val.replace(/^(\d{2}:)[6-9]/, "$15");

   // Если после двоеточия введено две цифры, то ограничиваем минуты от 00 до 59.
   val = val.replace(/^(\d{2}:[6-9])[0-9]/, (match, p1) => p1 + "59");
   val = val.replace(/^(\d{2}:[0-5][0-9])/, (match) => match)

   return val;
}

export function formatDateToEurope(dateString) {
   const parts = dateString.split('-');
   return `${parts[2]}.${parts[1]}.${parts[0]}`;
}
export function formatDateToUS(dateString) {
   const parts = dateString.split('.');
   return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export const getDate = (date) => {
   const [year, month, day] = date.split(" ")[0].split("-");
   return `${day}.${month}.${year}`;
};

export const getDateNow = () => {
   const today = new Date();
   const yyyy = today.getFullYear();
   let mm = today.getMonth() + 1; // Months start at 0!
   let dd = today.getDate();

   if (dd < 10) dd = '0' + dd;
   if (mm < 10) mm = '0' + mm;

   const formattedToday = dd + '.' + mm + '.' + yyyy;

   return formattedToday;
}

export const getCurrentTime = () => {
   const now = new Date();
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   return `${hours}:${minutes}`;
}

export const useDeleteFile = (setValue, getValues, trigger = () => { }) => {

   const deleteFile = (id) => {
      const currentValues = getValues(); // Получаем текущие значения формы

      // Получаем текущее значение поля с файлами (предположим, что это поле называется 'value')
      const currentValue = currentValues.value || []; // Или используйте имя вашего поля
      const currentFileDelete = currentValues.file_delete || []; //  Аналогично для file_delete

      // 1. Фильтруем массив файлов, чтобы удалить файл с заданным id
      const newValue = currentValue.filter((el) => el.id !== id);

      // 2. Добавляем id удаленного файла в массив file_delete
      const newFileDelete = [...currentFileDelete, id];

      // 3. Обновляем состояние формы с помощью setValue
      setValue('value', newValue);
      setValue('file_delete', newFileDelete);

      trigger()
   };

   return deleteFile;
}

export default useDeleteFile;

export function useDebounce(func, delay, cleanUp = false) {
   const timeoutRef = useRef();

   function clearTimer() {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
         timeoutRef.current = undefined;
      }
   }

   useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp]);

   return (...args) => {
      clearTimer();
      timeoutRef.current = setTimeout(() => func(...args), delay);
   };
}

export function useDataManagement(selector, getData, fetchDataAction, updatePublishedData, addOrRemoveChoiceCheckbox, setChoiceCheckboxRemoveOrAddAll, search) {

   const dispatch = useDispatch();
   const data = useSelector(selector, shallowEqual);
   const [checkboxAll, setCheckboxAll] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [limit] = useState(14);
   const [isReloading, setIsReloading] = useState(false);

   // Функция загрузки данных
   const loadData = useCallback(async (search) => {
      setIsReloading(true);
      try {
         const data = await getData(currentPage, limit, "admin", "", search); //  Используем API для документов
         dispatch(fetchDataAction(data)); //  Диспатчим action
      } catch (error) {
         console.error('Ошибка при загрузке документов:', error);
         // Обработка ошибок
      } finally {
         setIsReloading(false);
      }
   }, [currentPage, limit, dispatch]);

   useEffect(() => {
      loadData();
   }, [loadData]);

   //Поиск
   const searchDebounce = useDebounce(() => loadData(search), 500);

   //Функция снятия/постановки на публикацию
   const UpdateCheckbox = (id, currentPublished) => {
      dispatch(updatePublishedData({ id: id, published: currentPublished }));
   };

   // Функция для обновления данных (например, после удаления)
   const handleUpdate = () => {
      loadData(); //  Перезагружаем данные
   };

   const changePage = (page) => {
      if (page >= 1 && page <= Math.ceil(data?.all / limit)) {
         setCurrentPage(page);
      }
   };

   //Логика изменения индивидуального cчекбокса(групповое выделение)
   const choiceCheckbox = data.choiceCheckbox;
   const handleChoiceCheckbox = useCallback((id) => dispatch(addOrRemoveChoiceCheckbox(id)), [dispatch]);

   const handleChoiceCheckboxAll = useCallback(() => {
      const allIds = data?.list?.map(el => el.id) || [];
      const allSelected = allIds.every(id => choiceCheckbox.includes(id));

      dispatch(setChoiceCheckboxRemoveOrAddAll(allSelected ? [] : allIds));
      setCheckboxAll(!allSelected);
   }, [data?.list, checkboxAll])

   const removeSelectionsChecboxAll = useCallback(() => {
      dispatch(setChoiceCheckboxRemoveOrAddAll([]));
      setCheckboxAll(false);
   }, [dispatch, setCheckboxAll])

   /* Групповое изменение по массиву id */
   const publickAll = () => {
      API.postAddMultipleElementsPublick({ id: choiceCheckbox, published: 1 })
         .then(_ => {
            loadData();
            removeSelectionsChecboxAll();
         })
   }
   const removePublickAll = () => {
      API.postAddMultipleElementsPublick({ id: choiceCheckbox, published: 0 })
         .then(_ => {
            loadData();
            removeSelectionsChecboxAll();
         })
   }
   const moveInBasketInAll = () => {
      API.postAddMultipleElementsPublick({ id: choiceCheckbox, remove: 1 })
         .then(_ => {
            loadData();
            removeSelectionsChecboxAll();
         })
   }

   return {
      data, checkboxAll, currentPage,
      limit, isReloading, UpdateCheckbox,
      handleUpdate, changePage, choiceCheckbox,
      handleChoiceCheckbox, handleChoiceCheckboxAll, removeSelectionsChecboxAll,
      publickAll, removePublickAll, moveInBasketInAll, searchDebounce
   }
}

export function useLocalStorage(key, initialValue) {
   // Инициализация состояния с использованием данных из localStorage
   const [storedValue, setStoredValue] = useState(() => {
      try {
         const item = window.localStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
      } catch (error) {
         console.error('Ошибка при чтении из localStorage', error);
         return initialValue;
      }
   });

   // Функция для обновления состояния и localStorage
   const setValue = (value) => {
      try {
         const valueToStore = value instanceof Function ? value(storedValue) : value;
         setStoredValue(valueToStore);
         window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
         console.error('Ошибка при записи в localStorage', error);
      }
   };
   return [storedValue, setValue];
}

/*Хук для защиты роутов и перенаправления пользователей в зависимости от статуса аутентификации.*/
export function useRequireAuth(requireAuth) {
   const auth = useSelector(state => state.auth);
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      if (requireAuth && !auth.isAuth) {
         // Если требуется аутентификация и пользователь не залогинен,
         // перенаправляем на страницу входа, сохраняя текущий путь.
         navigate(ROUTER.admin.login, { replace: true, state: { from: location.pathname } });
         // Этот вариант заменяет текущую запись в истории браузера на текущую страницу
      }
   }, [auth.isAuth, navigate, location, requireAuth]);

   return auth;
}

/* Хук для защиты роутов и перенаправляения пользователей в зависимости от их уровня доступа */
export function useRequireAccessLevel(level) {
   const auth = useSelector(state => state.auth);
   const navigate = useNavigate();
   const location = useLocation();

   const accessLevelh = level >= auth.user.accessLevel;


   useEffect(() => {
      if (!accessLevelh) {
         // Если уровень доступа пользователя меньше требуемого для посещения этой страницы,
         // перенаправляем на страницу новостей, сохраняя текущий путь.
         navigate(ROUTER.admin.news, { replace: true, state: { from: location.pathname } });
         // Этот вариант заменяет текущую запись в истории браузера на текущую страницу
      }
   }, [auth.isAuth, navigate, location, level]);

   return accessLevelh;
}

export const getQuerySettings = (type) => type === 'admin' ? 'remove=0' : (type === 'adminBasket' ? 'remove=1' : 'remove=0&published=1&dateBetween=1');

export const formatterCalendar = new Intl.DateTimeFormat('ru', {
   year: 'numeric',
   month: '2-digit',
   day: '2-digit'
})