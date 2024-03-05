import { InputTypes } from "../data/input-types"

export type InputType = (typeof InputTypes)[keyof typeof InputTypes]
