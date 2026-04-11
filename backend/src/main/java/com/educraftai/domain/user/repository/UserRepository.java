package com.educraftai.domain.user.repository;

import com.educraftai.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndName(String email, String name);
    List<User> findByName(String name);
    Optional<User> findBySocialProviderAndSocialId(User.SocialProvider socialProvider, String socialId);
    boolean existsByEmail(String email);
}
