import { InputValue, Input } from "./inputs"
import { ValidationError } from "./errors"

export type UseFormProps = {
  inputs: {
    [key: string]: Input
  }
  onSubmit: (values: FormInputValues) => void
}

export type FormInputValues = { [key: string]: InputValue }

export type FormErrors = { [key: string]: ValidationError }

export type FormShowErrors = { [key: string]: boolean }

export type GetInputPropsOptions = {
  handleKeyDown?: boolean
}
