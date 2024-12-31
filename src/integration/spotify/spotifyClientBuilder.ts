import { SpotifyClient } from "./spotifyClient";

export class SpotifyClientBuilder {
  constructor(env: Env) {
    this.spotifyClient = new SpotifyClient(env);
  }
  private spotifyClient: SpotifyClient;
  /**
   * Authtenticates the client anonymously
   * @returns SpotifyClientBuilder
   */
  public withAnonymousAuth(): SpotifyClientBuilder {
    this.spotifyClient.authenticateAnonymously();
    return this;
  }

  /**
   * Builds the SpotifyClient
   * @returns SpotifyClient
   */
  public build(): SpotifyClient {
    return this.spotifyClient;
  }
}
