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
