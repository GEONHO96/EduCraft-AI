package com.educraftai.domain.sns.entity;

import com.educraftai.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * SNS 게시글 엔티티
 * 카테고리별 게시판 기능을 제공하며, 좋아요/댓글 수를 비정규화하여 관리한다.
 */
@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 작성자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    /** 게시글 본문 */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /** 첨부 이미지 URL (선택) */
    private String imageUrl;

    /** 게시판 카테고리 (기본값: FREE) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Category category = Category.FREE;

    /** 좋아요 수 (비정규화 카운트) */
    @Builder.Default
    private int likeCount = 0;

    /** 댓글 수 (비정규화 카운트) */
    @Builder.Default
    private int commentCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum Category {
        FREE,           // 자유 게시판
        STUDY_TIP,      // 공부 팁
        CLASS_SHARE,    // 수업 공유
        QNA,            // 질문답변
        RESOURCE        // 자료 공유
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        if (this.likeCount > 0) this.likeCount--;
    }

    public void incrementCommentCount() {
        this.commentCount++;
    }

    public void decrementCommentCount() {
        if (this.commentCount > 0) this.commentCount--;
    }
}
