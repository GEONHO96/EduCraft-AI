package com.educraftai.domain.sns.repository;

import com.educraftai.domain.sns.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);

    boolean existsByPostIdAndUserId(Long postId, Long userId);

    /** 좋아요 삭제 (postId + userId 기반) */
    @Modifying
    @Query("DELETE FROM PostLike pl WHERE pl.post.id = :postId AND pl.user.id = :userId")
    void deleteByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);

    @Query("SELECT pl.post.id FROM PostLike pl WHERE pl.user.id = :userId AND pl.post.id IN :postIds")
    List<Long> findLikedPostIdsByUserIdAndPostIdIn(@Param("userId") Long userId, @Param("postIds") List<Long> postIds);
}
