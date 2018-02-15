import React from 'react'
import jwtDecode from 'jwt-decode';

export default class AuthService {

  constructor() {
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  handleAuthentication(api) {
    this.extractAccessToken(api);
  }

  getParameterByName(name) {
    const match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  extractAccessToken(api) {
    console.log('AUTH API: ', api);
    const accessToken = this.getParameterByName('access_token');
    if (accessToken) {
      const tokenData = jwtDecode(accessToken);
      if (tokenData.sub) {
        const userID = tokenData.sub.split('auth0|')[1];
        api.user.saveAccessTokenSession(userID, accessToken, {});
      }
    }    
  }
}