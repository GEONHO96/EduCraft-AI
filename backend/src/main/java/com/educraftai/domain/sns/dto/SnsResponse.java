package com.educraftai.domain.sns.dto;

import com.educraftai.domain.sns.entity.Post;
import com.educraftai.domain.sns.entity.PostComment;
import com.educraftai.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class SnsResponse {

    @Getter
    @Builder
    @AllArgsConstructor
    public static class PostInfo {
        private Long id;
        private AuthorInfo author;
        private String content;
        private String imageUrl;
        private String category;
        private int likeCount;
        private int commentCount;
        private boolean liked;
        private LocalDateTime createdAt;

        public static PostInfo from(Post post, boolean liked) {
            return PostInfo.builder()
                    .id(post.getId())
                    .author(AuthorInfo.from(post.getAuthor()))
                    .content(post.getContent())
                    .imageUrl(post.getImageUrl())
                    .category(post.getCategory().name())
                    .likeCount(post.getLikeCount())
                    .commentCount(post.getCommentCount())
                    .liked(liked)
                    .createdAt(post.getCreatedAt())
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class PostDetail {
        private Long id;
        private AuthorInfo author;
        private String content;
        private String imageUrl;
        private String category;
        private int likeCount;
        private int commentCount;
        private boolean liked;
        private List<CommentInfo> comments;
        private LocalDateTime createdAt;

        public static PostDetail from(Post post, boolean liked, List<PostComment> comments) {
            return PostDetail.builder()
                    .id(post.getId())
                    .author(AuthorInfo.from(post.getAuthor()))
                    .content(post.getContent())
                    .imageUrl(post.getImageUrl())
                    .category(post.getCategory().name())
                    .likeCount(post.getLikeCount())
                    .commentCount(post.getCommentCount())
                    .liked(liked)
                    .comments(comments.stream().map(CommentInfo::from).toList())
                    .createdAt(post.getCreatedAt())
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class CommentInfo {
        private Long id;
        private AuthorInfo author;
        private String content;
        private LocalDateTime createdAt;

        public static CommentInfo from(PostComment comment) {
            return CommentInfo.builder()
                    .id(comment.getId())
                    .author(AuthorInfo.from(comment.getAuthor()))
                    .content(comment.getContent())
                    .createdAt(comment.getCreatedAt())
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class AuthorInfo {
        private Long id;
        private String name;
        private String profileImage;
        private String role;

        public static AuthorInfo from(User user) {
            return AuthorInfo.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .profileImage(user.getProfileImage())
                    .role(user.getRole().name())
                    .build();
        }
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class ProfileInfo {
        private Long id;
        private String name;
        private String profileImage;
        private String role;
        private long postCount;
        private long followerCount;
        private long followingCount;
        private boolean isFollowing;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class PostPage {
        private List<PostInfo> posts;
        private int currentPage;
        private int totalPages;
        private long totalElements;
        private boolean hasNext;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class LikeResult {
        private boolean liked;
        private int likeCount;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class FollowResult {
        private boolean following;
        private long followerCount;
    }
}
