import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import fetch from '@/lib/request';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Dialog } from "@taroify/core";
type canDoListP = {
  showDiaC:boolean
  prices?:Fetch.prices;
  setShowDiaC: (off:boolean) => void;
  reFresh: () => void;
}
const DiaPay:React.FC<canDoListP> = (props) => {
  const {showDiaC,setShowDiaC,prices,reFresh} = props;
  const [tabIndex, setTabIndex] = useState(1);
  useEffect(() => {
   
  },[]);
 
  const postPay = useMemoizedFn(async () => {
    if(!prices)return;
    let num = prices[tabIndex]?.price;
    Taro.showLoading({ title: '请求中',mask:true });
    const [result, error] =  await fetch.postWalletPay(
      {
        charge_type:3,
        pay_type:2,
        computility:{
          num
        }
      }
    );
    Taro.hideLoading();
    if (!result || error) return;
    startPayment(result.prepay_req);
  });
   // 发起支付请求
    const startPayment = async (result) => {
      setShowDiaC(false)
      try {
        const res = await Taro.requestPayment(result);
        console.log('支付成功', res);
        Taro.showToast({ title: '支付成功', icon: 'none' });
        reFresh();
      } catch (error) {
        console.error('支付失败', error);
        Taro.showToast({ title: '支付失败', icon: 'none' });
      }
    }
  return (
    <Dialog open={showDiaC} onClose={setShowDiaC} className={styles.myDialog}>
        <Dialog.Header>购买算力</Dialog.Header>
        <Dialog.Content>
           <View className={styles.myDialogContent}>
             {
              prices?.map((item,index)=>{
                return <View key={index} onClick={()=>setTabIndex(index)} className={classnames(styles.myDialogContentCC, { [styles.active]: tabIndex == index})}>
                  <View>{item.k}</View>
                  <View>{item.v}</View>
                  <View>{item.desc}</View>
                </View>
              })
             }
             <View className={styles.myDialogBtn} onClick={postPay}>立即购买</View>
           </View>
        </Dialog.Content>
      </Dialog>
  );
};
export default DiaPay;