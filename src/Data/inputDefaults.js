import inputTypes from "./inputTypes";
import * as validators from "../Utils/Validators";
import * as formatters from "../Utils/Formatters";

const inputDefaults = {
  [inputTypes.email]: {
    value: "",
    validator: validators.validateEmail,
    formatter: formatters.formatEmail,
    requiredValidator: validators.validateRequiredString,
  },
  [inputTypes.username]: {
    value: "",
    validator: undefined,
    formatter: formatters.formatUsername,
    requiredValidator: validators.validateRequiredString,
  },
  [inputTypes.password]: {
    value: "",
    validator: validators.validatePassword,
    formatter: undefined,
    requiredValidator: validators.validateRequiredString,
  },
  [inputTypes.confirmPassword]: {
    value: "",
    validator: validators.validateConfirmPassword,
    formatter: undefined,
    requiredValidator: validators.validateRequiredString,
  },
  [inputTypes.checkbox]: {
    value: false,
    validator: undefined,
    formatter: undefined,
    requiredValidator: validators.validateRequiredCheckbox,
  },
};

export default inputDefaults;
