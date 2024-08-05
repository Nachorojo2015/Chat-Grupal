export const getTime = () => {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${hour}:${minutes < 10 ? "0" + minutes : minutes}`;
};

export const randomName = () => {
  let name = "";
  const randomLettersAndNumbers =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < 30; i++) {
    name +=
      randomLettersAndNumbers[
        Math.floor(Math.random() * randomLettersAndNumbers.length)
      ];
  }

  return name
};
