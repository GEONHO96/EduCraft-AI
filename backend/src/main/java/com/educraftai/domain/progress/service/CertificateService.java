package com.educraftai.domain.progress.service;

import com.educraftai.domain.course.entity.Course;
import com.educraftai.domain.course.repository.CourseRepository;
import com.educraftai.domain.progress.dto.CertificateResponse;
import com.educraftai.domain.progress.entity.Certificate;
import com.educraftai.domain.progress.entity.LearningProgress;
import com.educraftai.domain.progress.repository.CertificateRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 수료증 발급·조회 서비스.
 *
 * <p>발급은 {@link LearningProgressService}가 수료 조건 만족 시 자동 호출하며,
 * 이미 발급된 사용자·코스 조합에 대해서는 중복 발급을 방지한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    /**
     * 수료 조건을 만족한 진도에 대해 수료증을 자동 발급한다.
     *
     * <p>이미 발급되었거나 조건을 만족하지 않으면 예외 없이 no-op.
     * 동시성 레이스(중복 호출) 상황에서도 유니크 제약 {@code (user_id, course_id)}에 의해 한 건만 저장.
     *
     * @return 신규 발급된 Certificate, 이미 있거나 조건 미달이면 {@code null}
     */
    @Transactional
    public Certificate issueIfEligible(LearningProgress progress) {
        if (progress.getCompletedAt() == null) {
            return null; // 수료 조건 미달
        }
        if (certificateRepository.existsByUserIdAndCourseId(progress.getUserId(), progress.getCourseId())) {
            return null; // 이미 발급됨
        }

        User user = userRepository.findById(progress.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Course course = courseRepository.findById(progress.getCourseId())
                .orElseThrow(() -> new BusinessException(ErrorCode.COURSE_NOT_FOUND));

        Certificate certificate = Certificate.builder()
                .userId(user.getId())
                .courseId(course.getId())
                .certificateNumber(Certificate.buildCertificateNumber(course.getId(), user.getId()))
                .issuedAt(LocalDateTime.now())
                .finalScore(progress.getProgressRate())
                .studentName(user.getNickname() != null && !user.getNickname().isBlank()
                        ? user.getNickname() : user.getName())
                .courseTitle(course.getTitle())
                .build();

        Certificate saved = certificateRepository.save(certificate);
        log.info("[Certificate] 발급 완료 userId={} courseId={} number={}",
                user.getId(), course.getId(), saved.getCertificateNumber());
        return saved;
    }

    /** 내 수료증 목록 */
    public List<CertificateResponse.Info> getMyCertificates(Long userId) {
        return certificateRepository.findByUserIdOrderByIssuedAtDesc(userId).stream()
                .map(CertificateResponse.Info::from)
                .toList();
    }

    /** 수료증 번호로 단건 조회 (소유자 검증 포함) */
    public CertificateResponse.Info getByCertificateNumber(Long userId, String certificateNumber) {
        Certificate certificate = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATE_NOT_FOUND));
        if (!certificate.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.CERTIFICATE_NOT_FOUND);
        }
        return CertificateResponse.Info.from(certificate);
    }
}
