import { InputValue } from "./inputs";
import { Error } from "./errors";

export type Validator = (
  value: InputValue,
  values: { [key: string]: InputValue }
) => Error;

export type RequiredValidator = (value: InputValue) => boolean;
