import { Validator } from "../../types";

export const validatePassword: Validator = (value) => {
  // Return error if the type is not string
  if (typeof value !== "string") {
    return [false, { message: "Invalid password", security: "none" }];
  }

  // Perform multiple checks to define the password strength
  if (value.length <= 8 || !value.match(/[a-z]/i)) {
    return [
      false,
      {
        message:
          "Password must be at least 8 characters long and one lowercase letter",
        security: "none",
      },
    ];
  } else if (!value.match(/[0-9]/)) {
    return [
      false,
      {
        message: "Password must contain at least one number",
        security: "low",
      },
    ];
  } else if (!value.match(/[A-Z]/)) {
    return [
      false,
      {
        message: "Password must contain at least one uppercase letter",
        security: "medium",
      },
    ];
  } else if (!value.match(/[^a-zA-Z0-9]/g)) {
    return [
      false,
      {
        message: "Password must contain at least one special character",
        security: "high",
      },
    ];
  } else {
    return [
      true,
      {
        security: "strong",
      },
    ];
  }
};
