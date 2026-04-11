package com.educraftai.domain.sns.dto;

import com.educraftai.domain.sns.entity.Post;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class SnsRequest {

    @Getter
    @Setter
    public static class CreatePost {
        @NotBlank(message = "내용을 입력해주세요.")
        private String content;

        private String imageUrl;

        private Post.Category category;
    }

    @Getter
    @Setter
    public static class CreateComment {
        @NotBlank(message = "댓글 내용을 입력해주세요.")
        private String content;
    }
}
