package com.example.p24zip.oauth2.service;

import com.example.p24zip.domain.user.entity.Role;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.domain.user.repository.UserRepository;
import com.example.p24zip.oauth2.CustomOAuth2User;
import com.example.p24zip.oauth2.userinfo.KakaoOAuthUserInfo;
import com.example.p24zip.oauth2.userinfo.OAuthUserInfo;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        // 사용자 정보 (attributes) 가져오기
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // OAuth 제공자 ID 가져오기
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // OAuth 제공자에 맞는 사용자 정보 가져오기
        OAuthUserInfo oAuthUserInfo = getOAuthUserInfo(registrationId, attributes);

        // 이메일로 사용자 조회
        String email = oAuthUserInfo.getEmail();
        User user = userRepository.findByUsername(email).orElseGet(() -> {
            User newUser = User.builder()
                .username(email)
                .password("test123!")
                .nickname("test")
                .role(Role.ROLE_USER)
                .build();
            return userRepository.save(newUser);
        });

        // OAuth 제공자에서 제공하는 사용자 이름 속성 값 가져오기
        String nameAttributeKey = userRequest.getClientRegistration()
            .getProviderDetails()
            .getUserInfoEndpoint()
            .getUserNameAttributeName();

        return new CustomOAuth2User(oAuth2User, nameAttributeKey, user);
    }

    // 등록된 OAuth 제공자에 맞는 사용자 정보를 반환
    private OAuthUserInfo getOAuthUserInfo(String registrationId, Map<String, Object> attributes) {
        switch (registrationId) {
            case "kakao":
                return new KakaoOAuthUserInfo(attributes);
//            case "google":
//                return new GoogleOAuthUserInfo(attributes);
//            case "naver":
//                return new NaverOAuthUserInfo(attributes);
            default:
                throw new OAuth2AuthenticationException("지원되지 않는 OAuth 제공자입니다.");
        }
    }
}
