import { useState } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"

const CustomCalendar: React.FC = () => {
  const [value, setValue] = useState<Date>(new Date());


  const month = value.getMonth() + 1; 
  const day = value.getDate();

  return (
    <div className="flex gap-3 bg-[#E6DFD6] p-3 rounded-2xl shadow-md w-[100%] h-[100%] justify-around items-center">
      {/* 左邊大日期 */}
      <div className="flex flex-col items-center justify-center text-gray-700 w-50">
        <div className="text-3xl font-semibold">{month}月</div>
        <div className="text-[80px] leading-none font-bold">{day}</div>
      </div>

      {/* 右邊月曆 */}
      <div className="calendar-container">
        <Calendar
          onChange={(date) => setValue(date as Date)}
          value={value}
          locale="zh-TW"
          next2Label={null}
          prev2Label={null}
          className="react-calendar"
          tileClassName={({ date }) => {
            if (
              date.getDate() === day &&
              date.getMonth() === value.getMonth()
            ) {
              return "bg-gray-700 text-white rounded-full";
            }
            return "text-gray-700";
          }}
        />
      </div>
    </div>
  );
};
export default CustomCalendar