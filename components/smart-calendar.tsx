"use client";

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { AuditionData } from '@/types';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface SmartCalendarProps {
  auditions: AuditionData[];
  onSelectEvent?: (event: any) => void;
}

export function SmartCalendar({ auditions, onSelectEvent }: SmartCalendarProps) {
  const events = auditions.map(audition => ({
    id: audition.id,
    title: `${audition.projectTitle} - ${audition.roleName}`,
    start: new Date(audition.auditionDate!),
    end: new Date(audition.auditionDate!),
    resource: audition,
  }));

  return (
    <div className="h-[600px] bg-background">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
      />
    </div>
  );
}