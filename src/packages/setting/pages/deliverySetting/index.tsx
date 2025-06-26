import { Button, Cell, Dialog, Field, FixedView, Input, Popup, SafeArea, Switch, Tag } from '@taroify/core';
import { Delete } from '@taroify/icons';
import { ScrollView, View, Image } from '@tarojs/components';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import fetch from '@/lib/request';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';

definePageConfig({
  navigationBarTitleText: '投放设置',
  enableShareAppMessage: true,
});

const defaultTopic = {
  id: null,
  is_default: false,
  name: '',
  topics: [],
  customTopic: '',
  inputVisible: false,
};

const DeliverySetting = () => {
  const [isWalter, setIsWalter] = useState<boolean>(false);
  const [textWater, setTextWater] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [dictConfigOpen, setDictConfigOpen] = useState<boolean>(false);
  const [dictConfig, setDictConfig] = useState<Fetch.IGetDictConfigRes>();
  const [dictType, setDictType] = useState<string>();
  const [labelOpen, setLabelOpen] = useState(false);
  const [labelIndex, setLabelIndex] = useState<number>(-1);
  const [labelStr, setLabelStr] = useState<string>('');
  const [topicGroup, setTopicGroup] = useState<Fetch.IGetDeliverConfigRes['topic_group']>([defaultTopic]);

  useAsyncEffect(async () => {
    const promiseResult = await Promise.all([
      await fetch.getDeliverConfig(),
      await fetch.getDictConfig({ type: 'cover_title_style' }),
    ]);
    const [result0, error0] = promiseResult[0];
    const [result1, error1] = promiseResult[1];
    if (result0 && result0.with_watermark !== undefined) {
      setIsWalter(result0.with_watermark);
      setTextWater(result0.text_watermark);
      setLocation(result0.location);
      setDictType(result0.cover_title_style_dict);
      setTopicGroup(result0.topic_group);
    }
    if (result1) {
      setDictConfig(result1);
    }
    if ((!result0 || result0.with_watermark === undefined) && result1) {
      setDictType(result1[0].sub_type);
    }
  }, []);

  useAsyncEffect(async () => {
    const [result, error] = await fetch.getDictConfig({ type: 'cover_title_style' });
    if (error || !result) return;
    setDictConfig(result);
  }, []);

  /** 封面文字效果 */
  const dictTypeImage = useMemo(() => {
    if (!dictConfig) return '';
    const findItem = dictConfig.find((item) => dictType === item.sub_type);
    if (findItem) {
      return findItem.content.image;
    }
    return '';
  }, [dictConfig, dictType]);

  /** 新增话题组 */
  const handelAddTopicGroup = useMemoizedFn(() => {
    const cloneTopicGroup = topicGroup.concat(defaultTopic);
    setTopicGroup(cloneTopicGroup);
  });

  /** 删除话题组 */
  const handelDeleteTopicGroup = useMemoizedFn((index) => {
    if (topicGroup.length <= 1) {
      Taro.showToast({ title: '至少保留一个话题组', icon: 'none' });
      return;
    }
    topicGroup.splice(index, 1);
    setTopicGroup([...topicGroup]);
  });

  /** 标签 */
  const handelCancelTopic = useMemoizedFn(() => {
    setLabelStr('');
    setLabelOpen(false);
  });
  const handelDeleteTopic = useMemoizedFn((index, topicIndex) => {
    topicGroup[index].topics.splice(topicIndex, 1);
    setTopicGroup([...topicGroup]);
  });
  const handelCreateTopic = useMemoizedFn(() => {
    if (!labelStr || labelIndex === -1) return;
    topicGroup[labelIndex].topics = topicGroup[labelIndex].topics.concat([labelStr]);
    setTopicGroup([...topicGroup]);
    handelCancelTopic();
  });

  /** 保存设置 */
  const handelSubmit = useMemoizedFn(async () => {
    const [result, error] = await fetch.postDeliverConfig({
      with_watermark: isWalter,
      text_watermark: textWater || '',
      location: location || '',
      cover_title_style_dict: dictType || '',
      topic_group: topicGroup,
    });
    if (error || !result) return;
    Taro.showToast({ title: '保存成功', icon: 'none' });
  });

  return (
    <View className={styles.container}>
      <ScrollView scrollY className={styles.scrollView}>
        <Cell.Group title="基础设置" className={styles.fieldGroup}>
          <Field required label="图片水印" className={styles.fieldLabel}>
            <Switch
              size="24"
              checked={isWalter}
              onChange={(checked) => setIsWalter(checked)}
              className={styles.fieldValue}
            />
          </Field>
          <Field required label="文字水印" className={styles.fieldLabel}>
            <Input
              placeholder="请填写文字水印"
              value={textWater}
              onChange={({ detail }) => setTextWater(detail.value)}
              className={styles.fieldValue}
            />
          </Field>
          <Field required label="地理位置" className={styles.fieldLabel}>
            <Input
              placeholder="请填写作品投放默认标记位置"
              value={location}
              onChange={({ detail }) => setLocation(detail.value)}
              className={styles.fieldValue}
            />
          </Field>
          <Field required label="封面样式" className={styles.fieldLabel}>
            <View onClick={() => setDictConfigOpen(true)} className={styles.fieldValue}>
              <Image className={styles.fieldImage} src={dictTypeImage}></Image>
            </View>
          </Field>
        </Cell.Group>
        <Cell.Group title="话题管理" className={styles.fieldGroup}>
          <View className={styles.fieldCardBox}>
            <View className={styles.fieldControls}>
              <Button variant="contained" color="primary" shape="round" size="small" onClick={handelAddTopicGroup}>
                新增话题组
              </Button>
            </View>
            {topicGroup.map((item, index) => {
              return (
                <View className={styles.fieldCard}>
                  <Field required label="默认话题组" className={styles.fieldLabel}>
                    <View className={styles.fieldBetween}>
                      <Switch
                        size="24"
                        checked={item.is_default}
                        onChange={(checked) => {
                          const cloneTopicGroup = topicGroup.map((item, i) => {
                            item.is_default = i === index ? checked : false;
                            return item;
                          });
                          setTopicGroup([...cloneTopicGroup]);
                        }}
                        className={styles.fieldValue}
                      />
                      <Delete size={28} onClick={() => handelDeleteTopicGroup(index)} />
                    </View>
                  </Field>
                  <Field required label="话题组名称" className={styles.fieldLabel}>
                    <Input
                      placeholder="请填写话题组名称"
                      value={item.name}
                      onChange={({ detail }) => {
                        topicGroup[index].name = detail.value;
                        setTopicGroup([...topicGroup]);
                      }}
                      className={styles.fieldValue}
                    />
                  </Field>
                  <Field required label="话题标签" className={styles.fieldLabel}>
                    <View className={styles.tagBox}>
                      {item.topics.map((item, topicIndex) => {
                        return (
                          <Tag
                            className={styles.tag}
                            size="large"
                            closeable
                            onClose={() => {
                              handelDeleteTopic(index, topicIndex);
                            }}
                          >
                            {item}
                          </Tag>
                        );
                      })}
                      <Tag
                        className={styles.tag}
                        size="large"
                        onClick={() => {
                          setLabelIndex(index);
                          setLabelOpen(true);
                        }}
                      >
                        增加标签
                      </Tag>
                    </View>
                  </Field>
                </View>
              );
            })}
          </View>
        </Cell.Group>
      </ScrollView>
      <FixedView position="bottom">
        <View className={styles.controls}>
          <Button variant="contained" color="primary" shape="round" className={styles.button} onClick={handelSubmit}>
            保存设置
          </Button>
        </View>
        <SafeArea position="bottom" />
      </FixedView>

      {/* 选择封面样式 */}
      <Popup open={dictConfigOpen} rounded placement="bottom" onClose={setDictConfigOpen} style={{ height: '360px' }}>
        <View className={styles.popupBox}>
          <View className={styles.operatingArea}>
            <View className={styles.cancel}></View>
            <View className={styles.title}>选择封面样式</View>
            <View className={styles.confirm}></View>
          </View>
          <ScrollView scrollY className={styles.popupContent}>
            {dictConfig?.map((item) => {
              return (
                <Image
                  className={styles.popupImage}
                  src={item.content.image}
                  onClick={() => {
                    setDictType(item.sub_type);
                    setDictConfigOpen(false);
                  }}
                ></Image>
              );
            })}
          </ScrollView>
        </View>
      </Popup>
      {/* 新增标签 */}
      <Dialog open={labelOpen} onClose={handelCancelTopic}>
        <Dialog.Content>
          <Input
            value={labelStr}
            onChange={({ detail }) => setLabelStr(detail.value)}
            placeholder="输入标签内容"
          ></Input>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={handelCancelTopic}>取消</Button>
          <Button onClick={handelCreateTopic}>确认</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default DeliverySetting;
