import { useForm } from './Forms/single-form';
import { useMuliStepForm } from './Forms/multi-step-form';

export * from './Forms/multi-step-form';
export * from './Forms/single-form';
export * from './Utils/Formatters';
export * from './Utils/Validators';

// Easter egg
export {
  useMuliStepForm as useMuliStepMom,
  useMuliStepForm as useMuliStepSister,
  useMuliStepForm as useMuliStepDad,
  useMuliStepForm as useMuliStepBrother,
  useMuliStepForm as useMuliStepCousin,
  useMuliStepForm as useMuliStepUncle,
  useMuliStepForm as useMuliStepAunt,
};

export default useForm;
