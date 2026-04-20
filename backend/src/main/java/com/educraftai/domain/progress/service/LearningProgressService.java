package com.educraftai.domain.progress.service;

import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.entity.CourseEnrollment;
import com.educraftai.domain.course.repository.CourseEnrollmentRepository;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.material.entity.Material;
import com.educraftai.domain.material.repository.MaterialRepository;
import com.educraftai.domain.progress.dto.LearningProgressResponse;
import com.educraftai.domain.progress.entity.LearningProgress;
import com.educraftai.domain.progress.repository.LearningProgressRepository;
import com.educraftai.domain.quiz.repository.QuizRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 학습 진도 관리 서비스.
 *
 * <p>책임:
 * <ul>
 *   <li>수강 등록 시 초기 진도 레코드 생성 ({@link #initializeForEnrollment})</li>
 *   <li>자료 완료 체크/해제 ({@link #completeMaterial}, {@link #uncompleteMaterial})</li>
 *   <li>진도율 재계산 및 수료 판정 ({@link #recalculate})</li>
 *   <li>학생/교사 조회용 API</li>
 * </ul>
 *
 * <p>수료 조건 만족 시 {@link CertificateService#issueIfEligible}을 호출하여 자동 발급.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearningProgressService {

    private final LearningProgressRepository progressRepository;
    private final CertificateService certificateService;
    private final MaterialRepository materialRepository;
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;

    // ─── 생성 / 초기화 ───

    /**
     * 수강 등록과 동시에 호출. 이미 존재하면 no-op (멱등).
     * 초기 {@code totalMaterialCount}는 현재 코스의 자료 수로 캐시.
     */
    @Transactional
    public LearningProgress initializeForEnrollment(CourseEnrollment enrollment) {
        Long userId = enrollment.getStudent().getId();
        Long courseId = enrollment.getCourse().getId();
        return progressRepository.findByUserIdAndCourseId(userId, courseId).orElseGet(() -> {
            int totalMaterials = (int) materialRepository.countByCourseId(courseId);
            LearningProgress progress = LearningProgress.builder()
                    .userId(userId)
                    .courseId(courseId)
                    .enrollmentId(enrollment.getId())
                    .totalMaterialCount(totalMaterials)
                    .build();
            progress.recalculateProgressRate();
            LearningProgress saved = progressRepository.save(progress);
            log.info("[Progress] 초기 진도 레코드 생성 userId={} courseId={} totalMaterials={}",
                    userId, courseId, totalMaterials);
            return saved;
        });
    }

    // ─── 자료 완료 처리 ───

    /** 자료 완료 체크 (멱등) + 재계산 */
    @Transactional
    public LearningProgressResponse.Info completeMaterial(Long userId, Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MATERIAL_NOT_FOUND));
        Long courseId = material.getCurriculum().getCourse().getId();

        LearningProgress progress = findProgressOrThrowNotEnrolled(userId, courseId);
        if (!progress.markMaterialCompleted(materialId)) {
            throw new BusinessException(ErrorCode.ALREADY_COMPLETED_MATERIAL);
        }

        // 진도율 재계산 + 수료 판정
        refreshTotals(progress, courseId);
        progress.recalculateProgressRate();
        tryCompleteIfEligible(progress, courseId);

        LearningProgress saved = progressRepository.save(progress);
        return LearningProgressResponse.Info.from(saved);
    }

    /** 자료 완료 체크 해제 + 재계산 */
    @Transactional
    public LearningProgressResponse.Info uncompleteMaterial(Long userId, Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MATERIAL_NOT_FOUND));
        Long courseId = material.getCurriculum().getCourse().getId();

        LearningProgress progress = findProgressOrThrowNotEnrolled(userId, courseId);
        progress.unmarkMaterialCompleted(materialId);
        refreshTotals(progress, courseId);
        progress.recalculateProgressRate();

        LearningProgress saved = progressRepository.save(progress);
        return LearningProgressResponse.Info.from(saved);
    }

    // ─── 이벤트 기반 재계산 ───

    /**
     * 퀴즈 제출 후 호출. 평균 점수 업데이트 + 진도율 재계산 + 수료 판정.
     * 레코드가 없으면 (비정상 케이스) no-op — 로그만 남김.
     */
    @Transactional
    public void applyQuizSubmission(Long userId, Long courseId, double scorePercent) {
        progressRepository.findByUserIdAndCourseId(userId, courseId).ifPresentOrElse(
                progress -> {
                    progress.applyQuizResult(scorePercent);
                    refreshTotals(progress, courseId);
                    progress.recalculateProgressRate();
                    tryCompleteIfEligible(progress, courseId);
                    progressRepository.save(progress);
                },
                () -> log.warn("[Progress] 진도 레코드 없음 — 퀴즈 제출 반영 생략 userId={} courseId={}",
                        userId, courseId)
        );
    }

    // ─── 조회 ───

    /** 특정 코스 진도 상세 */
    public LearningProgressResponse.Info getCourseProgress(Long userId, Long courseId) {
        LearningProgress progress = findProgressOrThrowNotEnrolled(userId, courseId);
        return LearningProgressResponse.Info.from(progress);
    }

    /** 내 수강 중 전체 코스 진도 목록 */
    public List<LearningProgressResponse.Summary> getMyProgressList(Long userId) {
        return progressRepository.findByUserIdOrderByLastActivityAtDesc(userId).stream()
                .map(progress -> {
                    Course course = courseRepository.findById(progress.getCourseId()).orElse(null);
                    return LearningProgressResponse.Summary.builder()
                            .courseId(progress.getCourseId())
                            .courseTitle(course != null ? course.getTitle() : "(삭제된 강의)")
                            .subject(course != null ? course.getSubject() : "")
                            .progressRate(progress.getProgressRate())
                            .completedMaterialCount(progress.getCompletedMaterialCount())
                            .totalMaterialCount(progress.getTotalMaterialCount())
                            .lastActivityAt(progress.getLastActivityAt())
                            .completed(progress.getCompletedAt() != null)
                            .build();
                })
                .toList();
    }

    // ─── 내부 헬퍼 ───

    /** 진도 레코드가 없으면 {@link ErrorCode#NOT_ENROLLED_IN_COURSE} */
    private LearningProgress findProgressOrThrowNotEnrolled(Long userId, Long courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_ENROLLED_IN_COURSE));
    }

    /** totalMaterialCount 캐시를 최신 상태로 동기화 (자료 추가/삭제 대비) */
    private void refreshTotals(LearningProgress progress, Long courseId) {
        int currentTotal = (int) materialRepository.countByCourseId(courseId);
        if (currentTotal != progress.getTotalMaterialCount()) {
            progress.setTotalMaterialCount(currentTotal);
        }
    }

    /** 수료 조건 만족 시 completedAt 기록 + Certificate 발급 */
    private void tryCompleteIfEligible(LearningProgress progress, Long courseId) {
        if (progress.getCompletedAt() != null) return; // 이미 수료
        int requiredQuizCount = (int) quizRepository.countByCourseId(courseId);
        if (progress.meetsCompletionRequirements(requiredQuizCount)) {
            progress.markCompleted();
            certificateService.issueIfEligible(progress);
        }
    }
}
