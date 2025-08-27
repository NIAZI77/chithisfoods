import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { format } from 'date-fns';

const DeliverySchedule = ({ 
  deliveryDate, 
  deliveryTime, 
  onDateChange, 
  onTimeChange,
  getMinTimeForDate,
  getMinDate
}) => {
  const [timeWarning, setTimeWarning] = useState(false);
  
  // Check if time is getting close to being invalid
  useEffect(() => {
    if (!deliveryDate || !deliveryTime) return;
    
    const checkTimeWarning = () => {
      const now = new Date();
      const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDate = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate());
      
      if (currentDate.getTime() === selectedDate.getTime()) {
        const [hours, minutes] = deliveryTime.split(':').map(Number);
        const selectedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        const warningThreshold = new Date(now.getTime() + 45 * 60000); // 45 minutes from now
        
        setTimeWarning(selectedTime < warningThreshold);
      } else {
        setTimeWarning(false);
      }
    };
    
    checkTimeWarning();
    const interval = setInterval(checkTimeWarning, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [deliveryDate, deliveryTime]);
  
  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="font-black text-base sm:text-lg lg:text-xl mt-6 sm:mt-8 mb-3 sm:mb-4 text-black flex items-center gap-2">
        <Calendar className="inline w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> Delivery Schedule
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-4">
        <div className="flex flex-col gap-1 px-1">
          <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-1 sm:mb-2">
            Delivery Date
          </label>
          <div className="w-full">
            <DatePicker
              value={dayjs(deliveryDate)}
              onChange={(date) => {
                if (!date) return;
                const selectedDate = date.toDate();
                const now = new Date();
                
                // Check if selected date is in the past
                if (selectedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
                  return;
                }
                
                const minTime = getMinTimeForDate(selectedDate);
                onDateChange(selectedDate, minTime);
              }}
              minDate={getMinDate ? dayjs(getMinDate()) : dayjs()}
              disablePast={true}
              className="w-full rounded-lg sm:rounded-xl"
              sx={{
                '& .MuiPickersSectionList-root': {
                  paddingTop: '21px',
                },
                '& .MuiIconButton-root': {
                  marginBottom: '-5px',
                },
                '& .MuiInputBase-root': {
                  fontSize: '14px',
                  backgroundColor: '#f1f5f9', // slate-100
                  '@media (min-width: 640px)': {
                    fontSize: '16px',
                  }
                }
              }}
            />

          </div>
        </div>
        
        <div className="flex flex-col gap-1 px-1">
          <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-1 sm:mb-2">
            Delivery Time
          </label>
          <div className="w-full">
            <TimePicker
              value={dayjs(`2000-01-01 ${deliveryTime}`)}
              onChange={(time) => {
                if (!time) return;
                const selectedTime = time.format("HH:mm");
                onTimeChange(selectedTime);
              }}
              minTime={getMinTimeForDate(deliveryDate) ? dayjs(`2000-01-01 ${getMinTimeForDate(deliveryDate)}`) : undefined}
              disablePast={true}
              className="w-full rounded-lg sm:rounded-xl"
              views={['hours', 'minutes']}
              minutesStep={5}
              sx={{
                '& .MuiPickersSectionList-root': {
                  paddingTop: '21px',
                },
                '& .MuiIconButton-root': {
                  marginBottom: '-5px',
                },
                '& .MuiInputBase-root': {
                  fontSize: '14px',
                  backgroundColor: '#f1f5f9', // slate-100
                  '@media (min-width: 640px)': {
                    fontSize: '16px',
                  }
                }
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySchedule;
