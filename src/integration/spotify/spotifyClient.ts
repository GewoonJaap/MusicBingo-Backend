import {
  Album,
  Artist,
  SimplifiedAlbum,
  SpotifyApi,
  Track,
  SimplifiedTrack,
  UserProfile,
  User,
  Playlist,
  SimplifiedPlaylist,
  Page,
  PlaylistedTrack
} from "@spotify/web-api-ts-sdk";
import { SpotifyAuthenticationFailureError } from "../../errors/SpotifyAuthenticationFailureError";
import { SPOTIFY_CONFIG } from "../../const";
import { stringFormatter } from "../../util/stringFormatter";

export class SpotifyClient {
  private spotifyApi: SpotifyApi | undefined;
  private env: Env;

  public constructor(env: Env) {
    this.env = env;
  }

  public async authenticateAnonymously() {
    this.spotifyApi = SpotifyApi.withClientCredentials(this.env.SPOTIFY_CLIENT_ID, this.env.SPOTIFY_CLIENT_SECRET);
  }

  public async getTrack(trackId: string): Promise<Track> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const track = await this.spotifyApi.tracks.get(trackId);
    return track;
  }

  public async getTracks(trackIds: string[]): Promise<Track[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const batchedTrackIds = [];
    for (let i = 0; i < trackIds.length; i += SPOTIFY_CONFIG.TRACKS.MAX_BATCH_SIZE) {
      batchedTrackIds.push(trackIds.slice(i, i + SPOTIFY_CONFIG.TRACKS.MAX_BATCH_SIZE));
    }
    const tracks = (await Promise.all(batchedTrackIds.map((ids) => this.spotifyApi!.tracks.get(ids)))).flat();
    return tracks;
  }

  public async getTrackRecommendations(
    trackIdSeed: string[],
    artistIdSeed: string[],
    genreSeed: string[],
    limit: number = SPOTIFY_CONFIG.RECOMMENDATIONS.DEFAULT_LIMIT
  ): Promise<Track[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const recommendations = await this.spotifyApi.recommendations.get({
      seed_tracks: trackIdSeed,
      seed_artists: artistIdSeed,
      seed_genres: genreSeed,
      limit,
      market: SPOTIFY_CONFIG.DEFAULT_MARKET
    });
    const tracks = recommendations.tracks;
    return tracks;
  }

  public async getArtist(artistId: string): Promise<Artist> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    return await this.spotifyApi.artists.get(artistId);
  }

  public async getArtistAlbums(artistId: string): Promise<SimplifiedAlbum[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const albums = await this.spotifyApi.artists.albums(artistId);
    return albums.items;
  }

  public async getArtistTopTracks(artistId: string): Promise<Track[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const topTracks = await this.spotifyApi.artists.topTracks(artistId, SPOTIFY_CONFIG.DEFAULT_MARKET);
    return topTracks.tracks;
  }

  public async getArtistRelatedArtists(artistId: string): Promise<Artist[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const relatedArtists = await this.spotifyApi.artists.relatedArtists(artistId);
    return relatedArtists.artists;
  }

  public async getAlbum(albumId: string): Promise<Album> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    return await this.spotifyApi.albums.get(albumId);
  }

  public async getAlbumTracks(albumId: string): Promise<SimplifiedTrack[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const album = await this.spotifyApi.albums.get(albumId);
    return album.tracks.items;
  }

  public async getAlbumsTracks(albumIds: string[]): Promise<SimplifiedTrack[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    let tracks: SimplifiedTrack[] = [];
    let albumTrackPromises: Promise<SimplifiedTrack[]>[] = [];
    for (const albumId of albumIds) {
      const promise = this.getAlbumTracks(albumId);
      albumTrackPromises.push(promise);
    }
    const albumTracks = await Promise.all(albumTrackPromises);
    tracks = albumTracks.flat();
    return tracks;
  }

  public async getUser(userId: string): Promise<User> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    return await this.spotifyApi.users.profile(userId);
  }

  public async getMe(): Promise<UserProfile> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    return await this.spotifyApi.currentUser.profile();
  }

  public async getMeFollowedArtists(): Promise<Artist[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const artists = (await this.spotifyApi.currentUser.followedArtists()).artists;
    return artists.items;
  }

  public async getMeTopTracks(): Promise<Track[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const topItems = await this.spotifyApi.currentUser.topItems("tracks");
    return topItems.items;
  }

  public async getMeTopArtists(): Promise<Artist[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const topItems = await this.spotifyApi.currentUser.topItems("artists");
    return topItems.items;
  }

  public async getNewAlbumReleases(): Promise<SimplifiedAlbum[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const newReleases = await this.spotifyApi.browse.getNewReleases();
    return newReleases.albums.items;
  }

  public async getPlaylistById(playlistId: string): Promise<Playlist> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const playlist = await this.spotifyApi.playlists.getPlaylist(playlistId);
    let nextUrl = playlist.tracks.next;
    let nextFetches = 0;
    while (nextUrl && nextFetches <= SPOTIFY_CONFIG.PLAYLIST.MAX_NEXT_FETCHES) {
      nextFetches++;
      const restOfTracks = (await this.spotifyApi.makeRequest(
        "GET",
        nextUrl.split("https://api.spotify.com/v1/")[1]
      )) as Page<PlaylistedTrack<Track>>;
      playlist.tracks.items = playlist.tracks.items.concat(restOfTracks.items);
      nextUrl = restOfTracks.next;
    }
    const tracks = playlist.tracks.items.map((item) => item.track);
    return playlist;
  }

  public async getTracksFromPlaylist(playlistId: string): Promise<Track[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const playlist = await this.spotifyApi.playlists.getPlaylist(playlistId);
    const tracks = playlist.tracks.items.map((item) => item.track);
    return tracks;
  }

  public async addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    //Spotify only allows 100 tracks to be added at once
    trackIds = trackIds.slice(0, 100);
    await this.spotifyApi.playlists.addItemsToPlaylist(playlistId, trackIds);
  }

  public async removeTracksFromPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    await this.spotifyApi.playlists.removeItemsFromPlaylist(playlistId, {
      tracks: trackIds.map((id) => ({ uri: id }))
    });
  }

  public async getCurrentUserPlaylists(): Promise<SimplifiedPlaylist[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const playlists = await this.spotifyApi.currentUser.playlists.playlists();
    return playlists.items;
  }

  public async getPlaylistsByUserId(userId: string): Promise<SimplifiedPlaylist[]> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const playlists = await this.spotifyApi.playlists.getUsersPlaylists(userId);
    return playlists.items;
  }

  public async createPlaylist(
    userId: string,
    username: string,
    playlistName: string,
    isPublic: boolean = true
  ): Promise<Playlist> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    const description = stringFormatter(SPOTIFY_CONFIG.PLAYLIST.DEFAULT_PLAYLIST_DESCRIPTION, {
      username
    });
    return await this.spotifyApi.playlists.createPlaylist(userId, {
      name: playlistName,
      public: isPublic,
      description: description
    });
  }

  public async setPlaylistCoverImage(playlistId: string, base64Image: string): Promise<void> {
    if (!this.spotifyApi) throw new SpotifyAuthenticationFailureError();
    await this.spotifyApi.playlists.addCustomPlaylistCoverImageFromBase64String(playlistId, base64Image);
  }
}
