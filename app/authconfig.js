export const AUTH_CONFIG = {
  domain: 'tidepool-stg.auth0.com',
  clientId: 'o8sOKy8SE4ruwC8zc1MCSTjOQ8MjeLhw',
  responseType: 'token id_token',
  scope: 'openid email profile',
  audience: 'https://tidepool.localtunnel.me',
  loginRedirectUri: 'http://localhost:3000/logged-in',
  signupRedirectUri: 'http://localhost:3000/email-verification'
}