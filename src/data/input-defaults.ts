import { InputTypes } from "../data/input-types"
import * as validators from "../utils/validators"
import * as formatters from "../utils/formatters"

const inputDefaults = {
  [InputTypes.Email]: {
    value: "",
    validator: validators.validateEmail,
    formatter: formatters.formatEmail,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputTypes.Username]: {
    value: "",
    validator: undefined,
    formatter: formatters.formatUsername,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputTypes.Password]: {
    value: "",
    validator: validators.validatePassword,
    formatter: undefined,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputTypes.ConfirmPassword]: {
    value: "",
    validator: validators.validateConfirmPassword,
    formatter: undefined,
    requiredValidator: validators.requiredStringValidator,
  },
  [InputTypes.Checkbox]: {
    value: false,
    validator: undefined,
    formatter: undefined,
    requiredValidator: validators.requiredBooleanValidator,
  },
}

export default inputDefaults
