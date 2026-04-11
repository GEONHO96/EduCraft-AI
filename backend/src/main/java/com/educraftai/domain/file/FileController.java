package com.educraftai.domain.file;

import com.educraftai.global.common.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

/**
 * 파일 업로드 컨트롤러
 * 이미지 파일을 서버에 저장하고 접근 가능한 URL을 반환한다.
 */
@Slf4j
@RestController
@RequestMapping("/api/files")
public class FileController {

    /** 업로드 파일 저장 디렉토리 */
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    /**
     * 이미지 파일 업로드
     * - 최대 10MB, 이미지 파일만 허용 (jpg, png, gif, webp)
     * - UUID 기반 파일명으로 저장하여 충돌 방지
     * @return 업로드된 파일의 접근 URL
     */
    @PostMapping("/upload")
    public ApiResponse<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        // 파일 유효성 검사
        if (file.isEmpty()) {
            return ApiResponse.error("FILE_001", "파일이 비어있습니다.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ApiResponse.error("FILE_002", "이미지 파일만 업로드 가능합니다.");
        }

        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            return ApiResponse.error("FILE_003", "파일 크기는 10MB 이하만 가능합니다.");
        }

        // 저장 디렉토리 생성
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // UUID 기반 고유 파일명 생성
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String savedName = UUID.randomUUID() + extension;

        // 파일 저장
        Path filePath = uploadPath.resolve(savedName);
        file.transferTo(filePath.toFile());

        log.info("[파일 업로드] 원본={}, 저장={}, 크기={}KB", originalName, savedName, file.getSize() / 1024);

        // 접근 URL 반환
        String fileUrl = "/uploads/" + savedName;
        return ApiResponse.ok(Map.of("url", fileUrl));
    }
}
