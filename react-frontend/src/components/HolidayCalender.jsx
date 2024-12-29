import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from 'axios'

const HolidayCalender = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const res = await axios.get("https://calendarific.com/api/v2/holidays?api_key=g2pHbYGZcsnsrASC6ld5f7CIrcbSJ25I&country=in&year=2024");

                const formattedEvents = res.data.response.holidays.map((holiday) => ({
                    title: holiday.name,
                    start: holiday.date.iso, 
                    description: holiday.description,
                }));

                setEvents(formattedEvents);

            } catch (error) {
                console.error("Error fetching holiday data:", error);
            }
        };

        fetchHolidays();
    }, []);

    return (
        <div className="flex flex-col items-center p-4 bg-violet-300 min-h-screen">
            <h2 className="text-4xl font-bold mt-4 mb-10 text-center text-gray-800">Holiday Calendar</h2>
            <div className="w-full max-w-7xl h-[80vh] overflow-auto bg-white rounded-lg shadow-lg">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left:'today',
                        center: 'title',
                        right: 'prev next'
                    }}
                    titleFormat={{ year: 'numeric', month: 'long' }}
                />
            </div>
        </div>
    );
};

export default HolidayCalender;
