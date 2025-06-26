import fetch from '@/lib/request';
import uploadFile from '@/lib/request/upload';
import Router from '@/lib/router';
import { Button, Cell, Form, Textarea, Uploader } from '@taroify/core';
import { Input, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import styles from './index.module.scss';
definePageConfig({
  navigationBarTitleText: '问题反馈',
});

const Feedback = () => {
  const [uploadImages, setUploadImages] = useState<Uploader.File[]>([]);

  const onSubmit: Form.onSubmit = useMemoizedFn(async ({ detail }) => {
    if (!detail.value) return;
    // 上传图片
    Taro.showLoading({ title: '图片上传中',mask:true });
    const images = await uploadImage();
    Taro.hideLoading();
    // @ts-ignore
    const params: Fetch.IPostFeedbackParams = detail.value;
    params.images = images;
    const [result, error] = await fetch.postFeedback(params);
    if (error || !result) return;
    Taro.showToast({ title: '提交成功', icon: 'none' });
    setTimeout(() => Router.navigateBack(), 1500);
  });

  const onUpload = useMemoizedFn(() => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(async ({ tempFiles, tempFilePaths }) => {
      setUploadImages([
        ...uploadImages,
        ...tempFiles.map(({ path, type, originalFileObj }) => ({
          type,
          url: path,
          name: originalFileObj?.name,
          uploadUrl: tempFilePaths[0],
        })),
      ]);
    });
  });

  const uploadImage = useMemoizedFn(() => {
    return Promise.all(
      uploadImages.map(async (item) => {
        console.log(item);
        // @ts-ignore
        const [result, error] = await uploadFile(item.uploadUrl, undefined, { temp: true });
        if (error || !result) return;
        return result[0].img_path;
      }),
    );
  });

  return (
    <View className={styles.custom}>
      <Form onSubmit={onSubmit} style={{background:"#2e2e2e" }}>
        <Cell.Group inset>
          {/* <Form.Item name="rate">
            <Form.Label>评分</Form.Label>
            <Form.Control>
              <Rate className={styles.customColor} allowHalf size={25} emptyIcon={<Star />} />
            </Form.Control>
          </Form.Item> */}
          <Form.Item name="phone">
            <Form.Label>电话</Form.Label>
            <Form.Control>
              <Input style={{color:"#fff"}} placeholderStyle='color:rgba(255,255,255,0.4)' placeholder="请输入电话" />
            </Form.Control>
          </Form.Item>
          <Form.Item name="content">
            <Form.Label>建议</Form.Label>
            <Form.Control>
              <Textarea style={{ height: '48px',color:"#fff" }} limit={200} placeholder="请输入建议"
              placeholderStyle='color:rgba(255,255,255,0.4)'
              />
            </Form.Control>
          </Form.Item>
          <Form.Item name="images">
            <Form.Label>图片</Form.Label>
            <Form.Control>
              <Uploader value={uploadImages} multiple maxFiles={4} onUpload={onUpload} onChange={setUploadImages} />
            </Form.Control>
          </Form.Item>
        </Cell.Group>
        <View style={{ margin: '16px' }}>
          <Button shape="round" block color="primary" formType="submit">
            提交
          </Button>
        </View>
      </Form>
    </View>
  );
};

export default Feedback;
