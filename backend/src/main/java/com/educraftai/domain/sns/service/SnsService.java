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

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    public SnsResponse.PostPage getFeed(Long userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return toPostPage(postPage, userId);
    }

    public SnsResponse.PostPage getFollowingFeed(Long userId, int page, int size) {
        List<Long> followingIds = followRepository.findFollowingIdsByFollowerId(userId);
        followingIds.add(userId); // 내 글도 포함

        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findByAuthorIdInOrderByCreatedAtDesc(followingIds, pageable);
        return toPostPage(postPage, userId);
    }

    public SnsResponse.PostPage getPostsByCategory(Long userId, Post.Category category, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findByCategoryOrderByCreatedAtDesc(category, pageable);
        return toPostPage(postPage, userId);
    }

    public SnsResponse.PostDetail getPostDetail(Long userId, Long postId) {
        Post post = findPost(postId);
        boolean liked = postLikeRepository.existsByPostIdAndUserId(postId, userId);
        List<PostComment> comments = postCommentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        return SnsResponse.PostDetail.from(post, liked, comments);
    }

    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = findPost(postId);
        if (!post.getAuthor().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.SNS_NOT_AUTHOR);
        }
        postRepository.delete(post);
    }

    // ============ 좋아요 ============

    @Transactional
    public SnsResponse.LikeResult toggleLike(Long userId, Long postId) {
        Post post = findPost(postId);
        User user = findUser(userId);

        return postLikeRepository.findByPostIdAndUserId(postId, userId)
                .map(like -> {
                    postLikeRepository.delete(like);
                    post.decrementLikeCount();
                    postRepository.save(post);
                    return SnsResponse.LikeResult.builder()
                            .liked(false)
                            .likeCount(post.getLikeCount())
                            .build();
                })
                .orElseGet(() -> {
                    PostLike like = PostLike.builder()
                            .post(post)
                            .user(user)
                            .build();
                    postLikeRepository.save(like);
                    post.incrementLikeCount();
                    postRepository.save(post);
                    return SnsResponse.LikeResult.builder()
                            .liked(true)
                            .likeCount(post.getLikeCount())
                            .build();
                });
    }

    // ============ 댓글 ============

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
        post.incrementCommentCount();
        postRepository.save(post);

        return SnsResponse.CommentInfo.from(comment);
    }

    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SNS_COMMENT_NOT_FOUND));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.SNS_NOT_AUTHOR);
        }

        Post post = comment.getPost();
        post.decrementCommentCount();
        postRepository.save(post);
        postCommentRepository.delete(comment);
    }

    // ============ 팔로우 ============

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

    public SnsResponse.PostPage getUserPosts(Long currentUserId, Long targetUserId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findByAuthorIdOrderByCreatedAtDesc(targetUserId, pageable);
        return toPostPage(postPage, currentUserId);
    }

    // ============ Helper ============

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
