import inputDefaults from "../data/input-defaults"
import * as validators from "../utils/validators"
import {
  InputType,
  InputValue,
  Validator,
  Formatter,
  RequiredValidator,
} from "../types"

const getDefaultValue = (
  inputType?: InputType,
  value?: InputValue
): InputValue => {
  if (value !== undefined) {
    return value
  } else if (inputType === undefined) {
    return ""
  } else if (inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].value
  } else {
    return ""
  }
}

const getValidator = (
  inputType?: InputType,
  validator?: Validator | undefined
): Validator | undefined => {
  if (validator !== undefined) {
    return validator
  } else if (inputType === undefined) {
    return undefined
  } else if (inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].validator
  } else {
    return undefined
  }
}

const getFormatter = (
  inputType?: InputType,
  formatter?: Formatter | undefined
): Formatter | undefined => {
  if (formatter !== undefined) {
    return formatter
  } else if (inputType === undefined) {
    return undefined
  } else if (inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].formatter
  } else {
    return undefined
  }
}

const getRequiredValidator = (inputType?: InputType): RequiredValidator => {
  if (inputType !== undefined && inputDefaults[inputType] !== undefined) {
    return inputDefaults[inputType].requiredValidator
  } else {
    return validators.requiredValidator
  }
}

export { getDefaultValue, getValidator, getFormatter, getRequiredValidator }
