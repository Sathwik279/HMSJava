package com.hms.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.hms.model.Appointment;
import com.hms.model.Doctor;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorService doctorService;

    public String bookAppointment(Long patientId, Long doctorId, LocalDate date, LocalTime time) {
        if (!doctorService.isDoctorAvailable(doctorId, date, time)) {
            throw new RuntimeException("Slot not available");
        }

        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setDate(date);
        appointment.setTime(time);
        appointment.setStatus("confirmed");

        try {
            appointmentRepository.save(appointment);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Slot already booked");
        }

        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        if (doctor.getMode() == Doctor.Mode.ONLINE) {
            return "Appointment on " + date + " has been confirmed.";
        } else {
            return "Your appointment on " + date + " at " + time + " has been scheduled for you at " + doctor.getHospitalAddress() + ".";
        }
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public void cancelAppointment(Long appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }
}