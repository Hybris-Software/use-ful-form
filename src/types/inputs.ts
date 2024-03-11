import { InputType } from "./input-type"
import { Validator } from "./validators"
import { Formatter } from "./formatters"

export type InputValue = string | number | boolean | null | undefined

export type Input = {
  value?: InputValue
  nature: InputType
  apiName?: string
  required?: boolean
  validator?: Validator
  formatter?: Formatter
  sendToApi?: boolean

  // TODO: add validatorS and formatterS
}
