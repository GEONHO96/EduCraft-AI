package com.educraftai.domain.file;

import com.educraftai.global.exception.BusinessException;
import com.educraftai.global.exception.ErrorCode;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 업로드 파일 저장 서비스.
 *
 * <p>파일 유효성 검사(빈 파일/MIME/크기) 후 UUID 기반 파일명으로 디스크에 저장하고,
 * 공개 접근 URL({@code /uploads/...})을 반환한다.
 *
 * <p>이전에는 {@code FileController}가 검증 · I/O · URL 조립을 모두 수행했으나
 * 컨트롤러 책임을 벗어나 이 서비스로 이관했다. 예외는 {@link BusinessException} +
 * {@link ErrorCode}로 통일되어 {@link com.educraftai.global.exception.GlobalExceptionHandler}가 처리한다.
 */
@Slf4j
@Service
public class FileStorageService {

    /** 이미지 최대 업로드 크기 (10MB) */
    private static final long MAX_IMAGE_SIZE = 10L * 1024 * 1024;

    private final Path resolvedUploadPath;

    public FileStorageService(@Value("${file.upload-dir:./uploads}") String uploadDir) {
        this.resolvedUploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() throws IOException {
        if (!Files.exists(resolvedUploadPath)) {
            Files.createDirectories(resolvedUploadPath);
        }
        log.info("[File] 저장 경로: {}", resolvedUploadPath);
    }

    /**
     * 이미지 파일을 저장하고 공개 URL을 반환한다.
     *
     * @return 정적 리소스 URL (예: {@code /uploads/uuid.jpg})
     * @throws BusinessException 빈 파일 / 허용되지 않는 MIME / 크기 초과 / I/O 실패
     */
    public String saveImage(MultipartFile file) {
        validateImage(file);

        String savedName = UUID.randomUUID() + extractExtension(file.getOriginalFilename());
        Path filePath = resolvedUploadPath.resolve(savedName);

        try {
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            log.error("[File] 저장 실패 - {}", savedName, e);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        log.info("[File] 업로드 완료 원본={} 저장={} 크기={}KB",
                file.getOriginalFilename(), savedName, file.getSize() / 1024);

        return "/uploads/" + savedName;
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_EMPTY);
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException(ErrorCode.FILE_INVALID_TYPE);
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }
    }

    private String extractExtension(String originalName) {
        if (originalName == null || !originalName.contains(".")) {
            return "";
        }
        return originalName.substring(originalName.lastIndexOf("."));
    }
}
