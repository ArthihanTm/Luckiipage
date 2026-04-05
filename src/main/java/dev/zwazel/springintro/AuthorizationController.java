package dev.zwazel.springintro;

import dev.zwazel.springintro.user.UserMeResponse;
import dev.zwazel.springintro.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthorizationController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserMeResponse> me(@AuthenticationPrincipal UserDetails principal) {
        return userRepository.findUserByEmail(principal.getUsername())
                .map(u -> ResponseEntity.ok(new UserMeResponse(u.getEmail(), u.getChipBalance())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}