package com.educraftai.domain.sns.service;

import com.educraftai.domain.sns.dto.SnsRequest;
import com.educraftai.domain.sns.dto.SnsResponse;
import com.educraftai.domain.sns.entity.Follow;
import com.educraftai.domain.sns.entity.Post;
import com.educraftai.domain.sns.entity.PostComment;
import com.educraftai.domain.sns.entity.PostLike;
import com.educraftai.domain.sns.repository.FollowRepository;
import com.educraftai.domain.sns.repository.PostCommentRepository;
import com.educraftai.domain.sns.repository.PostLikeRepository;
import com.educraftai.domain.sns.repository.PostRepository;
import com.educraftai.domain.user.entity.User;
import com.educraftai.domain.user.repository.UserRepository;
import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * SNS 비즈니스 로직 서비스
 * 게시글, 좋아요, 댓글, 팔로우, 프로필 관련 핵심 로직을 담당한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SnsService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostCommentRepository postCommentRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    // ============ 게시글 ============

    /** 게시글 생성 (카테고리 미지정 시 FREE로 기본값) */
    @Transactional
    public SnsResponse.PostInfo createPost(Long userId, SnsRequest.CreatePost request) {
        User user = findUser(userId);

        Post post = Post.builder()
                .author(user)
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory() != null ? request.getCategory() : Post.Category.FREE)
                .build();

        postRepository.save(post);
        return SnsResponse.PostInfo.from(post, false);
    }

    /** 전체 피드 조회 (최신순) */
    public SnsResponse.PostPage getFeed(Long userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return toPostPage(postPage, userId);
    }

    /** 팔로잉 피드 - 내가 팔로우한 사용자와 내 글만 조회 */
    public SnsResponse.PostPage getFollowingFeed(Long userId, int page, int size) {
        List<Long> followingIds = new ArrayList<>(followRepository.findFollowingIdsByFollowerId(userId));
        followingIds.add(userId); // 내 글도 포함

        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findByAuthorIdInOrderByCreatedAtDesc(followingIds, pageable);
        return toPostPage(postPage, userId);
    }

    /** 카테고리별 게시글 목록 조회 */
    public SnsResponse.PostPage getPostsByCategory(Long userId, Post.Category category, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findByCategoryOrderByCreatedAtDesc(category, pageable);
        return toPostPage(postPage, userId);
    }

    /** 게시글 상세 조회 (좋아요 여부 + 댓글 목록 포함) */
    public SnsResponse.PostDetail getPostDetail(Long userId, Long postId) {
        Post post = findPost(postId);
        boolean liked = postLikeRepository.existsByPostIdAndUserId(postId, userId);
        List<PostComment> comments = postCommentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return SnsResponse.PostDetail.from(post, liked, comments);
    }

    /** 게시글 삭제 (작성자 본인만 가능) */
    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = findPost(postId);
        if (!post.getAuthor().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.SNS_NOT_AUTHOR);
        }
        postRepository.delete(post);
    }

    // ============ 좋아요 ============

    /** 좋아요 토글 - 이미 좋아요했으면 취소, 아니면 추가 (원자적 카운터 업데이트) */
    @Transactional
    public SnsResponse.LikeResult toggleLike(Long userId, Long postId) {
        Post post = findPost(postId);
        User user = findUser(userId);

        boolean alreadyLiked = postLikeRepository.findByPostIdAndUserId(postId, userId).isPresent();

        if (alreadyLiked) {
            postLikeRepository.deleteByPostIdAndUserId(postId, userId);
            postRepository.decrementLikeCount(postId);
        } else {
            PostLike like = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();
            postLikeRepository.save(like);
            postRepository.incrementLikeCount(postId);
        }

        // DB에서 최신 카운트를 다시 조회 (영속성 컨텍스트 캐시 우회)
        postRepository.flush();
        int updatedCount = postRepository.findById(postId)
                .map(Post::getLikeCount).orElse(0);

        return SnsResponse.LikeResult.builder()
                .liked(!alreadyLiked)
                .likeCount(updatedCount)
                .build();
    }

    // ============ 댓글 ============

    /** 댓글 작성 및 게시글 댓글 수 증가 */
    @Transactional
    public SnsResponse.CommentInfo addComment(Long userId, Long postId, SnsRequest.CreateComment request) {
        Post post = findPost(postId);
        User user = findUser(userId);

        PostComment comment = PostComment.builder()
                .post(post)
                .author(user)
                .content(request.getContent())
                .build();

        postCommentRepository.save(comment);
        postRepository.incrementCommentCount(postId);

        return SnsResponse.CommentInfo.from(comment);
    }

    /** 댓글 삭제 (작성자 본인만 가능) 및 게시글 댓글 수 감소 */
    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SNS_COMMENT_NOT_FOUND));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.SNS_NOT_AUTHOR);
        }

        Long commentPostId = comment.getPost().getId();
        postCommentRepository.delete(comment);
        postRepository.decrementCommentCount(commentPostId);
    }

    // ============ 팔로우 ============

    /** 팔로우 토글 - 이미 팔로우 중이면 언팔로우, 아니면 팔로우 (자기 자신 불가) */
    @Transactional
    public SnsResponse.FollowResult toggleFollow(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new BusinessException(ErrorCode.SNS_CANNOT_FOLLOW_SELF);
        }

        User following = findUser(followingId);

        return followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                .map(follow -> {
                    followRepository.delete(follow);
                    long count = followRepository.countByFollowingId(followingId);
                    return SnsResponse.FollowResult.builder()
                            .following(false)
                            .followerCount(count)
                            .build();
                })
                .orElseGet(() -> {
                    User follower = findUser(followerId);
                    Follow follow = Follow.builder()
                            .follower(follower)
                            .following(following)
                            .build();
                    followRepository.save(follow);
                    long count = followRepository.countByFollowingId(followingId);
                    return SnsResponse.FollowResult.builder()
                            .following(true)
                            .followerCount(count)
                            .build();
                });
    }

    // ============ 프로필 ============

    /** 사용자 프로필 조회 (게시글/팔로워/팔로잉 수 및 팔로우 여부) */
    public SnsResponse.ProfileInfo getProfile(Long currentUserId, Long targetUserId) {
        User user = findUser(targetUserId);
        long postCount = postRepository.countByAuthorId(targetUserId);
        long followerCount = followRepository.countByFollowingId(targetUserId);
        long followingCount = followRepository.countByFollowerId(targetUserId);
        boolean isFollowing = !currentUserId.equals(targetUserId)
                && followRepository.existsByFollowerIdAndFollowingId(currentUserId, targetUserId);

        return SnsResponse.ProfileInfo.builder()
                .id(user.getId())
                .name(user.getName())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .postCount(postCount)
                .followerCount(followerCount)
                .followingCount(followingCount)
                .isFollowing(isFollowing)
                .build();
    }

    /** 특정 사용자의 게시글 목록 페이징 조회 */
    public SnsResponse.PostPage getUserPosts(Long currentUserId, Long targetUserId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findByAuthorIdOrderByCreatedAtDesc(targetUserId, pageable);
        return toPostPage(postPage, currentUserId);
    }

    // ============ Helper ============

    /** Post 페이지를 PostPage DTO로 변환 (좋아요 여부 일괄 조회) */
    private SnsResponse.PostPage toPostPage(Page<Post> postPage, Long userId) {
        List<Long> postIds = postPage.getContent().stream().map(Post::getId).toList();
        Set<Long> likedPostIds = postIds.isEmpty()
                ? Collections.emptySet()
                : postLikeRepository.findLikedPostIdsByUserIdAndPostIdIn(userId, postIds)
                .stream().collect(Collectors.toSet());

        List<SnsResponse.PostInfo> posts = postPage.getContent().stream()
                .map(post -> SnsResponse.PostInfo.from(post, likedPostIds.contains(post.getId())))
                .toList();

        return SnsResponse.PostPage.builder()
                .posts(posts)
                .currentPage(postPage.getNumber())
                .totalPages(postPage.getTotalPages())
                .totalElements(postPage.getTotalElements())
                .hasNext(postPage.hasNext())
                .build();
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private Post findPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SNS_POST_NOT_FOUND));
    }
}
