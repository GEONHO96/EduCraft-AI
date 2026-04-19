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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SnsService 단위 테스트")
class SnsServiceTest {

    @InjectMocks private SnsService snsService;
    @Mock private PostRepository postRepository;
    @Mock private PostLikeRepository postLikeRepository;
    @Mock private PostCommentRepository postCommentRepository;
    @Mock private FollowRepository followRepository;
    @Mock private UserRepository userRepository;

    private User user1;
    private User user2;
    private Post post;

    @BeforeEach
    void setUp() throws Exception {
        user1 = User.builder().email("user1@edu.com").name("유저1").role(User.Role.STUDENT).build();
        setId(user1, 1L);
        user2 = User.builder().email("user2@edu.com").name("유저2").role(User.Role.STUDENT).build();
        setId(user2, 2L);
        post = Post.builder().author(user1).content("테스트 게시글").category(Post.Category.FREE).build();
        setId(post, 100L);
    }

    private void setId(Object obj, Long id) throws Exception {
        var field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(obj, id);
    }

    @Nested
    @DisplayName("게시글")
    class Posts {

        @Test
        @DisplayName("게시글을 정상 생성한다")
        void createPost_success() {
            SnsRequest.CreatePost request = new SnsRequest.CreatePost();
            request.setContent("안녕하세요!");
            request.setCategory(Post.Category.STUDY_TIP);

            given(userRepository.findById(1L)).willReturn(Optional.of(user1));
            given(postRepository.save(any(Post.class))).willAnswer(inv -> inv.getArgument(0));

            SnsResponse.PostInfo result = snsService.createPost(1L, request);

            assertThat(result).isNotNull();
            then(postRepository).should().save(any(Post.class));
        }

        @Test
        @DisplayName("카테고리 미지정 시 FREE로 기본값 설정된다")
        void createPost_defaultCategory() {
            SnsRequest.CreatePost request = new SnsRequest.CreatePost();
            request.setContent("기본 카테고리 게시글");
            request.setCategory(null);

            given(userRepository.findById(1L)).willReturn(Optional.of(user1));
            given(postRepository.save(any(Post.class))).willAnswer(inv -> {
                Post saved = inv.getArgument(0);
                assertThat(saved.getCategory()).isEqualTo(Post.Category.FREE);
                return saved;
            });

            snsService.createPost(1L, request);
        }

        @Test
        @DisplayName("전체 피드를 페이징 조회한다")
        void getFeed_returnsPaginatedPosts() {
            Page<Post> page = new PageImpl<>(List.of(post));
            given(postRepository.findAllByOrderByCreatedAtDesc(any(Pageable.class))).willReturn(page);
            given(postLikeRepository.findLikedPostIdsByUserIdAndPostIdIn(anyLong(), anyList())).willReturn(List.of());

            SnsResponse.PostPage result = snsService.getFeed(1L, 0, 10);

            assertThat(result.getPosts()).hasSize(1);
            assertThat(result.getTotalElements()).isEqualTo(1);
        }

        @Test
        @DisplayName("작성자가 자신의 게시글을 삭제한다")
        void deletePost_success() {
            given(postRepository.findById(100L)).willReturn(Optional.of(post));

            snsService.deletePost(1L, 100L);

            then(postRepository).should().delete(post);
        }

        @Test
        @DisplayName("작성자가 아닌 사용자가 삭제 시 예외를 던진다")
        void deletePost_notAuthor_throwsException() {
            given(postRepository.findById(100L)).willReturn(Optional.of(post));

            assertThatThrownBy(() -> snsService.deletePost(2L, 100L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.SNS_NOT_AUTHOR);
        }
    }

    @Nested
    @DisplayName("좋아요")
    class Likes {

        /**
         * 서비스는 {@code postRepository.incrementLikeCount(postId)} 같은 원자적 DB 업데이트를 수행하고,
         * 그 직후 {@code postRepository.flush()} + {@code findById(postId)}로 최신 카운트를 재조회한다.
         * 테스트에서는 증감 호출을 검증만 하고, 두 번째 조회 시 업데이트된 상태의 Post를 반환하도록 준비한다.
         */
        @Test
        @DisplayName("좋아요 추가 시 liked=true와 증가된 카운트를 반환한다")
        void toggleLike_add() {
            Post likedPost = Post.builder().author(user1).content("테스트 게시글").category(Post.Category.FREE).build();
            likedPost.incrementLikeCount(); // 서비스의 DB 업데이트 결과를 시뮬레이션

            given(postRepository.findById(100L))
                    .willReturn(Optional.of(post))      // 첫 번째 조회 (findPost)
                    .willReturn(Optional.of(likedPost)); // 두 번째 조회 (flush 후 재조회)
            given(userRepository.findById(2L)).willReturn(Optional.of(user2));
            given(postLikeRepository.findByPostIdAndUserId(100L, 2L)).willReturn(Optional.empty());
            given(postLikeRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

            SnsResponse.LikeResult result = snsService.toggleLike(2L, 100L);

            assertThat(result.isLiked()).isTrue();
            assertThat(result.getLikeCount()).isEqualTo(1);
            then(postRepository).should().incrementLikeCount(100L);
        }

        @Test
        @DisplayName("좋아요 취소 시 liked=false와 감소된 카운트를 반환한다")
        void toggleLike_remove() {
            PostLike existingLike = PostLike.builder().post(post).user(user2).build();
            Post unlikedPost = Post.builder().author(user1).content("테스트 게시글").category(Post.Category.FREE).build();
            // 서비스가 decrementLikeCount를 호출해 0이 된 상태 시뮬레이션 (초기값 0 유지)

            given(postRepository.findById(100L))
                    .willReturn(Optional.of(post))        // 첫 번째 조회
                    .willReturn(Optional.of(unlikedPost)); // 두 번째 조회
            given(userRepository.findById(2L)).willReturn(Optional.of(user2));
            given(postLikeRepository.findByPostIdAndUserId(100L, 2L)).willReturn(Optional.of(existingLike));

            SnsResponse.LikeResult result = snsService.toggleLike(2L, 100L);

            assertThat(result.isLiked()).isFalse();
            assertThat(result.getLikeCount()).isEqualTo(0);
            then(postLikeRepository).should().deleteByPostIdAndUserId(100L, 2L);
            then(postRepository).should().decrementLikeCount(100L);
        }
    }

    @Nested
    @DisplayName("댓글")
    class Comments {

        /**
         * 서비스는 in-memory 엔티티를 수정하지 않고 {@code postRepository.incrementCommentCount(postId)}
         * 원자적 SQL 업데이트를 사용한다. 따라서 카운트는 직접 검증하지 않고 해당 리포지토리 호출을 검증한다.
         */
        @Test
        @DisplayName("댓글을 정상 작성하고 게시글의 댓글 수 증가 쿼리를 호출한다")
        void addComment_success() {
            SnsRequest.CreateComment request = new SnsRequest.CreateComment();
            request.setContent("좋은 글이네요!");

            given(postRepository.findById(100L)).willReturn(Optional.of(post));
            given(userRepository.findById(2L)).willReturn(Optional.of(user2));
            given(postCommentRepository.save(any(PostComment.class))).willAnswer(inv -> inv.getArgument(0));

            SnsResponse.CommentInfo result = snsService.addComment(2L, 100L, request);

            assertThat(result).isNotNull();
            assertThat(result.getContent()).isEqualTo("좋은 글이네요!");
            then(postCommentRepository).should().save(any(PostComment.class));
            then(postRepository).should().incrementCommentCount(100L);
        }

        @Test
        @DisplayName("작성자가 아닌 사용자가 댓글 삭제 시 예외를 던진다")
        void deleteComment_notAuthor_throwsException() throws Exception {
            PostComment comment = PostComment.builder().post(post).author(user1).content("댓글").build();
            setId(comment, 50L);

            given(postCommentRepository.findById(50L)).willReturn(Optional.of(comment));

            assertThatThrownBy(() -> snsService.deleteComment(2L, 50L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.SNS_NOT_AUTHOR);
        }
    }

    @Nested
    @DisplayName("팔로우")
    class Follows {

        @Test
        @DisplayName("팔로우를 정상 추가한다")
        void toggleFollow_follow() {
            given(userRepository.findById(2L)).willReturn(Optional.of(user2));
            given(userRepository.findById(1L)).willReturn(Optional.of(user1));
            given(followRepository.findByFollowerIdAndFollowingId(1L, 2L)).willReturn(Optional.empty());
            given(followRepository.save(any(Follow.class))).willAnswer(inv -> inv.getArgument(0));
            given(followRepository.countByFollowingId(2L)).willReturn(1L);

            SnsResponse.FollowResult result = snsService.toggleFollow(1L, 2L);

            assertThat(result.isFollowing()).isTrue();
            assertThat(result.getFollowerCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("언팔로우를 정상 처리한다")
        void toggleFollow_unfollow() {
            Follow existingFollow = Follow.builder().follower(user1).following(user2).build();
            given(userRepository.findById(2L)).willReturn(Optional.of(user2));
            given(followRepository.findByFollowerIdAndFollowingId(1L, 2L)).willReturn(Optional.of(existingFollow));
            given(followRepository.countByFollowingId(2L)).willReturn(0L);

            SnsResponse.FollowResult result = snsService.toggleFollow(1L, 2L);

            assertThat(result.isFollowing()).isFalse();
            assertThat(result.getFollowerCount()).isEqualTo(0);
            then(followRepository).should().delete(existingFollow);
        }

        @Test
        @DisplayName("자기 자신을 팔로우 시 예외를 던진다")
        void toggleFollow_self_throwsException() {
            assertThatThrownBy(() -> snsService.toggleFollow(1L, 1L))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.SNS_CANNOT_FOLLOW_SELF);
        }
    }

    @Test
    @DisplayName("프로필 조회 시 정확한 통계를 반환한다")
    void getProfile_success() {
        given(userRepository.findById(2L)).willReturn(Optional.of(user2));
        given(postRepository.countByAuthorId(2L)).willReturn(5L);
        given(followRepository.countByFollowingId(2L)).willReturn(10L);
        given(followRepository.countByFollowerId(2L)).willReturn(3L);
        given(followRepository.existsByFollowerIdAndFollowingId(1L, 2L)).willReturn(true);

        SnsResponse.ProfileInfo result = snsService.getProfile(1L, 2L);

        assertThat(result.getName()).isEqualTo("유저2");
        assertThat(result.getPostCount()).isEqualTo(5);
        assertThat(result.getFollowerCount()).isEqualTo(10);
        assertThat(result.getFollowingCount()).isEqualTo(3);
        assertThat(result.isFollowing()).isTrue();
    }
}
