import inputDefaults from "../Data/inputDefaults";
import * as validators from "../Utils/Validators";

const getDefaultValue = (inputType, value) => {
  if (value !== undefined) {
    return value;
  } else if (inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].value;
  } else {
    return "";
  }
};

const getValidator = (inputType, validator) => {
  if (validator !== undefined) {
    return validator;
  } else if (inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].validator;
  } else {
    return undefined;
  }
};

const getFormatter = (inputType, formatter) => {
  if (formatter !== undefined) {
    return formatter;
  } else if (inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].formatter;
  } else {
    return undefined;
  }
};

const getRequiredValidator = (inputType) => {
  if (inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].requiredValidator;
  } else {
    return validators.validateRequiredGeneric;
  }
};

export { getDefaultValue, getValidator, getFormatter, getRequiredValidator };
