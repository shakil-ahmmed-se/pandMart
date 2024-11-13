export const createUserValidationSchema = {
  username: {
    isString: true,
    notEmpty: {
      errorMessage: "username not empty",
    },
    isLength: {
        options:{
            min:5,
            max:32,
        },
        errorMessage: "Username must be 5-32 characters",
    },
  },
  displayName:{
    notEmpty: true,
  },
  password:{
    notEmpty: true,
  }
};
