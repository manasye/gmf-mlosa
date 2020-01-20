import axios from "axios";

export const shortenText = (text, limit) => {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
};

export const convertSnakeCaseToText = text => {
  const splittedText = text.split("_");
  let result = "";
  splittedText.forEach(text => {
    result += " " + text.replace(/^\w/, c => c.toUpperCase());
    return null;
  });
  return result.substring(1);
};

export const getUsername = () => {
  return localStorage.getItem("username");
};

export const getPhoto = () => {
  return localStorage.getItem("photo");
};

export const getFullname = () => {
  return localStorage.getItem("fullname");
};

export const getUics = () => {
  return axios
    .get("/uic")
    .then(res => {
      let uics = [];
      const data = res.data.data;
      data.map(d => {
        if (d.uic_name) uics.push({ value: d.id, text: d.uic_name });
      });
      return uics;
    })
    .catch(() => {
      return [];
    });
};

export const getMaintenances = () => {
  return axios
    .get("/maintenance_process")
    .then(res => {
      let maintenances = [];
      const data = res.data.data;
      data.map(m => {
        if (m.name) maintenances.push({ value: m.id, text: m.name });
      });
      return maintenances;
    })
    .catch(() => {
      return [];
    });
};

export const getYearOptions = () => {
  return axios
    .get("/year")
    .then(res => {
      let years = [];
      const data = res.data;
      data.map(y => {
        if (y) years.push({ value: y, text: y });
      });
      return years;
    })
    .catch(() => {
      return [];
    });
};
