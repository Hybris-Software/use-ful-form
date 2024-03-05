import { Validator } from "../../types"

export const validateEmail: Validator = (value) => {
  // Return error if the type is not string
  if (typeof value !== "string") {
    return [false, "Invalid email"]
  }

  // Check if the email is valid using a regular expression
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (re.test(value.toLowerCase())) {
    return [true, null]
  } else {
    return [false, "Invalid email"]
  }
}
