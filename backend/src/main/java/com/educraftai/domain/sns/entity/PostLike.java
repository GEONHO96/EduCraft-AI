package com.educraftai.domain.sns.entity;

import com.educraftai.domain.user.entity.User;
import com.educraftai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * 게시글 좋아요 엔티티
 * 사용자당 게시글 하나에 한 번만 좋아요 가능 (유니크 제약조건).
 */
@Entity
@Table(name = "post_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"post_id", "user_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PostLike extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
