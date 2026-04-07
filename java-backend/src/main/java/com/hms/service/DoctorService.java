package com.hms.service;

import com.hms.model.Doctor;
import com.hms.model.DoctorUnavailability;
import com.hms.repository.DoctorRepository;
import com.hms.repository.DoctorUnavailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorUnavailabilityRepository unavailabilityRepository;

    public List<Doctor> getDoctorsByFilters(Doctor.Mode mode, Doctor.Specialization specialization) {
        if (mode != null && specialization != null) {
            return doctorRepository.findByModeAndSpecialization(mode, specialization);
        } else if (mode != null) {
            return doctorRepository.findByMode(mode);
        } else if (specialization != null) {
            return doctorRepository.findBySpecialization(specialization);
        } else {
            return doctorRepository.findAll();
        }
    }

    public boolean isDoctorAvailable(Long doctorId, LocalDate date, LocalTime time) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) return false;

        // Check default availability
        if (time.isBefore(doctor.getStartTime()) || !time.isBefore(doctor.getEndTime())) {
            return false;
        }

        // Check unavailability
        List<DoctorUnavailability> unavailabilities = unavailabilityRepository.findByDoctorIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(doctorId, date, date);
        for (DoctorUnavailability u : unavailabilities) {
            if (u.isUnavailable(date, time)) {
                return false;
            }
        }

        return true;
    }
}