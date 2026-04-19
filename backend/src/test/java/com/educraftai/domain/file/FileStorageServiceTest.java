package com.educraftai.domain.file;

import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * {@link FileStorageService} 단위 테스트.
 * <p>Phase 2 리팩토링으로 FileController에서 이관된 검증·저장·URL 조립 로직을 검증한다.
 * {@link TempDir}를 통해 실제 파일 I/O 테스트를 격리된 임시 디렉토리에서 수행.
 */
@DisplayName("FileStorageService 단위 테스트")
class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() throws IOException {
        fileStorageService = new FileStorageService(tempDir.toString());
        fileStorageService.init();
    }

    @Nested
    @DisplayName("정상 업로드")
    class Success {

        @Test
        @DisplayName("유효한 이미지 파일을 저장하고 /uploads/UUID.ext URL을 반환한다")
        void validImage() {
            MultipartFile file = new MockMultipartFile(
                    "file", "photo.png", "image/png", "fake-image-bytes".getBytes()
            );

            String url = fileStorageService.saveImage(file);

            assertThat(url).startsWith("/uploads/");
            assertThat(url).endsWith(".png");

            // 실제 파일이 저장되었는지 확인
            String savedName = url.substring("/uploads/".length());
            assertThat(Files.exists(tempDir.resolve(savedName))).isTrue();
        }

        @Test
        @DisplayName("확장자 없는 파일도 저장된다 (확장자 없이)")
        void noExtension() {
            MultipartFile file = new MockMultipartFile(
                    "file", "image", "image/jpeg", "jpeg-bytes".getBytes()
            );

            String url = fileStorageService.saveImage(file);

            assertThat(url).startsWith("/uploads/");
            assertThat(Paths.get(url).getFileName().toString()).doesNotContain(".");
        }

        @Test
        @DisplayName("각 파일은 UUID 기반 고유 이름으로 저장되어 충돌하지 않는다")
        void uniqueFileNames() {
            MultipartFile file1 = new MockMultipartFile(
                    "file", "same-name.png", "image/png", "content-a".getBytes()
            );
            MultipartFile file2 = new MockMultipartFile(
                    "file", "same-name.png", "image/png", "content-b".getBytes()
            );

            String url1 = fileStorageService.saveImage(file1);
            String url2 = fileStorageService.saveImage(file2);

            assertThat(url1).isNotEqualTo(url2);
        }
    }

    @Nested
    @DisplayName("검증 실패")
    class ValidationFailure {

        @Test
        @DisplayName("빈 파일은 FILE_EMPTY 예외를 던진다")
        void emptyFile() {
            MultipartFile file = new MockMultipartFile(
                    "file", "empty.png", "image/png", new byte[0]
            );

            assertThatThrownBy(() -> fileStorageService.saveImage(file))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.FILE_EMPTY);
        }

        @Test
        @DisplayName("null 파일은 FILE_EMPTY 예외를 던진다")
        void nullFile() {
            assertThatThrownBy(() -> fileStorageService.saveImage(null))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.FILE_EMPTY);
        }

        @Test
        @DisplayName("이미지가 아닌 MIME 타입은 FILE_INVALID_TYPE 예외를 던진다")
        void nonImage() {
            MultipartFile file = new MockMultipartFile(
                    "file", "doc.pdf", "application/pdf", "pdf-bytes".getBytes()
            );

            assertThatThrownBy(() -> fileStorageService.saveImage(file))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.FILE_INVALID_TYPE);
        }

        @Test
        @DisplayName("Content-Type 누락 파일은 FILE_INVALID_TYPE 예외를 던진다")
        void missingContentType() {
            MultipartFile file = new MockMultipartFile(
                    "file", "noname.bin", null, "bytes".getBytes()
            );

            assertThatThrownBy(() -> fileStorageService.saveImage(file))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.FILE_INVALID_TYPE);
        }

        @Test
        @DisplayName("10MB 초과 파일은 FILE_SIZE_EXCEEDED 예외를 던진다")
        void oversizedFile() {
            // 11MB 바이트 배열
            byte[] oversized = new byte[11 * 1024 * 1024];
            MultipartFile file = new MockMultipartFile(
                    "file", "huge.png", "image/png", oversized
            );

            assertThatThrownBy(() -> fileStorageService.saveImage(file))
                    .isInstanceOf(BusinessException.class)
                    .extracting(e -> ((BusinessException) e).getErrorCode())
                    .isEqualTo(ErrorCode.FILE_SIZE_EXCEEDED);
        }
    }
}
