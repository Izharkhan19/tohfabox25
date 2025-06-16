export const setItem = (key: string, value: any) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: string) => {
  let data: any = localStorage.getItem(key);
  return JSON.parse(data);
};

export const checkIsAdminUser = () => {
  let userDetails: any = getItem("user")
  return userDetails?.role === "admin" ? true : false
};
