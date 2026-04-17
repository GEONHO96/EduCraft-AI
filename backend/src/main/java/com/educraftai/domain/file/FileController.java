package com.educraftai.domain.file;

import com.educraftai.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * 파일 업로드 API.
 * <p>검증·저장 로직은 {@link FileStorageService}가 담당하고, 컨트롤러는 위임만 한다.
 * 응답 포맷은 {@code {"url": "/uploads/xxx"}}.
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    /** 이미지 업로드 (최대 10MB, image/* MIME만 허용) */
    @PostMapping("/upload")
    public ApiResponse<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(Map.of("url", fileStorageService.saveImage(file)));
    }
}
