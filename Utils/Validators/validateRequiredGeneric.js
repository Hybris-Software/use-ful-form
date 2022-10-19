import validateRequiredString from "./validateRequiredString";

const genericRequiredValidator = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    validateRequiredString(value);
  } else if (typeof value === "number") {
    if (isNaN(value)) {
      return false;
    }
    if (value === 0) {
      return false;
    }
  } else if (typeof value === "boolean") {
    if (typeof value !== "boolean") {
      return false;
    }
  }

  return true;
};

export default genericRequiredValidator;
