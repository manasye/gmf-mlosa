import axios from "axios";
import swal from "sweetalert";

export const shortenText = (text, limit) => {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
};

export const displayError = err => {
  swal("Error", err.response.data.message || "An error has occured", "error");
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

export const getUic = () => {
  return localStorage.getItem("uic_id");
};

export const isAdmin = () => {
  return false;
};

export const getUics = () => {
  return axios
    .get("/uic")
    .then(res => {
      let uics = [];
      const data = res.data.data;
      data.map(d => {
        if (d.uic_name)
          uics.push({ value: d.id, text: d.uic_code + " - " + d.uic_name });
      });
      return uics;
    })
    .catch(() => {
      return [];
    });
};

export const getUicCodes = () => {
  return axios
    .get("/uic")
    .then(res => {
      let uics = [];
      const data = res.data.data;
      data.map(d => {
        if (d.uic_name) uics.push({ value: d.uic_code, text: d.uic_name });
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

export const getMaintenancesName = () => {
  return axios
    .get("/maintenance_process")
    .then(res => {
      let maintenances = [];
      const data = res.data.data;
      data.map(m => {
        if (m.name) maintenances.push({ value: m.name, text: m.name });
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

export const getThreatCodes = () => {
  return axios
    .get("/threat_codes")
    .then(res => {
      let threats = [];
      const data = res.data.data;
      data.map(t => {
        if (t.code) threats.push({ value: t.description, text: t.description });
      });
      return threats;
    })
    .catch(() => {
      return [];
    });
};
