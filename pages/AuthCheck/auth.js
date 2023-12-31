export const isAuthenticated = () => {
  return !!(localStorage.getItem('supportTicketLoginUserUserPosition') === 'user');
  // return !!localStorage.getItem('supportTicketLoginUserUserPosition');
};
