package com.educraftai.domain.sns.entity;

import com.educraftai.domain.user.entity.User;
import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * 팔로우 관계 엔티티
 * 사용자 간 팔로우/팔로잉 관계를 저장한다. (follower -> following)
 */
@Entity
@Table(name = "follows", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"follower_id", "following_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Follow extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private User following;
}
