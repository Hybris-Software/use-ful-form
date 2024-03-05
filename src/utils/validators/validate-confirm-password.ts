import { Validator } from "../../types"

export const validateConfirmPassword: Validator = (value, values) => {
  // Check if the value is the same as the input named password
  if (value !== values["password"]) {
    return [false, "Passwords do not match"]
  } else {
    return [true, null]
  }
}
