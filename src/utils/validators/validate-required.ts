import { RequiredValidator } from "../../types"

export const requiredBooleanValidator: RequiredValidator = (value) => {
  if (value === true) {
    return true
  } else {
    return false
  }
}

export const requiredStringValidator: RequiredValidator = (value) => {
  if (typeof value !== "string") {
    return false
  }

  if (value === null || value === undefined || value.trim() === "") {
    return false
  } else {
    return true
  }
}

export const requiredNumberValidator: RequiredValidator = (value) => {
  if (typeof value !== "number") {
    return false
  }

  if (isNaN(value)) {
    return false
  }

  return true
}

export const requiredValidator: RequiredValidator = (value) => {
  if (value === null || value === undefined) {
    return false
  }

  switch (typeof value) {
    case "string":
      return requiredStringValidator(value)
    case "number":
      return requiredNumberValidator(value)
    case "boolean":
      return requiredBooleanValidator(value)
    default:
      return false
  }
}
