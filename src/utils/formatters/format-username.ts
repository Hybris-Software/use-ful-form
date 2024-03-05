import { Formatter } from "../../types"

export const formatUsername: Formatter = (value) => {
  if (value === null || value === undefined) {
    return value
  }

  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\_\.]/g, "")
}
