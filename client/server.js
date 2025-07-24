require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

let tracks = new Set();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

app.get("/", (req, res) => {
  res.send("hello");
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

    // --- Collect Genres ---
    const trackIds = new Set();

    const allTracks = [
      ...(topTracks.items || []),
      ...(savedTracks.items?.map(item => item.track) || []),
      ...playlistTracks,
    ];

    for (let track of allTracks) {
      if (!track || !track.artists || track.artists.length === 0) continue;

      const artistId = track.artists[0].id;

      try {
        const genreResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const genreData = await genreResponse.json();
        const genre = genreData.genres[0] || 'any';

        trackIds.add(JSON.stringify({ id: track.id, genre }));
      } catch (error) {
        console.error(`Failed to fetch genre for artist ${artistId}:`, error);
      }
    }

    tracks = trackIds;

    console.log("User:", user.display_name);
    console.log("Collected tracks by genre:");
    for (let t of trackIds) {
      console.log(JSON.parse(t));
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Token exchange failed');
  }
});

app.get("/songsByGenre", async (req, res) => {
  // Future endpoint
  const { genres } = req.body;

  // 1. iterate through genres in global tracks Set
  // 2. ask Ollama if the genres match?
  // However, each Ollama ask is going to take a really long time, and there's a lot of songs we queried
  // Maybe it would be better to ask Ollama to choose songs from the given list based off of the keywords we give

  res.json([...tracks].map(t => JSON.parse(t)));
});

app.listen(3000, () => console.log('Server running on port 3000'));
