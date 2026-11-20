#!/usr/bin/env bash
# Builds all media for the two stories from your ORIGINAL videos (needs ffmpeg).
#
#   scripts/build-media.sh hq   <skyline-video.mp4> <celebration-video.mp4>    # maximum quality (bigger files)
#   scripts/build-media.sh lite <skyline-video.mp4> <celebration-video.mp4>    # small files (what the demo ZIP ships with)
#
# Output goes to public/media/projects/<slug>/ . Clips keep their audio (music + sound) so the
# scrollytelling can play it. The celebration video is stored sideways, so it is rotated here.
# Optional: STEPS="clips films photos" to only run some steps, OUT=/other/dir to write elsewhere.
set -euo pipefail

PROFILE=${1:?usage: build-media.sh hq|lite <skyline.mp4> <celebration.mp4>}
SKY=${2:?skyline video missing}
CEL=${3:?celebration video missing}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
OUT=${OUT:-$ROOT/public/media/projects}
STEPS=${STEPS:-"clips films photos"}
SH="unsharp=5:5:0.5:5:5:0.0"          # gentle sharpening after the upscale
DN="hqdn3d=1.0:1.0:3:3"               # light denoise (cleaner compression)

if [ "$PROFILE" = hq ]; then
  CRF=20; MAXV=5M;  BUFV=10M; AUD=128k; WBIG=1920; WSM=1600; PHOTO_W=1920; PHOTO_Q=2
  FCRF=22; FMAX_SKY=2800k; FMAX_CEL=2800k; FW_SKY=1600; FW_CEL=1600; FAUD=160k
else
  CRF=27; MAXV=850k; BUFV=1700k; AUD=64k; WBIG=1280; WSM=1280; PHOTO_W=1600; PHOTO_Q=4
  FCRF=30; FMAX_SKY=330k; FMAX_CEL=650k; FW_SKY=960; FW_CEL=1280; FAUD=48k
fi

clip() { # src slug name start dur width pre
  local src=$1 slug=$2 name=$3 ss=$4 dur=$5 w=$6 pre=$7
  mkdir -p "$OUT/$slug/video"
  local fo; fo=$(python3 -c "print(max(0,$dur-0.15))")
  ffmpeg -v error -y -ss "$ss" -t "$dur" -i "$src" \
    -vf "${pre}${DN},scale=$w:-2:flags=lanczos,$SH" \
    -af "afade=t=in:d=0.08,afade=t=out:st=$fo:d=0.15" \
    -c:v libx264 -preset slow -crf $CRF -maxrate $MAXV -bufsize $BUFV -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a $AUD -ac 2 -movflags +faststart "$OUT/$slug/video/$name.mp4"
  ffmpeg -v error -y -ss "$ss" -i "$src" -frames:v 1 -vf "${pre}scale=$w:-2:flags=lanczos,$SH" -q:v 3 "$OUT/$slug/video/$name.jpg"
}
film() { # src slug start width maxrate pre
  mkdir -p "$OUT/$2/video"
  ffmpeg -v error -y -ss "$3" -i "$1" -vf "${6}${DN},scale=$4:-2:flags=lanczos,$SH" \
    -c:v libx264 -preset medium -crf $FCRF -maxrate "$5" -bufsize "$5" -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a $FAUD -movflags +faststart "$OUT/$2/video/film.mp4"
}
photos() { # src slug pre "times..." "t:x t:x ..."
  local src=$1 slug=$2 pre=$3 i=1
  mkdir -p "$OUT/$slug/photos"
  for t in $4; do
    ffmpeg -v error -y -ss "$t" -i "$src" -frames:v 1 -vf "${pre}scale=$PHOTO_W:-2:flags=lanczos,$SH" -q:v $PHOTO_Q "$OUT/$slug/photos/p$(printf %02d $i).jpg"; i=$((i+1))
  done
  i=1
  for tx in $5; do
    ffmpeg -v error -y -ss "${tx%%:*}" -i "$src" -frames:v 1 -vf "${pre}crop=576:720:${tx##*:}:0,scale=720:900:flags=lanczos,$SH" -q:v $PHOTO_Q "$OUT/$slug/photos/t$(printf %02d $i).jpg"; i=$((i+1))
  done
}
has() { [[ " $STEPS " == *" $1 "* ]]; }

# ---------------- 01 skyline-wedding (landscape 1280x720 download) ----------------
if has clips; then
  clip "$SKY" skyline-wedding hero   33.0 8.0 $WBIG ""
  clip "$SKY" skyline-wedding ch1    51.5 8.5 $WSM  ""
  clip "$SKY" skyline-wedding ch2    41.0 7.0 $WSM  ""
  clip "$SKY" skyline-wedding ch3    81.0 9.0 $WSM  ""
  clip "$SKY" skyline-wedding ch4   102.0 8.0 $WSM  ""
  clip "$SKY" skyline-wedding party 121.0 7.0 $WBIG ""
  clip "$SKY" skyline-wedding aerial  9.0 5.0 $WSM  ""
fi
has films  && film "$SKY" skyline-wedding 8.0 $FW_SKY $FMAX_SKY ""
has photos && photos "$SKY" skyline-wedding "" \
  "11 24.5 34 37 40 43 63 55 60 78 82 88 104 115" \
  "55:290 34:80 37:440 84:352 104:352"

# ---------------- 02 grand-celebration (sideways phone video: rotate) ----------------
R="transpose=2,"
if has clips; then
  clip "$CEL" grand-celebration hero   43.1 5.0 $WBIG "$R"
  clip "$CEL" grand-celebration ch1     9.0 8.0 $WSM  "$R"
  clip "$CEL" grand-celebration ch2    17.0 6.3 $WSM  "$R"
  clip "$CEL" grand-celebration ch3    24.4 5.0 $WSM  "$R"
  clip "$CEL" grand-celebration ch4    29.4 8.1 $WSM  "$R"
  clip "$CEL" grand-celebration party  37.5 5.6 $WBIG "$R"
  clip "$CEL" grand-celebration aerial 48.1 2.9 $WSM  "$R"
fi
has films  && film "$CEL" grand-celebration 3.9 $FW_CEL $FMAX_CEL "$R"
has photos && photos "$CEL" grand-celebration "$R" \
  "9.5 10.8 14.5 16.3 18.9 21.2 22.0 22.9 23.8 25.5 28.9 38.9 43.7 46.2" \
  "21.2:430 14.7:326 16.4:352 44.0:250 10.8:224"
echo "done: $PROFILE"
