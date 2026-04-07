package com.hms.controller;

import com.hms.model.Doctor;
import com.hms.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<Doctor> getDoctors(@RequestParam(required = false) Doctor.Mode mode,
                                   @RequestParam(required = false) Doctor.Specialization specialization) {
        return doctorService.getDoctorsByFilters(mode, specialization);
    }
}