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
