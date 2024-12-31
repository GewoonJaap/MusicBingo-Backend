export class SpotifyAuthHeaderMissingError extends Error {
  constructor() {
    super("Spotify authentication header is missing.");
    this.name = "SpotifyAuthHeaderMissingError";
    Object.setPrototypeOf(this, SpotifyAuthHeaderMissingError.prototype);
  }
}
