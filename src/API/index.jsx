import axios from "axios";

const instance = axios.create({
  /* withCredentials: true,
   headers: {
      'API-KEY': 'Ключ'
   }, */
  baseURL: "https://sdhimki.ru/laravel/public/api",
});

const API = {
  getNews: async (page = 1, limit = 12, dateFrom = "", dateTo = "") => {
    return instance
      .get(
        `content/news/list?page=${page}&limit=${limit}`
      ) /* &dateFrom=${dateFrom}&dateTo=${dateTo} */
      .then((response) => response.data)
      .catch(() => {
        console.log("Error");
      });
  },
  getItemNews: async (id) => {
    return instance
      .get(`content/news/item?id=${id}`)
      .then((response) => response.data)
      .catch(() => {
        console.log("Error");
      });
  },

  getDocumentations: async (page, limit = 10, search = "") => {
    return instance
      .get(
        `/content/document/list?page=${page}&limit=${limit}&search=${search}`
      )
      .then((response) => response.data)
      .catch(() => {
        console.log("Error");
      });
  },

  postSubscribeNews: async (email) => {
    return instance
      .post(`subscribe/add`, email)
      .then((response) => response.data)
      .catch(() => {
        console.log("Error");
      });
  },
  postСomplaint: async (data) => {
    return instance
      .post(`support/ticket/add`, data)
      .then((response) => response.data)
      .catch(() => {
        console.log("Error");
      });
  },

  end_point: async (data) => {
    return axios
      .get(`https://admhimki.ru/end_point.php`, data)
      .then((response) => {
        console.log(`https://admhimki.ru/end_point.php`);
        console.log(response.data);
      })
      .catch(() => {
        console.log("Error");
      });
  },
  delaraEnd_point: async (data) => {
    return axios
      .get(`https://admhimki.ru/delara/end_point.php`, data)
      .then((response) => {
        console.log(`https://admhimki.ru/delara/end_point.php`);
        console.log(response.data);
      })
      .catch(() => {
        console.log("Error");
      });
  },
  delaraPublicEnd_point: async (data) => {
    return axios
      .get(`https://admhimki.ru/delara/public/end_point.php`, data)
      .then((response) => {
        console.log(`https://admhimki.ru/delara/public/end_point.php`);
        console.log(response.data);
      })
      .catch(() => {
        console.log("Error");
      });
  },
};
export default API;
