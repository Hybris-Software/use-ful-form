import { InputType } from "../types";
import * as validators from "../utils/validators";
import * as formatters from "../utils/formatters";

const inputDefaults = {
  [InputType.Email]: {
    value: "",
    validator: validators.validateEmail,
    formatter: formatters.formatEmail,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputType.Username]: {
    value: "",
    validator: undefined,
    formatter: formatters.formatUsername,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputType.Password]: {
    value: "",
    validator: validators.validatePassword,
    formatter: undefined,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputType.ConfirmPassword]: {
    value: "",
    validator: validators.validateConfirmPassword,
    formatter: undefined,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputType.Checkbox]: {
    value: false,
    validator: undefined,
    formatter: undefined,
    requiredValidator: validators.requiredBooleanValidator,
  },
};

export default inputDefaults;
