const validateConfirmPassword = (value, values) => {
  if (value !== values["password"]) {
    return [false, "Passwords do not match"];
  } else {
    return [true, null];
  }
};

export default validateConfirmPassword;
