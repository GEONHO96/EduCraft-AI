package com.educraftai.domain.sns.repository;

import com.educraftai.domain.sns.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Post> findByCategoryOrderByCreatedAtDesc(Post.Category category, Pageable pageable);

    Page<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.author.id IN :authorIds ORDER BY p.createdAt DESC")
    Page<Post> findByAuthorIdInOrderByCreatedAtDesc(@Param("authorIds") List<Long> authorIds, Pageable pageable);

    long countByAuthorId(Long authorId);

    /**
     * 좋아요 수 원자적 증가 (동시성 안전).
     * <p>{@code clearAutomatically=true}로 영속성 컨텍스트 캐시를 비워
     * 직후 {@code findById} 호출이 업데이트된 값을 반환하도록 한다.
     */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Post p SET p.likeCount = p.likeCount + 1 WHERE p.id = :postId")
    void incrementLikeCount(@Param("postId") Long postId);

    /** 좋아요 수 원자적 감소 (0 미만 방지) */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Post p SET p.likeCount = p.likeCount - 1 WHERE p.id = :postId AND p.likeCount > 0")
    void decrementLikeCount(@Param("postId") Long postId);

    /** 댓글 수 원자적 증가 */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Post p SET p.commentCount = p.commentCount + 1 WHERE p.id = :postId")
    void incrementCommentCount(@Param("postId") Long postId);

    /** 댓글 수 원자적 감소 (0 미만 방지) */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Post p SET p.commentCount = p.commentCount - 1 WHERE p.id = :postId AND p.commentCount > 0")
    void decrementCommentCount(@Param("postId") Long postId);
}
