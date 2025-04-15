export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return passwordRegex.test(password);
};
export const validateFullname = (fullname: string): boolean => {
  const fullnameRegex = /^[A-Za-z\s]{1,50}$/;
  return fullnameRegex.test(fullname);
};
