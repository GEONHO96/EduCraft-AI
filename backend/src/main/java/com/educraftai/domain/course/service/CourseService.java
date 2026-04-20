package com.educraftai.domain.course.service;

import com.educraftai.domain.course.dto.CourseRequest;
import com.educraftai.domain.course.dto.CourseResponse;
import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.entity.CourseEnrollment;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.progress.service.LearningProgressService;
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
 * 강의 비즈니스 로직 서비스.
 * <p>강의 생성·조회·탐색, 수강 신청을 담당한다.
 * 탐색 메서드는 N+1 방지를 위해 배치 쿼리로 수강생 수·수강 여부를 일괄 집계한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final LearningProgressService learningProgressService;

    /** 강의 생성 (선생님 전용) */
    @Transactional
    public CourseResponse.Info createCourse(Long teacherId, CourseRequest.Create request) {
        User teacher = findUser(teacherId);

        Course course = courseRepository.save(Course.builder()
                .teacher(teacher)
                .title(request.getTitle())
                .subject(request.getSubject())
                .description(request.getDescription())
                .build());

        return CourseResponse.Info.from(course);
    }

    /** 내 강의 목록 — 선생님은 개설 강의, 학생은 수강 중 강의 */
    public List<CourseResponse.Info> getMyCourses(Long userId) {
        User user = findUser(userId);

        if (user.getRole() == User.Role.TEACHER) {
            return courseRepository.findByTeacherId(userId).stream()
                    .map(CourseResponse.Info::from)
                    .toList();
        }
        return enrollmentRepository.findByStudentId(userId).stream()
                .map(e -> CourseResponse.Info.from(e.getCourse()))
                .toList();
    }

    /** 강의 탐색 — 키워드가 있으면 제목·과목 검색, 없으면 전체 조회 */
    public List<CourseResponse.Browse> browseCourses(String keyword, Long userId) {
        List<Course> courses = (keyword == null || keyword.isBlank())
                ? courseRepository.findAllByOrderByCreatedAtDesc()
                : courseRepository.findByTitleContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrderByCreatedAtDesc(keyword, keyword);
        return toBrowseList(courses, userId);
    }

    /** 강의 단건 조회 */
    public CourseResponse.Info getCourse(Long courseId) {
        return CourseResponse.Info.from(findCourse(courseId));
    }

    /** 수강 신청 (중복 방지). 등록과 함께 학습 진도 레코드도 초기화한다. */
    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        Course course = findCourse(courseId);
        User student = findUser(studentId);

        if (enrollmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new BusinessException(ErrorCode.ALREADY_ENROLLED);
        }

        CourseEnrollment enrollment = enrollmentRepository.save(CourseEnrollment.builder()
                .course(course)
                .student(student)
                .build());

        // 진도 레코드 즉시 초기화 — 이후 자료 체크·퀴즈 제출이 이 레코드를 갱신한다
        learningProgressService.initializeForEnrollment(enrollment);
    }

    // ─── 내부 헬퍼 ───

    /** 강의 목록을 Browse DTO로 변환 (배치 쿼리로 N+1 방지) */
    private List<CourseResponse.Browse> toBrowseList(List<Course> courses, Long userId) {
        if (courses.isEmpty()) return List.of();

        List<Long> courseIds = courses.stream().map(Course::getId).toList();

        Map<Long, Long> countMap = enrollmentRepository.countGroupByCourseIds(courseIds).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        Set<Long> enrolledIds = userId != null
                ? Set.copyOf(enrollmentRepository.findEnrolledCourseIds(userId, courseIds))
                : Set.of();

        return courses.stream().map(course -> CourseResponse.Browse.from(
                course,
                countMap.getOrDefault(course.getId(), 0L),
                enrolledIds.contains(course.getId())
        )).toList();
    }

    private Course findCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COURSE_NOT_FOUND));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
