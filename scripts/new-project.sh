#!/usr/bin/env bash
# Creates the media folder for a new project from a video, using the standard file names the site expects.
#
#   scripts/new-project.sh <slug> <video.mp4> [transpose]
#
#   slug       folder / URL name, e.g. "garden-wedding"  ->  /portfolio/garden-wedding
#   transpose  only if the video is stored sideways: 1 = rotate clockwise, 2 = rotate counter-clockwise
#
# It auto-picks evenly spaced clips and stills as a STARTING POINT.
# For the best result, hand-pick moments and overwrite individual files (same names), e.g.:
#   ffmpeg -ss 41.4 -i video.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 3 public/media/projects/<slug>/photos/p12.jpg
#
# Needs ffmpeg + ffprobe. Afterwards, add one block to lib/projects.ts (copy an existing one).
set -euo pipefail
SLUG="${1:?slug required}"; IN="${2:?video required}"; TR="${3:-}"
OUT="public/media/projects/$SLUG"; mkdir -p "$OUT/video" "$OUT/photos"

# light denoise + clean lanczos upscale + gentle sharpen (looks crisper than letting the browser upscale)
R="hqdn3d=1.2:1.2:4:4,scale=1600:-2:flags=lanczos,unsharp=5:5:0.5:5:5:0.0"; [ -n "$TR" ] && R="transpose=$TR,$R"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN" | cut -d. -f1)
START=$((DUR / 14)); SPAN=$((DUR - 2 * START))      # skip intro/outro bumpers

# 7 clips, 7s each (re-encoded at high quality; this step is slow, give it a few minutes), spread across the film
i=0
for k in hero ch1 ch2 ch3 ch4 party aerial; do
  t=$(( START + SPAN * i / 7 )); i=$((i + 1))
  ffmpeg -v error -y -ss "$t" -t 7 -i "$IN" -an -vf "$R" -c:v libx264 -crf 20 -preset slow -maxrate 6M -bufsize 12M -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/video/$k.mp4"
  ffmpeg -v error -y -ss "$t" -i "$IN" -frames:v 1 -vf "$R" -q:v 2 "$OUT/video/$k.jpg"
done

# full film with sound
ffmpeg -v error -y -i "$IN" -vf "$R" -c:v libx264 -crf 21 -preset medium -maxrate 6M -bufsize 12M -profile:v high -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT/video/film.mp4"

# 14 wide stills + 5 portrait (4:5) crops
for n in $(seq 1 14); do
  t=$(( START + SPAN * n / 15 ))
  ffmpeg -v error -y -ss "$t" -i "$IN" -frames:v 1 -vf "$R" -q:v 2 "$OUT/photos/p$(printf %02d $n).jpg"
done
for n in $(seq 1 5); do
  t=$(( START + SPAN * n / 6 ))
  ffmpeg -v error -y -ss "$t" -i "$IN" -frames:v 1 -vf "${TR:+transpose=$TR,}crop=ih*4/5:ih,scale=720:900:flags=lanczos" -q:v 2 "$OUT/photos/t$(printf %02d $n).jpg"
done
echo "Done: $OUT  ->  now add the project to lib/projects.ts"
