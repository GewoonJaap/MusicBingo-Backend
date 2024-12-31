export class SpotifyAuthHeaderInvalidError extends Error {
  constructor() {
    super("Spotify authentication header is invalid.");
    this.name = "SpotifyAuthHeaderInvalidError";
    Object.setPrototypeOf(this, SpotifyAuthHeaderInvalidError.prototype);
  }
}
