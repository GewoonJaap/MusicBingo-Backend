export class SpotifyAuthenticationFailureError extends Error {
  constructor() {
    super("Spotify authentication failed.");
    this.name = "SpotifyAuthenticationFailureError";
    Object.setPrototypeOf(this, SpotifyAuthenticationFailureError.prototype);
  }
}
