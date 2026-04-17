package com.educraftai.domain.sns.controller;

import com.educraftai.domain.sns.dto.SnsRequest;
import com.educraftai.domain.sns.dto.SnsResponse;
import com.educraftai.domain.sns.entity.Post;
import com.educraftai.domain.sns.service.SnsService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.CurrentUserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * SNS 기능 API 컨트롤러.
 * <p>게시글 CRUD, 좋아요, 댓글, 팔로우, 프로필 조회를 처리한다.
 */
@RestController
@RequestMapping("/api/sns")
@RequiredArgsConstructor
public class SnsController {

    private final SnsService snsService;

    // ──────── 게시글 ────────

    /** 게시글 작성 */
    @PostMapping("/posts")
    public ApiResponse<SnsResponse.PostInfo> createPost(@CurrentUserId Long userId,
                                                        @Valid @RequestBody SnsRequest.CreatePost request) {
        return ApiResponse.ok(snsService.createPost(userId, request));
    }

    /** 전체 피드 조회 (최신순 페이징) */
    @GetMapping("/posts")
    public ApiResponse<SnsResponse.PostPage> getFeed(@CurrentUserId Long userId,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getFeed(userId, page, size));
    }

    /** 팔로잉 피드 조회 (내가 팔로우한 사용자 + 내 글) */
    @GetMapping("/posts/following")
    public ApiResponse<SnsResponse.PostPage> getFollowingFeed(@CurrentUserId Long userId,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getFollowingFeed(userId, page, size));
    }

    /** 카테고리별 게시글 조회 */
    @GetMapping("/posts/category/{category}")
    public ApiResponse<SnsResponse.PostPage> getPostsByCategory(@CurrentUserId Long userId,
                                                                @PathVariable Post.Category category,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getPostsByCategory(userId, category, page, size));
    }

    /** 게시글 상세 조회 (댓글 포함) */
    @GetMapping("/posts/{postId}")
    public ApiResponse<SnsResponse.PostDetail> getPostDetail(@CurrentUserId Long userId,
                                                             @PathVariable Long postId) {
        return ApiResponse.ok(snsService.getPostDetail(userId, postId));
    }

    /** 게시글 삭제 (작성자만 가능) */
    @DeleteMapping("/posts/{postId}")
    public ApiResponse<Void> deletePost(@CurrentUserId Long userId, @PathVariable Long postId) {
        snsService.deletePost(userId, postId);
        return ApiResponse.ok();
    }

    // ──────── 좋아요 ────────

    /** 좋아요 토글 (추가/취소) */
    @PostMapping("/posts/{postId}/like")
    public ApiResponse<SnsResponse.LikeResult> toggleLike(@CurrentUserId Long userId, @PathVariable Long postId) {
        return ApiResponse.ok(snsService.toggleLike(userId, postId));
    }

    // ──────── 댓글 ────────

    /** 댓글 작성 */
    @PostMapping("/posts/{postId}/comments")
    public ApiResponse<SnsResponse.CommentInfo> addComment(@CurrentUserId Long userId,
                                                           @PathVariable Long postId,
                                                           @Valid @RequestBody SnsRequest.CreateComment request) {
        return ApiResponse.ok(snsService.addComment(userId, postId, request));
    }

    /** 댓글 삭제 (작성자만 가능) */
    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<Void> deleteComment(@CurrentUserId Long userId, @PathVariable Long commentId) {
        snsService.deleteComment(userId, commentId);
        return ApiResponse.ok();
    }

    // ──────── 팔로우 ────────

    /** 팔로우 토글 (팔로우/언팔로우) */
    @PostMapping("/users/{targetUserId}/follow")
    public ApiResponse<SnsResponse.FollowResult> toggleFollow(@CurrentUserId Long userId,
                                                              @PathVariable Long targetUserId) {
        return ApiResponse.ok(snsService.toggleFollow(userId, targetUserId));
    }

    // ──────── 프로필 ────────

    /** 사용자 프로필 조회 (게시글/팔로워/팔로잉 수 포함) */
    @GetMapping("/users/{targetUserId}/profile")
    public ApiResponse<SnsResponse.ProfileInfo> getProfile(@CurrentUserId Long userId,
                                                           @PathVariable Long targetUserId) {
        return ApiResponse.ok(snsService.getProfile(userId, targetUserId));
    }

    /** 특정 사용자의 게시글 목록 조회 */
    @GetMapping("/users/{targetUserId}/posts")
    public ApiResponse<SnsResponse.PostPage> getUserPosts(@CurrentUserId Long userId,
                                                          @PathVariable Long targetUserId,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getUserPosts(userId, targetUserId, page, size));
    }
}
