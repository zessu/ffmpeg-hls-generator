# HLS + FFMPEG

This script uses ffmpeg to generate HLS assets for an adaptive bit rate streaming architecture.

It also generates a master manifest m3u8 file which is linked to to start playback

We generate the following resolutions are their respective bit rates

| resolution | bitrate |
| ---------- | ------- |
| 480X320    | 1100k   |
| 640X432    | 3000k   |
| 960X640    | 4000k   |
| 1024X768   | 5000k   |
| 1920X1080  | 6000k   |

&nbsp;

To run the script , type `node index.js {fileurl} {segment_duration}`

This will result in the following type of segmentation

&nbsp;

![hls workflow image](hsl-workflow.png)

Configure your client to ask for different video resolutions and/or file sizes depending on the users bandwidth

&nbsp;

## Useful links
---

[Creating a master platlist](https://developer.apple.com/documentation/http_live_streaming/example_playlists_for_http_live_streaming/creating_a_master_playlist)

[Video on demand playlist contruction](https://developer.apple.com/documentation/http_live_streaming/example_playlists_for_http_live_streaming/video_on_demand_playlist_construction)

[Adaptive Bit Rate streaming](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming)

[ffmpeg](https://www.ffmpeg.org/ffmpeg-all.html#Video-Options)

[ffmpeg quick guide](https://opensource.com/article/17/6/ffmpeg-convert-media-file-formats)

[video transmuxing](https://blog.stackpath.com/transmuxing/)
