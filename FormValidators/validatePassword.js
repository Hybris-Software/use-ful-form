function checkPassword(password) {
  if (password.length <= 8 || !password.match(/[a-z]/i)) {
    return {
      value: false,
      message: "Password must be at least 8 characters long and one lowercase letter",
      security: "none",
    };
  } else if (!password.match(/[0-9]/)) {
    return {
      value: false,
      message: "Password must contain at least one number",
      security: "low",
    };
  } else if (!password.match(/[A-Z]/)) {
    return {
      value: false,
      message: "Password must contain at least one uppercase letter",
      security: "medium",
    };
  } else if (!password.match(/[^a-zA-Z0-9]/g)) {
    return {
      value: false,
      message: "Password must contain at least one special character",
      security: "high",
    };
  } else {
    return {
      value: true,
      security: "strong",
    };
  }
}

const validatePassword = (value) => {
  if (value.length === 0) {
    return { value: null };
  } else {
    return checkPassword(value);
  }
};

export default validatePassword;
