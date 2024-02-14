import { InputValue } from "./inputs";
import { ValidationError } from "./errors";

export type FormInputValues = { [key: string]: InputValue };

export type FormErrors = { [key: string]: ValidationError };

export type FormShowErrors = { [key: string]: boolean };
