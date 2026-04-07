package com.hms.repository;

import com.hms.model.DoctorUnavailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorUnavailabilityRepository extends JpaRepository<DoctorUnavailability, Long> {

    List<DoctorUnavailability> findByDoctorId(Long doctorId);

    List<DoctorUnavailability> findByDoctorIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Long doctorId, LocalDate date1, LocalDate date2);
}