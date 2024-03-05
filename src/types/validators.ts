import { InputValue } from "./inputs"
import { ValidationError } from "./errors"

export type Validator = (
  value: InputValue,
  values: { [key: string]: InputValue }
) => ValidationError

export type RequiredValidator = (value: InputValue) => boolean
