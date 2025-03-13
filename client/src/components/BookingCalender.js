import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isDateAvailable } from '../utils/dateUtils';
import '../styles/BookingCalendar.css';

const BookingCalendar = ({ availableDates, selectedDate, onDateSelect }) => {
  const handleDateChange = (date) => {
    if (isDateAvailable(date, availableDates)) {
      onDateSelect(date);
    }
  };

  // Custom renderer for day cells in the calendar
  const renderDayContents = (day, date) => {
    const available = isDateAvailable(date, availableDates);
    return (
      <div className={`calendar-day ${available ? 'available' : 'unavailable'}`}>
        {day}
      </div>
    );
  };

  return (
    <div className="booking-calendar">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={new Date()}
        inline
        renderDayContents={renderDayContents}
        filterDate={(date) => isDateAvailable(date, availableDates)}
      />
      {selectedDate && (
        <div className="selected-date-info">
          Selected: {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;