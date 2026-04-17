package com.educraftai.global.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 모든 엔티티의 공통 타임스탬프 필드를 모아둔 추상 부모 클래스.
 *
 * <p>도입 목적:
 * <ul>
 *   <li>{@code createdAt}/{@code updatedAt} 선언을 엔티티마다 반복하지 않도록 통일</li>
 *   <li>감사(audit) 필드의 일관된 컬럼명·nullable 규칙 강제</li>
 * </ul>
 *
 * <p>사용 예시:
 * <pre>{@code
 * @Entity
 * public class Course extends BaseEntity {
 *     @Id @GeneratedValue ...
 * }
 * }</pre>
 *
 * <p>주의: {@code @MappedSuperclass}이므로 테이블로 매핑되지 않는다.
 * 상속받는 엔티티 각자가 자신의 테이블을 가진다.
 */
@Getter
@MappedSuperclass
public abstract class BaseEntity {

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
