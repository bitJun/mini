export const formatTimestamp = (timestamp, type) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let formattedDate = `${month}月${day}日 ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  if (type) {
    formattedDate = `${year}年${month}月${day}日 ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
  switch (type) {
    case 'chat':
      formattedDate = `${year}/${month}/${day} ${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`;
      break;
    case 'time':
      formattedDate = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
      }`;
      break;
  }
  return formattedDate;
};
type Icolumns = {
  dates: {
    label:string;
    value:string;
  }[];
  times: {
    label:string;
    value:string;
  }[];
};
export function getWorkDaysAndTimeSlots(now:Date) {
  const WORK_HOURS = [
    { label: "凌晨", value: "凌晨", start: 0, end: 6 },
    { label: "上午", value: "上午", start: 6, end: 12 },
    { label: "下午", value: "下午", start: 12, end: 18 },
    { label: "晚上", value: "晚上", start: 18, end: 24 },
  ];
  const currentHour = now.getHours() + 6;
  const currentMinute = now.getMinutes();
  // 获取从当前时间开始往后 15 个工作日
  const getNextWorkDays = (days: number) => {
    const dates = <Icolumns['dates']>[];
    let date = new Date();
    while (dates.length < days) {
      date.setDate(date.getDate() + 1); // 加一天
      dates.push({
        label: date.toISOString().split("T")[0],
        value: date.toISOString().split("T")[0],
      });
    }
    return dates;
  };
  // 获取当天剩余时间段
  
  const getRemainingTimeSlots = () => {
    return WORK_HOURS.filter(
      (slot) =>
        currentHour < slot.end ||
        (currentHour === slot.end && currentMinute === 0) // 刚好到整点
    ).map((slot) => ({ label: slot.label, value: slot.value }));
  };
  // 如果当天没有剩余时间段，移除第一天
  const workDays:Icolumns['dates'] = getNextWorkDays(15);
  let remainingTimeSlots:Icolumns['times'] = getRemainingTimeSlots();
  if(remainingTimeSlots.length == 0){
    remainingTimeSlots = [
      { label: "凌晨", value: "凌晨" },
      { label: "上午", value: "上午"},
      { label: "下午", value: "下午"},
      { label: "晚上", value: "晚上"},
    ]
  }
  return {
    dates:workDays,
    times:remainingTimeSlots
  };
}

