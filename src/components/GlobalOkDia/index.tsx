import { View,Button } from '@tarojs/components';
import styles from './index.module.scss';
import { Arrow,Cross,Checked } from "@taroify/icons";
import { Dialog} from "@taroify/core";
import Router from '@/lib/router';
type IProps = {
  from:string;
  title:string;
  showDia:boolean;
  setShowDia:(a:boolean) => void;
};
const GlobalOkDia :React.FC<IProps> = (props) => {
  const { showDia,setShowDia,title,from} = props;
  const handleClick = () => {
    if(from == '任务列表'){
      Router.navigate('LIngInt://taskList')
    }
  }
  return (
    <Dialog open={showDia} onClose={setShowDia} className={styles.myDialog}>
      <Dialog.Content>
        <View className={styles.myDialogBox}>
          <View className={styles.okStatus}>
            <Checked className={styles.checkOk} />
          </View>
          <View className={styles.title}>{title}</View>
          <View  className={styles.desc} onClick={handleClick}>
            <View className={styles.from}>{from}</View>
            <Arrow className={styles.icon} />
          </View>
          <Button className={styles.okTest}>好的</Button>
        </View>
        <Cross className={styles.myDialogClosed} onClick={()=>setShowDia(false)} />
      </Dialog.Content>
    </Dialog>
  );
};
export default GlobalOkDia;