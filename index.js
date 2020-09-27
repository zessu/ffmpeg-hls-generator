const { spawn } = require('child_process');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const inputArguments = process.argv.slice(2);
const filename = inputArguments[0];
let audioBitRate = 0;
let videoCodec = '';
let audioCodec = '';
var fileMetadata;
let videoFrameRate = '';
const resolutions = [
  '480X320',
  '640X432',
  '960X640',
  '1024X768',
  '1920X1080'
];

const bitrates = [1100, 3000, 4000, 5000, 6000];

var args = [
  '-y', // overwrite existing files
  '-i', filename,
  '-g', '72',
  '-keyint_min', '72',
  '-map', '0:0',
  '-map', '0:1',
  '-map', '0:0',
  '-map', '0:1',
  '-map', '0:0',
  '-map', '0:1',
  '-map', '0:0',
  '-map', '0:1',
  '-map', '0:0',
  '-map', '0:1',
  '-s:v:0', resolutions[0], // set resolution
  '-c:v:0', 'libx264', // set codec
  '-b:v:0', `${bitrates[0]}k`, // set bitrate

  '-s:v:1', resolutions[1],
  '-c:v:1', 'libx264',
  '-b:v:0', `${bitrates[1]}k`,

  '-s:v:2', resolutions[2],
  '-c:v:2', 'libx264',
  '-b:v:2', `${bitrates[2]}k`,

  '-s:v:3', resolutions[3],
  '-c:v:3', 'libx264',
  '-b:v:3', `${bitrates[3]}k`,

  '-s:v:4', resolutions[4],
  '-c:v:4', 'libx264',
  '-b:v:4', `${bitrates[4]}k`,
  '-c:a', 'copy',
  '-var_stream_map', "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3 v:4,a:4",
  // '-master_pl_name', 'master.m3u8', // create playlist manually
  '-f', 'hls',
  '-hls_time', '6',
  '-hls_list_size', '0',
  '-hls_segment_filename', "v%v/fileSequence%d.ts",
  'v%v/prog_index.m3u8'
];

ffmpeg.ffprobe('./tos-teaser.mp4', (error, metadata) => {
  if (error) {
    console.log('cannot read file information used to generate manifest');
    process.exit(1);
  }
  fileMetadata = metadata;
  audioBitRate = fileMetadata.streams[1].bit_rate;
  videoCodec = fileMetadata.streams[0].codec_tag_string; // todo not set
  audioCodec = fileMetadata.streams[1].codec_tag_string; // todo not set
  videoFrameRateData = fileMetadata.streams[0].r_frame_rate.split('/');
  videoFrameRate = videoFrameRateData[0] / videoFrameRateData[1];
});

const proc = spawn('ffmpeg', args);

proc.stdout.on('data', (data) => {
  console.log(` correct data is ${data}`);
})

proc.stderr.setEncoding("utf8");
proc.stderr.on('data', (data) => {
  console.error(`error is >>>> ${data} <<<<`);
});

proc.on('close', (code) => {
  if (code === 0) {
    // no error occurred, generate manifest
    const intro = '#EXTM3U\n';
    const version = '#EXT-X-VERSION:3\n';
    fs.writeFileSync('master.m3u8', intro, function (error, data) {
      if (error) {
        console.log('there was an error writing to that file');
      }
    });
    fs.appendFileSync('master.m3u8', version, function (error, data) { console.error(error); });
    resolutions.map((variant, index) => {
      let bandwidth = Math.floor(1.10 * (audioBitRate + bitrates[index] * 1000));
      let resolution = variant;
      const streamInfo = `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution},CODECS="${videoCodec},${audioCodec}",FRAME-RATE=${videoFrameRate}\n`;
      fs.appendFileSync('master.m3u8', streamInfo, function (error, data) { console.error(error); });
      fs.appendFileSync('master.m3u8', `v${index}/prog_index.m3u8\n\n`, function (error, data) { console.error(error); });
    });
  }
});

// todo Q are streams fixed i.e is 0 always video and 1 audio ?
// todo add average bandwith calculations
// todo handle file errors that occur better
// todo see if filename can be streamed, re-streamed or obtained from a url
// todo how do you calculate average bandwidth
