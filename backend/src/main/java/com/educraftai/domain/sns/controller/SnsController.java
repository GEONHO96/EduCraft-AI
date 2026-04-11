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

@RestController
@RequestMapping("/api/sns")
@RequiredArgsConstructor
public class SnsController {

    private final SnsService snsService;

    // ============ 게시글 ============

    @PostMapping("/posts")
    public ApiResponse<SnsResponse.PostInfo> createPost(@Valid @RequestBody SnsRequest.CreatePost request) {
        return ApiResponse.ok(snsService.createPost(AuthUtil.getCurrentUserId(), request));
    }

    @GetMapping("/posts")
    public ApiResponse<SnsResponse.PostPage> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getFeed(AuthUtil.getCurrentUserId(), page, size));
    }

    @GetMapping("/posts/following")
    public ApiResponse<SnsResponse.PostPage> getFollowingFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getFollowingFeed(AuthUtil.getCurrentUserId(), page, size));
    }

    @GetMapping("/posts/category/{category}")
    public ApiResponse<SnsResponse.PostPage> getPostsByCategory(
            @PathVariable Post.Category category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getPostsByCategory(AuthUtil.getCurrentUserId(), category, page, size));
    }

    @GetMapping("/posts/{postId}")
    public ApiResponse<SnsResponse.PostDetail> getPostDetail(@PathVariable Long postId) {
        return ApiResponse.ok(snsService.getPostDetail(AuthUtil.getCurrentUserId(), postId));
    }

    @DeleteMapping("/posts/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable Long postId) {
        snsService.deletePost(AuthUtil.getCurrentUserId(), postId);
        return ApiResponse.ok();
    }

    // ============ 좋아요 ============

    @PostMapping("/posts/{postId}/like")
    public ApiResponse<SnsResponse.LikeResult> toggleLike(@PathVariable Long postId) {
        return ApiResponse.ok(snsService.toggleLike(AuthUtil.getCurrentUserId(), postId));
    }

    // ============ 댓글 ============

    @PostMapping("/posts/{postId}/comments")
    public ApiResponse<SnsResponse.CommentInfo> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody SnsRequest.CreateComment request) {
        return ApiResponse.ok(snsService.addComment(AuthUtil.getCurrentUserId(), postId, request));
    }

    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable Long commentId) {
        snsService.deleteComment(AuthUtil.getCurrentUserId(), commentId);
        return ApiResponse.ok();
    }

    // ============ 팔로우 ============

    @PostMapping("/users/{userId}/follow")
    public ApiResponse<SnsResponse.FollowResult> toggleFollow(@PathVariable Long userId) {
        return ApiResponse.ok(snsService.toggleFollow(AuthUtil.getCurrentUserId(), userId));
    }

    // ============ 프로필 ============

    @GetMapping("/users/{userId}/profile")
    public ApiResponse<SnsResponse.ProfileInfo> getProfile(@PathVariable Long userId) {
        return ApiResponse.ok(snsService.getProfile(AuthUtil.getCurrentUserId(), userId));
    }

    @GetMapping("/users/{userId}/posts")
    public ApiResponse<SnsResponse.PostPage> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(snsService.getUserPosts(AuthUtil.getCurrentUserId(), userId, page, size));
    }
}
