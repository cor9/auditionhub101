"use client";

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { AuditionData } from '@/types';
import { cn } from '@/lib/utils';

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

const eventStyleGetter = (event: any) => {
  let backgroundColor = 'bg-primary/20';
  let textColor = 'text-primary';
  
  switch (event.resource.status) {
    case 'PENDING':
      backgroundColor = 'bg-yellow-100 dark:bg-yellow-900';
      textColor = 'text-yellow-800 dark:text-yellow-200';
      break;
    case 'SUBMITTED':
      backgroundColor = 'bg-blue-100 dark:bg-blue-900';
      textColor = 'text-blue-800 dark:text-blue-200';
      break;
    case 'CALLBACK':
      backgroundColor = 'bg-purple-100 dark:bg-purple-900';
      textColor = 'text-purple-800 dark:text-purple-200';
      break;
    case 'BOOKED':
      backgroundColor = 'bg-green-100 dark:bg-green-900';
      textColor = 'text-green-800 dark:text-green-200';
      break;
    case 'RELEASED':
      backgroundColor = 'bg-gray-100 dark:bg-gray-800';
      textColor = 'text-gray-800 dark:text-gray-200';
      break;
  }

  return {
    className: cn(
      'rounded-md border border-transparent p-1',
      backgroundColor,
      textColor
    ),
    style: {
      border: 'none',
      borderRadius: '6px',
      padding: '4px 8px',
    }
  };
};

export function SmartCalendar({ auditions, onSelectEvent }: SmartCalendarProps) {
  const events = auditions.map(audition => ({
    id: audition.id,
    title: `${audition.projectTitle} - ${audition.roleName}`,
    start: new Date(audition.auditionDate!),
    end: new Date(new Date(audition.auditionDate!).getTime() + 60 * 60 * 1000), // 1 hour duration
    resource: audition,
  }));

  return (
    <div className="h-[600px] bg-background rounded-lg border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.MONTH}
        eventPropGetter={eventStyleGetter}
        popup
        selectable
        className="rounded-lg p-4"
      />
    </div>
  );
}