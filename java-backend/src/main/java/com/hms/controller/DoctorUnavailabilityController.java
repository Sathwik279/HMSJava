package com.hms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.model.DoctorUnavailability;
import com.hms.repository.DoctorUnavailabilityRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/unavailability")
public class DoctorUnavailabilityController {

    @Autowired
    private DoctorUnavailabilityRepository repository;

    @PostMapping
    public DoctorUnavailability addUnavailability(@Valid @RequestBody DoctorUnavailability unavailability) {
        if (unavailability.getEndDate().isBefore(unavailability.getStartDate())) {
            throw new IllegalArgumentException("End date must be the same or after start date");
        }
        return repository.save(unavailability);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<DoctorUnavailability> getUnavailability(@PathVariable Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }
}