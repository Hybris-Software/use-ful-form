function validateConfirmPassword(value, values) {
  if (value !== values["password"]) {
    return {
      value: false,
      message: "Passwords do not match",
    };
  } else {
    return {
      value: true,
    };
  }
}

export default validateConfirmPassword;
