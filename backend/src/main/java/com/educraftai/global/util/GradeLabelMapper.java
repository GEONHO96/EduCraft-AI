package com.educraftai.global.util;

import java.util.Map;

/**
 * 학년 코드 ↔ 한글 라벨 매핑 유틸.
 *
 * <p>플랫폼 전역에서 학년 코드({@code ELEMENTARY_1}, {@code MIDDLE_2}, {@code HIGH_3} 등)를
 * 사용자 노출용 한글 라벨("초등 1학년", "중등 2학년", "고등 3학년")로 변환하는 단일 진입점.
 *
 * <p>기존에는 {@code DashboardService}와 {@code AiGenerationService}에 각각
 * 유사하지만 라벨 표기가 미세하게 다른 매핑이 중복 정의되어 있었다 ("초등학교 1학년" vs "초등 1학년").
 * 이 유틸로 단일화한다.
 */
public final class GradeLabelMapper {

    private GradeLabelMapper() {
    }

    private static final Map<String, String> GRADE_LABELS = Map.ofEntries(
            Map.entry("ELEMENTARY_1", "초등 1학년"),
            Map.entry("ELEMENTARY_2", "초등 2학년"),
            Map.entry("ELEMENTARY_3", "초등 3학년"),
            Map.entry("ELEMENTARY_4", "초등 4학년"),
            Map.entry("ELEMENTARY_5", "초등 5학년"),
            Map.entry("ELEMENTARY_6", "초등 6학년"),
            Map.entry("MIDDLE_1", "중등 1학년"),
            Map.entry("MIDDLE_2", "중등 2학년"),
            Map.entry("MIDDLE_3", "중등 3학년"),
            Map.entry("HIGH_1", "고등 1학년"),
            Map.entry("HIGH_2", "고등 2학년"),
            Map.entry("HIGH_3", "고등 3학년")
    );

    /**
     * 학년 코드를 한글 라벨로 변환.
     * <p>매핑이 없거나 {@code null}이면 원본 문자열(또는 "기타")을 반환한다.
     */
    public static String toLabel(String gradeCode) {
        if (gradeCode == null || gradeCode.isBlank()) {
            return "기타";
        }
        return GRADE_LABELS.getOrDefault(gradeCode, gradeCode);
    }
}
