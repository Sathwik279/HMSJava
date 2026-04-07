package com.hms.repository;

import com.hms.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByMode(Doctor.Mode mode);

    List<Doctor> findBySpecialization(Doctor.Specialization specialization);

    @Query("SELECT d FROM Doctor d WHERE d.mode = :mode AND d.specialization = :specialization")
    List<Doctor> findByModeAndSpecialization(@Param("mode") Doctor.Mode mode, @Param("specialization") Doctor.Specialization specialization);

    Optional<Doctor> findByUserId(Long userId);
}