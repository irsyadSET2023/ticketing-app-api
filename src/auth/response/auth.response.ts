export const RegisterResponse = (user: any) => {
  delete user.password;
  return {
    ...user,
  };
};

export const LoginOrVerifyResponse = (user: any, jwtToken: String) => {
  delete user.password;
  return {
    ...user,
    jwtToken,
  };
};
