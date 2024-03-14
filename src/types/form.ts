import { InputValue, Input, InputProps } from "./inputs"
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

export type UseFormReturn = {
  values: FormInputValues
  setInputValue: (key: string, value: InputValue, showErrors?: boolean) => void
  errors: FormErrors
  setInputError: (key: string, error: string) => void
  getInputProps: (key: string, options?: GetInputPropsOptions) => InputProps
  resetInput: (input: string) => void
  isValid: boolean
  validate: () => boolean
  reset: () => void
  submit: () => void
  getApiBody: () => any
  fetchApiErrors: (receivedErrors: any) => void
  fetchApiValues: (
    receivedData: any,
    options: {
      include?: string[] | undefined
      exclude?: string[] | undefined
    }
  ) => void
  pushApiError: (apiName: string, errorDetails: string | Array<string>) => void
  pushApiValue: (apiName: string, value: InputValue) => void
}
