import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 组件卸载时清除定时器
    return () => clearInterval(interval);
  }, []);

  // 获取星期几
  const weekday = time.toLocaleDateString('en-US', { weekday: 'long' });
  // 获取月份
  const month = time.toLocaleDateString('en-US', { month: 'long' });
  // 获取日期
  const day = time.getDate();
  // 获取小时
  let hour = time.getHours();
  // 转换为 AM/PM 格式
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // 将小时转换为 12 小时制
  // 获取分钟
  const minute = time.getMinutes();
  // 获取秒
  const second = time.getSeconds();

  return (
    <div className="clock">
      {/* <h2>Current Time:</h2> */}
      <p>{`${weekday.substring(0,3)}, ${month} ${day} at ${hour}:${minute}:${second} ${ampm}`}</p>
    </div>
  );
};

export default Clock;
