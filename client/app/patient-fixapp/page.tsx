'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Calendar, Card, Spacer, Chip } from '@nextui-org/react';
import { today, getLocalTimeZone, isWeekend } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { CardHeader, CardBody, CardFooter } from '@nextui-org/card';

const PatientAppointmentFixing: React.FC = () => {
  const [appointmentDate, setAppointmentDate] = useState(today(getLocalTimeZone()));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [view, setView] = useState('form');
  const { locale } = useLocale();

  const isLimitedAvailability = isWeekend(appointmentDate, locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitedAvailability) {
      alert('Limited availability of doctors on weekends. Please be patient!');
    } else {
      const doctors = await fetchAvailableDoctors();
      setAvailableDoctors(doctors);
      setView('doctors');
    }
    console.log('Appointment Date:', appointmentDate);
  };

  const fetchAvailableDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctor/getAll/');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  };

  const handleFixAppointment = async (doctorId: string) => {

    const pid=localStorage.getItem('p_id');
    const appointmentData = {
      doc_id: doctorId,
      starttime: `${appointmentDate.toString()}T${startTime}:00Z`,
      endtime: `${appointmentDate.toString()}T${endTime}:00Z`,
      status: 'scheduled',
    };

    try {
      const appid = localStorage.getItem('app_id');
      const response = await fetch(`http://localhost:5000/api/appointments/update/${appid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to fix appointment');
      }

      const data = await response.json();
      console.log('Appointment fixed successfully:', data);
      try {
      const response2 = await fetch('http://localhost:5000/api/appointments/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pat_id: pid,
          doc_id:doctorId,
          startTime: `${appointmentDate.toString()}T${startTime}:00Z`,
          endTime: `${appointmentDate.toString()}T${endTime}:00Z`,
        }),
      });
      if(!response2.ok){
      alert('Appointment fixed successfully. Check your email for confirmation.');
      
      }
      window.location.href = '/patient-app-history';
    }
    catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment. Please try again later.');
    }

    } catch (error) {
      console.error('Error fixing appointment:', error);
      alert('Failed to fix appointment. Please try again later.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Fix Patient Appointment</h1>
      {view === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Calendar
              aria-label="Select Appointment Date"
              value={appointmentDate}
              onChange={setAppointmentDate}
              isInvalid={isLimitedAvailability}
              errorMessage={
                isLimitedAvailability ? 'Warning: Limited availability of doctors on weekends.' : undefined
              }
              required
              variant="bordered"
              color="primary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Available From"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              variant="bordered"
              color="primary"
            />
            <Input
              label="Available To"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              variant="bordered"
              color="primary"
            />
          </div>
          <Button type="submit" color="primary" variant="bordered">Schedule Appointment</Button>
        </form>
      ) : (
        <div className="space-y-4">
          {availableDoctors.map((doctor) => (
            <Card key={doctor._id}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <h4>{doctor.firstName} {doctor.lastName}</h4>
                  <div>
                    <Chip color="primary" variant="bordered" style={{ marginLeft: '0.5rem' }}>
                      {doctor.specialization}
                    </Chip>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p>Specialization: {doctor.specialization}</p>
                <p>Date: {appointmentDate.toString()}</p>
                <p>Contact: {doctor.phone}</p>
                <p>Email: {doctor.email}</p>
              </CardBody>
              <CardFooter>
                <Button onClick={() => handleFixAppointment(doctor._id)} color="primary" variant="bordered">
                  Fix Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Spacer y={1} />
          <Button onClick={() => setView('form')} color="secondary" variant="bordered">Pick Another Date/Time</Button>
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentFixing;