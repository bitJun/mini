import styles from './index.module.scss';
import { useState,useEffect } from 'react';
import { View, Text, MovableArea, MovableView,Button } from '@tarojs/components';
import classnames from 'classnames';
import { Dialog } from "@taroify/core";
interface SliderVerifyProps {
  openVerify:boolean;
  onVerifySuccess: (off:boolean) => void; // 验证成功回调
}
const SliderVerify: React.FC<SliderVerifyProps> = (props) => {
  const { onVerifySuccess,openVerify} = props;
  const [isVerified, setIsVerified] = useState(false);
  const [xPosition, setXPosition] = useState(0);
  useEffect(() => {
    if(!openVerify){
      setXPosition(0);
      setIsVerified(false);
      onVerifySuccess(false); //调用父组件回调
    }
  }, [openVerify]);
  const handleMoveEnd = (e) => {
    const { x } = e.detail;
    if (x >= 250) { //假设滑块长度为260
      setIsVerified(true);
      onVerifySuccess(true); //调用父组件回调
    } else {
      setXPosition(0); //复位
    }
  };
  const handelCancelVerify = () => {
    setXPosition(0);
    setIsVerified(false);
    onVerifySuccess(false); //调用父组件回调
  };
  return (
    <Dialog open={openVerify} onClose={handelCancelVerify}>
      <Dialog.Header>拖动滑块到右侧验证登录</Dialog.Header>
      <Dialog.Content>
        <View  className={styles.sliderVerify}>
          <View  className={classnames(styles.sliderTrack , {
            [styles.verified]:isVerified
          })}>
            {!isVerified && <Text className={styles.sliderHint}>滑动解锁</Text>}
            {isVerified && <Text className={classnames(styles.sliderHint,styles.success)}>验证成功</Text>}
          </View>
          {!isVerified && (
            <MovableArea className={styles.sliderArea} style="width: 520px;">
              <MovableView
                className={styles.sliderHandle}
                direction="horizontal"
                x={xPosition}
                onChange={(e) => {
                  if(e.detail.x > 250){
                    e.detail.x = 250;
                    setIsVerified(true);
                    onVerifySuccess(true);
                  }
                  setXPosition(e.detail.x);
                }}
                onTouchEnd={handleMoveEnd}
              >
                <Text className={styles.sliderHandleT}>→</Text>
              </MovableView>
            </MovableArea>
          )}
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={handelCancelVerify} style={{color:"#6236FF;"}}>暂不登录</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default SliderVerify;
