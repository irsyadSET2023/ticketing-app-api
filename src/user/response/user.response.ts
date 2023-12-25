export const MyAccountResponse = (user: any) => {
  delete user.password;
  return {
    ...user,
  };
};

export const UpdateAccountResponse = (user: any) => {
  delete user.password;
  return {
    ...user,
  };
};
