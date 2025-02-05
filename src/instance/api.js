const API = {
  auth: {
    login: "/users/login",
    signup: "/users/register",
    postOtp: "/users/OtpVerify",
    resendOtp: "/users/ResendOtp",
    confirmEmail: "/users/confirm-email",
    resendEmail: "/users/resend-confirmation-email",
    login2fa: "/users/login/2fa",
    forgotPass: "/users/forgot-password",
    user2fa: "/users/2fa",
    resetPass: "/users/reset-password",
    userDetail: "/users/me",
  },
  dashboard: {
    accountDetail: "/accounts",
  },
  user: {
    update: "/users/me",
    add: "/accounts",
  },
  payment: {
    addPaymentMethod: "/accounts",
  }
};
export default API;
