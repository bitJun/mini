import { CustomWrapper, Input, View } from '@tarojs/components';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';

type IExtendInputProps = {
  onInput: Input.onInput;
  type?: Input.type;
  value?: string;
  placeholder?: string;
  height?: 'full' | number;
  onBlur?: Input.onBlur;
  onConfirm?: Input.onConfirm;
  onNickNameReview?: Input.onNickNameReview;
  onKeyboardHeightChange?: Input.onKeyboardHeightChange;
  color?:string;
};

const ExtendInput: React.FC<IExtendInputProps> = (props) => {
  const { onInput, type, value, placeholder, height,color, onBlur, onConfirm, onNickNameReview, onKeyboardHeightChange } =
    props;

  return (
    <View
      className={styles.container}
      style={{
        height: height === 'full' ? '100%' : Taro.pxTransform(height || 100),
      }}
    >
      <CustomWrapper>
        <Input
          className={styles.input}
          cursorSpacing={20}
          adjustPosition={false}
          type={type}
          value={value}
          placeholder={placeholder === undefined ? '请输入' : placeholder}
          onInput={onInput}
          style={{
            backgroundColor: color || 'none',
            borderRadius:color ? '36px' : '12px',
            color:color == '#fff' ? '#101010' : '#fff'
          }}
          onBlur={onBlur}
          onConfirm={onConfirm}
          onNickNameReview={onNickNameReview}
          onKeyboardHeightChange={onKeyboardHeightChange}
        ></Input>
      </CustomWrapper>
    </View>
  );
};

export default ExtendInput;
