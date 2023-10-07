type UserStore = {
  data: { firstName: string; lastName: string; email: string } | null;
  isLoggedIn: boolean;
};

export const userStore: UserStore = {
  data: null,
  isLoggedIn: false,
};
