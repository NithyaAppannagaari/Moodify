import 'dotenv/config'; // automatically loads .env
import express from 'express';
import fetch from 'node-fetch';
import { pickSongs } from './ollama.js'; // assuming default export

const app = express();
app.use(express.json());

let tracks = new Set();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

app.get("/", (req, res) => {
  res.send("hello");
});

app.get('/tracks', async (req, res) => {
  let result = [];

  for (let track of tracks) {
    result.push(`${track.songName} - ${track.artists.join()}`);
  }

  res.send(result);
});

app.post('/exchange', async (req, res) => {
  const { code, code_verifier } = req.body;

  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);
  params.append('code_verifier', code_verifier);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      },
      body: params,
    });

    const data = await response.json();
    const access_token = data.access_token;

    const userRes = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const user = await userRes.json();

    // --- Top Tracks ---
    const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const topTracks = await topTracksRes.json();

    // --- Saved Tracks ---
    const savedTracksRes = await fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const savedTracks = await savedTracksRes.json();

    // --- Playlists ---
    const playlistsRes = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const playlists = await playlistsRes.json();

    const playlistTracks = [];

    for (let i = 0; i < playlists.items.length; i++) {
      const playlistTracksEndpoint = playlists.items[i].tracks.href;

      const ptsRaw = await fetch(playlistTracksEndpoint, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const pts = await ptsRaw.json();
      playlistTracks.push(...pts.items.map(item => item.track));
    }

    const allTracks = [
      ...(topTracks.items || []),
      ...(savedTracks.items?.map(item => item.track) || []),
      ...playlistTracks,
    ];

    console.log(allTracks);

    for (let track of allTracks) {
      let artistNames = [];

      for (let trackArtist of track.artists) {
        artistNames.push(trackArtist.name);
      }

      const trackId = track.id;
      const trackName = track.name;
      const trackUrl = track.uri;

      if (trackId != null && trackName != null && artistNames.length != 0 && trackUrl != null) {
        const trackInfo = {
          id: trackId,
          songName: trackName,
          artists: artistNames,
          songUri: trackUrl
        };
  
        // Add track info
        tracks.add(trackInfo);
      } 
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Token exchange failed');
  }
});

app.post("/chooseSongs", async (req, res) => {
  const { labels, tracks } = req.body;
  console.log("choosing songs from");
  console.log(tracks);

  (async () => {
    const result = await pickSongs(
      labels,
      tracks
    );
  
    res.json(result);
  })();
});

app.listen(3000, () => console.log('Server running on port 3000'));
