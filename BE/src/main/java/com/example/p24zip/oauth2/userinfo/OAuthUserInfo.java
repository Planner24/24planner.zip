package com.example.p24zip.oauth2.userinfo;

public interface OAuthUserInfo {

    String getProvider();
    String getProviderId();
    String getEmail();

}
