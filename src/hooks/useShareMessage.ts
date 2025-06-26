import { useShareAppMessage,useShareTimeline } from '@tarojs/taro';

const useShareMessage = () => {
  useShareAppMessage(() => {
    return {
      title: 'LIngInt致力于为各企业打造胜任多种岗位职责的智能员工',
      imageUrl: 'https://image.aindecor.co/AInDecorBase/source_data/lingint_miniprograms.jpeg',
      path:'/pages/creation/index?ref=share',
    };
  });
};
export const useShareMessagePYQ = () => {
  useShareTimeline(() => {
    return {
      title: 'LIngInt致力于为各企业打造胜任多种岗位职责的智能员工',
      imageUrl: 'https://image.aindecor.co/AInDecorBase/source_data/lingint_miniprograms.jpeg',
      path: '/pages/creation/index',
    };
  });
};
export default useShareMessage;
