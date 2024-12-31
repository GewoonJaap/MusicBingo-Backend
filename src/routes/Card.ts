import { Hono } from "hono";
import { SpotifyClientBuilder } from "../integration/spotify/spotifyClientBuilder";

export const CardRoute = new Hono<{ Bindings: Env }>();

CardRoute.get("/playlist/:playlistId", async (c) => {
  const spotifyApi = new SpotifyClientBuilder(c.env).withAnonymousAuth().build();
  const playlistId = c.req.param("playlistId");
  if (!playlistId) {
    return c.text("No playlistId provided");
  }
  const playlist = await spotifyApi.getPlaylistById(playlistId);
  return c.json(playlist);
});

CardRoute.get("/artist/:artistId", async (c) => {
  const spotifyApi = new SpotifyClientBuilder(c.env).withAnonymousAuth().build();
  const artistId = c.req.param("artistId");
  if (!artistId) {
    return c.text("No artistId provided");
  }
  const artist = await spotifyApi.getArtistAlbums(artistId);
  return c.json(artist);
});

CardRoute.get("/album/:albumId", async (c) => {
  const spotifyApi = new SpotifyClientBuilder(c.env).withAnonymousAuth().build();
  const albumId = c.req.param("albumId");
  if (!albumId) {
    return c.text("No albumId provided");
  }
  const album = await spotifyApi.getAlbum(albumId);
  return c.json(album);
});

CardRoute.get("/track/:trackId", async (c) => {
  const spotifyApi = new SpotifyClientBuilder(c.env).withAnonymousAuth().build();
  const trackId = c.req.param("trackId");
  if (!trackId) {
    return c.text("No trackId provided");
  }
  const track = await spotifyApi.getTrack(trackId);
  return c.json(track);
});
