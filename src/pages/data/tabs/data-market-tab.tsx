import useShareMessage from '@/hooks/useShareMessage';
import Router, { _checkLogin } from '@/lib/router';
import { Cell, Picker, Popup, Empty } from '@taroify/core';
import OperatingMarket from '@/packages/creator/pages/operatingMarket';
import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import styles from '../index.module.scss';
import fetch from '@/lib/request';
import { useState, useEffect, useMemo } from 'react';
import CustomHeader from '@/components/CustomHeader/index';
import { CalendarOutlined } from '@taroify/icons';
definePageConfig({
  navigationStyle: 'custom',
  enableShareAppMessage: true,
  enableShareTimeline: true,
});
interface ITimelineItemO {
  desc: string;
  quarter: string;
}
type IGetTimeLineResO = ITimelineItemO[]; // 数组类型
const DataMarketTab = () => {
  const [timeValue, setTimeValue] = useState('');
  const [options, setOptions] = useState<IGetTimeLineResO>(); // 下拉选项
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [openPicker, setOpenPicker] = useState(false);
  const [dataProcess, setDataProcess] = useState<Fetch.IWorkingProgressItem>();
  useEffect(() => {
    // 获取当前月份
    const month = new Date().getMonth() + 1; // getMonth() 返回的月份是从 0 开始的，所以加 1
    setCurrentMonth(month + '');
  }, []); //
  useShareMessage();

  useDidShow(() => {
    _checkLogin();
    fetchWorkingProgressTimeline();
  });
  const fetchWorkingProgressTimeline = useMemoizedFn(async () => {
    const [result, error] = await fetch.getWorkingProgressTimeline();
    if (error || !result) return;
    if (result.length) {
      const formattedOptions: IGetTimeLineResO = result.map((item) => ({
        desc: item.desc, // 将 desc 转换为 Picker 需要的 text
        year: item.year,
        quarter: item.quarter + '', // 你可以根据需求选择转换的字段
      }));
      setOptions(formattedOptions);
      const ind = result.findIndex((o) => String(o.quarter) == currentMonth);
      if (ind == -1) {
        setCurrentMonth(result[result.length - 1].quarter + '');
        setTimeValue(result[result.length - 1].desc);
        fetchWorkingProgress(result[result.length - 1]);
      } else {
        setCurrentMonth(result[ind].quarter + '');
        setTimeValue(result[ind].desc);
        fetchWorkingProgress(result[ind]);
      }
    }
  });
  const fetchWorkingProgress = useMemoizedFn(async (data) => {
    const [result, error] = await fetch.getWorkingProgress({
      year: data.year,
      quarter: data.quarter,
    });
    if (error || !result) return;
    // console.log(result,'result')
    setDataProcess(result);
    // 加载当前月份的数据
  });
  // const goToOperatingMarket = useMemoizedFn(() => {
  //   Router.navigate('LIngInt://operatingMarket');
  // });
  const confirmTime = (val) => {
    const ind = options?.findIndex((o) => o.quarter == val);
    if (ind != -1 && options?.length) {
      setTimeValue(options[ind || 0].desc);
      console.log(options[ind || 0], 'options[ind || 0]');
      fetchWorkingProgress(options[ind || 0]);
    }
    setOpenPicker(false);
  };
  const [deliverStats, setDeliverStats] = useState<Fetch.IGetDeliverStatsRes>();
  useDidShow(async () => {
    const [result, error] = await fetch.getDeliverStats();
    if (error || !result) return;
    setDeliverStats(result);
  });

  const isEmpty = useMemo(() => {
    if (!deliverStats) return true;
    if (!deliverStats.platform_pie_board) return true;
    if (!deliverStats.total_stats_board) return true;
    if (deliverStats.platform_stats_board.length <= 0) return true;
    return false;
  }, [deliverStats]);

  return (
    <View className={styles.container}>
      <View className={styles.containerTop}>
        <View className={styles.containerTopLeft}>
          <CalendarOutlined className={styles.containerTopLeftIcon}></CalendarOutlined>
          <Text className={styles.containerTopLeftText} onClick={() => setOpenPicker(true)}>
            {timeValue}
          </Text>
        </View>
        <Popup
          open={openPicker}
          rounded
          placement="bottom"
          onClose={setOpenPicker}
          style={{
            background: '#2e2e2e',
            color: '#fff',
            paddingTop: '12px',
            paddingBottom: '24px',
            overflow: 'hidden',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Popup.Backdrop />
          <Picker
            cancelText="取消"
            confirmText="确认"
            columns={options}
            defaultValue={currentMonth + ''}
            columnsFieldNames={{
              label: 'desc',
              value: 'quarter',
            }}
            onCancel={() => setOpenPicker(false)}
            onConfirm={(values) => confirmTime(values)}
          ></Picker>
        </Popup>
        <View
          className={styles.containerTopRight}
          dangerouslySetInnerHTML={{
            __html: dataProcess?.onboard_info || '', // 使用 dangerouslySetInnerHTML
          }}
        ></View>
      </View>
      <View className={styles.containerMid}>
        <View className={styles.containerMidChild}>
          {dataProcess?.work_info.map((item, index) => (
            <View key={index} className={styles.list}>
              <View className={styles.listTop}>{item.value}</View>
              <View className={styles.listBottom}>{item.name}</View>
            </View>
          ))}
        </View>
        <View className={styles.containerMidChild}>
          {dataProcess?.work_effect.map((item, index) => (
            <View key={index} className={styles.list}>
              <View className={styles.listTop}>{item.value}</View>
              <View className={styles.listBottom}>{item.name}</View>
            </View>
          ))}
        </View>
      </View>
      <View className={styles.containerBottom}>
        <View>
          {!isEmpty ? (
            <>
              <Cell.Group title="智能运营大盘" className={styles.containerBottomItem}>
                <Cell title="昨日新增播放量" className={styles.containerBottomItemC}>
                  {deliverStats!.total_stats_board.last_1_day_play}
                </Cell>
                <Cell title="昨日新增互动量" className={styles.containerBottomItemC}>
                  {deliverStats!.total_stats_board.last_1_day_interact}
                </Cell>
                <Cell title="昨日新增客户线索数" className={styles.containerBottomItemC}>
                  {deliverStats!.total_stats_board.last_1_day_clue}
                </Cell>
                <Cell title="本月作品发布数" className={styles.containerBottomItemC}>
                  {deliverStats!.total_stats_board.last_30_day_work}
                </Cell>
                <Cell title="本月新增播放量" className={styles.containerBottomItemC}>
                  {deliverStats!.total_stats_board.last_30_day_play}
                </Cell>
                <Cell
                  title={`粉丝总量(账号总数:${deliverStats!.total_stats_board.total_account_num})`}
                  className={styles.containerBottomItemC}
                >
                  {deliverStats!.total_stats_board.total_fan_num}
                </Cell>
              </Cell.Group>
            </>
          ) : (
            <Empty className={styles.empty}>
              <Empty.Image />
              <Empty.Description className={styles.emptyTop}>暂无数据</Empty.Description>
              <Empty.Description>老板，我的所有工作数据都汇总在这儿，您可以随时查看我的表现和成果！</Empty.Description>
            </Empty>
          )}
        </View>
      </View>
    </View>
  );
};

export default DataMarketTab;
