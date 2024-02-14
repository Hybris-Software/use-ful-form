import { InputValue } from "./input";
import { Error } from "./errors";

export type FormInputValues = { [key: string]: InputValue };

export type FormErrors = { [key: string]: Error };

export type FormShowErrors = { [key: string]: boolean };
