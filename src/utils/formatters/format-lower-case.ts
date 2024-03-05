import { Formatter } from "../../types"

export const formatLowerCase: Formatter = (value) => {
  if (value === null || value === undefined) {
    return value
  }

  return value.toString().toLowerCase()
}
