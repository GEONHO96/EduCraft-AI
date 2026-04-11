package com.educraftai.domain.sns.controller;

import com.educraftai.domain.sns.dto.SnsRequest;
import com.educraftai.domain.sns.dto.SnsResponse;
import com.educraftai.domain.sns.entity.Post;
import com.educraftai.domain.sns.service.SnsService;
import com.educraftai.global.common.ApiResponse;
import com.educraftai.global.security.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * SNS 기능 API 컨트롤러
 * 게시글 CRUD, 좋아요, 댓글, 팔로우, 프로필 조회를 처리한다.
 */
@RestController
@RequestMapping("/api/sns")
@RequiredArgsConstructor
public class SnsController {

    private final SnsService snsService;

    // ============ 게시글 ============

    /** 게시글 작성 */
    @PostMapping("/posts")
    public ApiResponse<SnsResponse.PostInfo> createPost(@Valid @RequestBody SnsRequest.CreatePost request) {
        return ApiResponse.ok(snsService.createPost(AuthUtil.getCurrentUserId(), request));
    }

    /** 전체 피드 조회 (최신순 페이징) */
    @GetMapping("/posts")
    public ApiResponse<SnsResponse.PostPage> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getFeed(AuthUtil.getCurrentUserId(), page, size));
    }

    /** 팔로잉 피드 조회 (내가 팔로우한 사용자 + 내 글) */
    @GetMapping("/posts/following")
    public ApiResponse<SnsResponse.PostPage> getFollowingFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getFollowingFeed(AuthUtil.getCurrentUserId(), page, size));
    }

    /** 카테고리별 게시글 조회 */
    @GetMapping("/posts/category/{category}")
    public ApiResponse<SnsResponse.PostPage> getPostsByCategory(
            @PathVariable Post.Category category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getPostsByCategory(AuthUtil.getCurrentUserId(), category, page, size));
    }

    /** 게시글 상세 조회 (댓글 포함) */
    @GetMapping("/posts/{postId}")
    public ApiResponse<SnsResponse.PostDetail> getPostDetail(@PathVariable Long postId) {
        return ApiResponse.ok(snsService.getPostDetail(AuthUtil.getCurrentUserId(), postId));
    }

    /** 게시글 삭제 (작성자만 가능) */
    @DeleteMapping("/posts/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable Long postId) {
        snsService.deletePost(AuthUtil.getCurrentUserId(), postId);
        return ApiResponse.ok();
    }

    // ============ 좋아요 ============

    /** 좋아요 토글 (좋아요/취소) */
    @PostMapping("/posts/{postId}/like")
    public ApiResponse<SnsResponse.LikeResult> toggleLike(@PathVariable Long postId) {
        return ApiResponse.ok(snsService.toggleLike(AuthUtil.getCurrentUserId(), postId));
    }

    // ============ 댓글 ============

    /** 댓글 작성 */
    @PostMapping("/posts/{postId}/comments")
    public ApiResponse<SnsResponse.CommentInfo> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody SnsRequest.CreateComment request) {
        return ApiResponse.ok(snsService.addComment(AuthUtil.getCurrentUserId(), postId, request));
    }

    /** 댓글 삭제 (작성자만 가능) */
    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable Long commentId) {
        snsService.deleteComment(AuthUtil.getCurrentUserId(), commentId);
        return ApiResponse.ok();
    }

    // ============ 팔로우 ============

    /** 팔로우 토글 (팔로우/언팔로우) */
    @PostMapping("/users/{userId}/follow")
    public ApiResponse<SnsResponse.FollowResult> toggleFollow(@PathVariable Long userId) {
        return ApiResponse.ok(snsService.toggleFollow(AuthUtil.getCurrentUserId(), userId));
    }

    // ============ 프로필 ============

    /** 사용자 프로필 조회 (게시글/팔로워/팔로잉 수 포함) */
    @GetMapping("/users/{userId}/profile")
    public ApiResponse<SnsResponse.ProfileInfo> getProfile(@PathVariable Long userId) {
        return ApiResponse.ok(snsService.getProfile(AuthUtil.getCurrentUserId(), userId));
    }

    /** 특정 사용자의 게시글 목록 조회 */
    @GetMapping("/users/{userId}/posts")
    public ApiResponse<SnsResponse.PostPage> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getUserPosts(AuthUtil.getCurrentUserId(), userId, page, size));
    }
}
