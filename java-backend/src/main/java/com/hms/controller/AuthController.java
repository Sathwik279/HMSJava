package com.hms.controller;

import java.time.LocalTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.LoginRequest;
import com.hms.dto.SignupRequest;
import com.hms.model.Doctor;
import com.hms.model.Patient;
import com.hms.model.User;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthController {

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (request.getRole() == null || request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required credentials"));
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(PASSWORD_ENCODER.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRepository.save(user);

        if ("doctor".equals(request.getRole())) {
            Doctor doctor = new Doctor();
            doctor.setUserId(user.getId());
            doctor.setName(request.getName());
            try {
                doctor.setSpecialization(Doctor.Specialization.valueOf(request.getSpecialization()));
                doctor.setMode(Doctor.Mode.valueOf(request.getMode()));
                doctor.setStartTime(LocalTime.parse(request.getStartTime()));
                doctor.setEndTime(LocalTime.parse(request.getEndTime()));
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid doctor signup values"));
            }
            doctor.setHospitalName(request.getHospitalName());
            doctor.setHospitalAddress(request.getHospitalAddress());
            doctor.setDoctorCode(request.getUsername());
            doctorRepository.save(doctor);
        } else if ("patient".equals(request.getRole())) {
            Patient patient = new Patient();
            patient.setUserId(user.getId());
            patient.setUsername(request.getUsername());
            patient.setName(request.getName());
            patient.setPhone(request.getPhone());
            try {
                patient.setAge(Integer.parseInt(request.getAge()));
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid age"));
            }
            patientRepository.save(patient);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
        }

        return ResponseEntity.ok(Map.of("message", "Signup successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent() && PASSWORD_ENCODER.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            User user = userOpt.get();
            
            // Validate requested role matches the user's role
            if (request.getRole() != null && !request.getRole().equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("error", "Incorrect role for this account"));
            }

            Long profileId = null;
            if ("doctor".equals(user.getRole())) {
                profileId = doctorRepository.findByUserId(user.getId()).map(Doctor::getId).orElse(null);
            } else if ("patient".equals(user.getRole())) {
                profileId = patientRepository.findByUserId(user.getId()).map(Patient::getId).orElse(null);
            }

            return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "profileId", profileId != null ? profileId : user.getId(),
                "role", user.getRole(),
                "username", user.getUsername()
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
    }
}