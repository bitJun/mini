import React, { useEffect, useState,useRef } from "react";
import { View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Slider } from '@taroify/core';
import styles from './index.module.scss';
import { Play, Pause} from "@taroify/icons";
type IUrlProps = {
  url:string;
  reflexData:boolean;
};
// 全局 audioManager
const AudioPlayer: React.FC<IUrlProps> = (props) => {
  const { url = '',reflexData } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<Taro.InnerAudioContext | null>(null); // 使用 useRef
  useEffect(() => {
    const audioContext = Taro.createInnerAudioContext();
    audioRef.current = audioContext; 
    audioContext.src = url; // 音频 URL
    audioContext.autoplay = false
    // 订阅事件，监听其他组件的播放事件
    const handleAudioPlay = (currentAudio: Taro.InnerAudioContext) => {
      if (audioContext !== currentAudio) {
        audioContext.pause(); // 暂停当前音频
      }
    }
    audioContext.onTimeUpdate(() => {
      setCurrentTime(audioContext.currentTime);
      setDuration(audioContext.duration);
    });
    audioContext.onEnded(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    audioContext.onPlay(() => {
      setIsPlaying(true);
      // 发布事件，通知其他组件暂停
      Taro.eventCenter.trigger('audioPlay', audioContext)
    })
    audioContext.onPause(() => {
      setIsPlaying(false)
    })
    // audioContext.onError((err) => {
    //   console.error('音频播放错误:', err,url)
    // })
    Taro.eventCenter.on('audioPlay', handleAudioPlay);
    return () => {
      audioRef.current?.destroy();
      Taro.eventCenter.off('audioPlay', handleAudioPlay);
    };
  }, [url]);
  useEffect(() => {
    audioRef.current?.pause();
  }, [reflexData]);
  // 播放/暂停
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  // 拖动进度条
  const handleSliderChange = (e) => {
    if(audioRef.current){
      audioRef.current.seek(e);
      setCurrentTime(e);
    }
  };

  return (
    <View className={styles.audioPlayer} >
      {
        isPlaying ? <Pause className={styles.audioPlayerBtn} onClick={handlePlayPause} /> : <Play className={styles.audioPlayerBtn} onClick={handlePlayPause} /> 
      }
      <Slider
        size={17}
        value={currentTime}
        max={duration}
        step={1}
        onChange={handleSliderChange}
        className={styles.audioPlayerSlider}
      />
    </View>
  );
};

export default AudioPlayer;