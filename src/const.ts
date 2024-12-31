import { Market } from "@spotify/web-api-ts-sdk";

export const SPOTIFY_CONFIG = {
  RECOMMENDATIONS: {
    DEFAULT_LIMIT: 10
  },
  DEFAULT_MARKET: "US" as Market,
  CANVAS: {
    CANVASES_URL: "https://spclient.wg.spotify.com/canvaz-cache/v0/canvases"
  },
  PLAYLIST: {
    DEFAULT_PLAYLIST_DESCRIPTION: "{{username}}'s favorite tracks from Musify",
    MAX_NEXT_FETCHES: 10
  },
  ARTIST: {
    RANDOM_TRACKS: {
      MAX_RANDOM_TRACKS: 30, // -1 for all
      MAX_RANDOM_ALBUMS: 10 // -1 for all
    }
  },
  MUSIFY_STOCK_IMAGES: {
    HEIGHT: 1024,
    WIDTH: 1024,
    IMAGE_URLS: [
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/1.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/2.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/3.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/4.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/5.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/6.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/7.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/8.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/9.jpeg",
      "https://musifyapp.ams3.cdn.digitaloceanspaces.com/playlist-artwork/10.jpeg"
    ]
  },
  TRACKS: {
    MAX_BATCH_SIZE: 30
  }
};
