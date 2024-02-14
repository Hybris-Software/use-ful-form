import { Formatter } from "../../types";

export const formatEmail: Formatter = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  return value.toString().toLowerCase().replace(" ", "");
};
