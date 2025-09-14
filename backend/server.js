import 'dotenv/config'; // automatically loads .env
import express from 'express';
import fetch from 'node-fetch';
import { pickSongs } from './ollama.js'; // assuming default export

const app = express();
// Increase JSON payload limit to 50MB
app.use(express.json({ limit: '50mb' }));
// Increase URL-encoded payload limit to 50MB
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

let tracks = new Set();
let chosenSongUrls = new Set();
let userId = "";
let universalToken = "";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

app.get("/", (req, res) => {
  res.send("hello");
});

app.post('/createPlaylist', async (req, res) => {
  const { playlistTitle } = req.body;

  try {
    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${universalToken}`,
      },
      body: JSON.stringify(
      {
        "name": playlistTitle,
        "description": "recs for your uploaded image",
        "public": false
      }),
    });

    if (!playlistResponse.ok) {
      const errorText = await playlistResponse.text();
      throw new Error(`Failed to create playlist: ${playlistResponse.status} - ${errorText}`);
    }

    const playlist = await playlistResponse.json();

    // add tracks to created playlist
    const newTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks?uris=${Array.from(chosenSongUrls).join(',')}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${universalToken}`,
    }});

    if (!newTracksResponse.ok) {
      const errorText = await newTracksResponse.text();
      throw new Error(`Failed to add tracks to playlist: ${newTracksResponse.status} - ${errorText}`);
    }

    res.json(playlist);
  } catch (error) {
    console.error("Error occurred while creating playlist or adding tracks:", error);
  }
});

app.post('/exchange', async (req, res) => {
  const { code, code_verifier } = req.body;

  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);
  params.append('code_verifier', code_verifier);

  console.log("in here");

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
    universalToken = access_token;

    const userRes = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const user = await userRes.json();
    userId = user.id;

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
  const { imageData } = req.body; // imageData should be base 64 encoded image
  chosenSongUrls = new Set();
  
  let trackMap = {};

  for (const track of tracks) {
    trackMap[`${track.songName} - ${track.artists.join()}`] = track.songUri;
    console.log(trackMap[`${track.songName} - ${track.artists.join()}`]);
  }

  (async () => {
    const result = await pickSongs(
      imageData,
      Object.keys(trackMap)
    );

    // The result will be the keys to the song urls
    for (let keyValue of result) {
      let keyValueString = `${keyValue.name} - ${keyValue.artists.join()}`;
      if (keyValueString in trackMap) {
        chosenSongUrls.add(trackMap[keyValueString]);
      }
    }

    res.json(chosenSongUrls);
  })();
});

app.listen(3000, () => console.log('Server running on port 3000'));
