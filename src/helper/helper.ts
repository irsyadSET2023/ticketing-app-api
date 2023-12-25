export const parseMessage = (data: any, message: string) => {
  return { data, message };
};

export const generateRandomString = (length: number) => {
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result: string;
  result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    result += charSet.charAt(randomIndex);
  }
  return result;
};
