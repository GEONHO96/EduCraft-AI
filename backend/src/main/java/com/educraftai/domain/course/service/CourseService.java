package com.educraftai.domain.course.service;

import com.educraftai.domain.course.dto.CourseRequest;
import com.educraftai.domain.course.dto.CourseResponse;
import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.entity.CourseEnrollment;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public CourseResponse.Info createCourse(Long teacherId, CourseRequest.Create request) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Course course = Course.builder()
                .teacher(teacher)
                .title(request.getTitle())
                .subject(request.getSubject())
                .description(request.getDescription())
                .build();

        courseRepository.save(course);
        return CourseResponse.Info.from(course);
    }

    public List<CourseResponse.Info> getMyCourses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getRole() == User.Role.TEACHER) {
            return courseRepository.findByTeacherId(userId).stream()
                    .map(CourseResponse.Info::from)
                    .toList();
        } else {
            return enrollmentRepository.findByStudentId(userId).stream()
                    .map(e -> CourseResponse.Info.from(e.getCourse()))
                    .toList();
        }
    }

    public CourseResponse.Info getCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COURSE_NOT_FOUND));
        return CourseResponse.Info.from(course);
    }

    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COURSE_NOT_FOUND));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (enrollmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new BusinessException(ErrorCode.ALREADY_ENROLLED);
        }

        CourseEnrollment enrollment = CourseEnrollment.builder()
                .course(course)
                .student(student)
                .build();

        enrollmentRepository.save(enrollment);
    }
}
