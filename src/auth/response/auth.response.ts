export const RegisterResponse = (user: any) => {
  delete user.password;
  return {
    ...user,
  };
};

export const LoginResponse = (user: any, jwtToken: String) => {
  delete user.password;
  return {
    ...user,
    jwtToken,
  };
};
