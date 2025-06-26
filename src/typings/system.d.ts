import { CommonEventFunction, FormProps, InputProps } from '@tarojs/components';

declare global {
  namespace Input {
    type type = keyof InputProps.Type;
    type onInput = CommonEventFunction<InputProps.inputEventDetail>;
    type onBlur = CommonEventFunction<InputProps.inputValueEventDetail>;
    type onConfirm = CommonEventFunction<InputProps.inputValueEventDetail>;
    type onNickNameReview = CommonEventFunction;
    type onKeyboardHeightChange = CommonEventFunction<InputProps.onKeyboardHeightChangeEventDetail>;
  }
  namespace Form {
    type onSubmit = CommonEventFunction<FormProps.onSubmitEventDetail>;
  }
}

export {};
