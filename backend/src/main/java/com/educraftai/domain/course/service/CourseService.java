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
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 강의 비즈니스 로직 서비스
 * 강의 생성, 조회, 수강 신청 처리를 담당한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    /** 강의 생성 - 선생님 사용자가 새 강의를 개설 */
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

    /** 내 강의 조회 - 역할에 따라 개설 강의 또는 수강 강의 반환 */
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

    /**
     * 강의 탐색 - 키워드가 있으면 제목·과목 검색, 없으면 전체 조회.
     * N+1 방지 배치 쿼리로 수강생 수·수강 여부를 일괄 집계한다.
     */
    public List<CourseResponse.Browse> browseCourses(String keyword, Long userId) {
        List<Course> courses = (keyword == null || keyword.isBlank())
                ? courseRepository.findAllByOrderByCreatedAtDesc()
                : courseRepository.findByTitleContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrderByCreatedAtDesc(keyword, keyword);
        return toBrowseList(courses, userId);
    }

    /** 강의 목록을 Browse DTO로 변환 (배치 쿼리로 N+1 방지) */
    private List<CourseResponse.Browse> toBrowseList(List<Course> courses, Long userId) {
        if (courses.isEmpty()) return List.of();

        List<Long> courseIds = courses.stream().map(Course::getId).toList();

        // 배치 쿼리로 수강생 수 한 번에 조회
        Map<Long, Long> countMap = enrollmentRepository.countGroupByCourseIds(courseIds).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        // 배치 쿼리로 수강 여부 한 번에 조회
        Set<Long> enrolledIds = userId != null
                ? Set.copyOf(enrollmentRepository.findEnrolledCourseIds(userId, courseIds))
                : Set.of();

        return courses.stream().map(course -> CourseResponse.Browse.from(
                course,
                countMap.getOrDefault(course.getId(), 0L),
                enrolledIds.contains(course.getId())
        )).toList();
    }

    /** 강의 단건 조회 */
    public CourseResponse.Info getCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COURSE_NOT_FOUND));
        return CourseResponse.Info.from(course);
    }

    /** 수강 신청 - 중복 수강 방지 후 등록 */
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
