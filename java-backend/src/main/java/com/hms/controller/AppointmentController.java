package com.hms.controller;

import com.hms.model.Appointment;
import com.hms.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public String bookAppointment(@RequestParam Long patientId,
                                  @RequestParam Long doctorId,
                                  @RequestParam String date,
                                  @RequestParam String time) {
        LocalDate localDate = LocalDate.parse(date);
        LocalTime localTime = LocalTime.parse(time);
        return appointmentService.bookAppointment(patientId, doctorId, localDate, localTime);
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointments(@PathVariable Long patientId) {
        return appointmentService.getAppointmentsByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return appointmentService.getAppointmentsByDoctor(doctorId);
    }
}