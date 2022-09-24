import useForm from "./useForm";

// Validators
import validateCheckbox from './FormValidators/validateCheckbox';
import validateNoEmptyInput from './FormValidators/validateNoEmptyInput';
import validateConfirmPassword from "./FormValidators/validateConfirmPassword";
import validateEmail from './FormValidators/validateEmail';
import validatePassword from './FormValidators/validatePassword';

// Styles
import PasswordStyle from './Styles/SecurityStyle.module.css'

// Utils
import classNames from './Utils/classNames';
import passwordStyleStates from './Utils/passwordStyleStates';

export default useForm;

export {
    validateCheckbox,
    validateNoEmptyInput,
    validateConfirmPassword,
    validateEmail,
    validatePassword,
    PasswordStyle,
    classNames,
    passwordStyleStates
};  