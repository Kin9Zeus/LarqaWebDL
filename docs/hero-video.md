# Hero video — Veo 3.1 prompts and delivery spec

The hero plays the architectural pipeline — drawing → 3D model → render → built
work — as one continuous shot. On desktop it is **scrubbed by scroll position**;
on mobile it plays as a normal muted loop.

Until the files exist, the hero falls back to the Villa Frente al Mar render
automatically. Nothing breaks; drop the files in and the video takes over.

| File | Path | Aspect | Target |
| --- | --- | --- | --- |
| Desktop | `public/video/hero-desktop.mp4` | 16:9 | ≤ 6 MB |
| Mobile | `public/video/hero-mobile.mp4` | 9:16 | ≤ 3 MB |

---

## Why the prompts are written this way

Four constraints come from how the video is *used*, not from taste:

1. **One unbroken shot.** Scrubbing across a cut looks like a bug — the image
   appears to tear as the user scrolls. Every prompt below forbids cuts.
2. **Constant camera velocity.** Scroll position maps linearly to time, so any
   speed ramp in the footage reads as stutter.
3. **Reserved negative space.** The headline sits bottom-left on desktop and
   bottom-centre on mobile. That area has to stay quiet.
4. **No text, no people.** Text would fight the headline and would be wrong in
   one of the two languages. People date the footage and pull focus.

---

## Desktop — 16:9

### Prompt

```
One continuous 8-second architectural visualization shot of a modern luxury
cliffside mansion being built up through every stage of the design process,
with no cuts.

The shot opens on a crisp white architectural floor plan: fine black linework,
dimension lines, wall hatching, drawn on paper. The lines lift off the page and
extrude upward into a clean untextured grey 3D massing model — flat clay
surfaces, visible wireframe edges, no materials. Materials then sweep across the
volume in one continuous wave from left to right: warm walnut timber slats,
board-formed concrete, floor-to-ceiling glass, dark slate roof planes. The scene
finally resolves into a fully photorealistic architectural render at golden
hour, with warm low sunlight raking across the facade, an infinity pool holding
a mirror reflection, soft interior lighting glowing behind the glass, and palm
fronds drifting slightly in the breeze.

Camera: a single unbroken slow dolly forward with gentle rightward parallax,
eye level, 35mm lens, locked horizon, perfectly smooth constant velocity from
first frame to last.

Lighting and grade: begins cool and desaturated in graphite and pale blue,
warming steadily to amber and deep shadow by the final second. Cinematic,
restrained, high dynamic range.

Composition: the lower-left third of the frame stays clean, dark and
uncluttered — no detail, no bright highlights in that region.

Style: high-end architectural visualization, photoreal, quiet and expensive.
```

### Negative prompt

```
text, letters, words, numbers, typography, watermark, logo, signature,
subtitles, captions, UI overlay, people, humans, figures, faces, crowds, cars,
traffic, animals, birds, cuts, jump cuts, scene changes, montage, transitions,
crossfade, speed ramp, time-lapse stutter, fast motion, slow motion changes,
shaky camera, handheld, camera shake, whip pan, snap zoom, dutch angle, fisheye,
heavy lens flare, bloom, heavy vignette, film grain overlay, light leaks,
oversaturated colors, neon colors, HDR halo, cartoon, illustration, anime,
painterly, sketch filter, low resolution, blurry, soft focus, compression
artifacts, distorted geometry, warped architecture, melting structures, bending
walls, floating objects, duplicated floors, impossible geometry, flickering,
strobing, speech, dialogue, voiceover, narration, vocals, lyrics
```

---

## Mobile — 9:16

Not a crop of the desktop version. A vertical frame wants a vertical subject, so
this one climbs the building rather than moving past it.

### Prompt

```
One continuous 8-second vertical architectural visualization shot of a modern
luxury mansion assembling itself through every stage of the design process, with
no cuts.

The shot opens tight on a white architectural elevation drawing: fine black
linework, dimension lines, level markers. The drawing extrudes forward into a
clean untextured grey 3D massing model with visible wireframe edges and flat
clay surfaces. Materials then wash upward across the volume in one continuous
vertical sweep: board-formed concrete at the base, warm walnut timber slats,
floor-to-ceiling glass, a dark slate roof. The scene resolves into a fully
photorealistic architectural render at golden hour, warm sunlight grazing the
facade, interior lighting glowing behind the glass, tall palms swaying gently at
the edges of frame.

Camera: a single unbroken slow vertical tilt upward with a subtle push in, 35mm
lens, locked horizon, perfectly smooth constant velocity, no cuts.

Lighting and grade: begins cool graphite and pale blue, warming steadily to
amber with deep shadow by the final second. Cinematic and restrained.

Composition: vertical 9:16. The building is centred and fills the upper two
thirds. The bottom third of the frame stays dark, clean and uncluttered — no
detail or bright highlights there.

Style: high-end architectural visualization, photoreal, quiet and expensive.
```

### Negative prompt

```
text, letters, words, numbers, typography, watermark, logo, signature,
subtitles, captions, UI overlay, people, humans, figures, faces, crowds, cars,
animals, cuts, jump cuts, scene changes, montage, transitions, crossfade, speed
ramp, fast motion, shaky camera, handheld, camera shake, whip pan, snap zoom,
dutch angle, fisheye, heavy lens flare, bloom, heavy vignette, film grain
overlay, light leaks, oversaturated colors, neon colors, cartoon, illustration,
anime, painterly, low resolution, blurry, soft focus, compression artifacts,
distorted geometry, warped architecture, melting structures, floating objects,
duplicated floors, flickering, strobing, letterboxing, black bars, horizontal
composition, speech, dialogue, voiceover, narration, vocals
```

---

## Encoding for smooth scrubbing

This step matters more than the generation. Seeking `currentTime` every frame is
only cheap if the decoder can jump straight to the requested frame — which needs
a keyframe on (or very near) every frame. Straight out of Veo, the GOP is long
and scrubbing will feel like it is snapping between stills.

Re-encode both files with `-g 1` (every frame a keyframe) before shipping:

```bash
ffmpeg -i veo-desktop-raw.mp4 -an -vf "scale=1920:-2,fps=30" -c:v libx264 -profile:v high -pix_fmt yuv420p -g 1 -crf 26 -movflags +faststart public/video/hero-desktop.mp4
```

```bash
ffmpeg -i veo-mobile-raw.mp4 -an -vf "scale=900:-2,fps=30" -c:v libx264 -profile:v high -pix_fmt yuv420p -g 1 -crf 28 -movflags +faststart public/video/hero-mobile.mp4
```

Notes on the flags:

- `-an` strips audio. The player is muted and the file is smaller without it.
- `-g 1` is the keyframe interval. This is what makes scrubbing smooth, and it
  is also what inflates the file — hence the higher `-crf`.
- `-movflags +faststart` moves the index to the front so playback can begin
  before the whole file has downloaded.
- `-pix_fmt yuv420p` is required for Safari and older Android to decode at all.

If a file lands noticeably above the size targets, raise `-crf` (28 → 30) before
lowering the resolution — grain-free architectural footage tolerates compression
well, and losing resolution on a full-bleed hero is more visible.

## How the component behaves

`app/components/Hero.tsx`:

- **Desktop, motion allowed** → scrubs `currentTime` against smoothed scroll.
- **Mobile, or reduced-motion** → plays as a muted autoplay loop. Per-frame
  seeking on iOS Safari is expensive and stutters, which is exactly the problem
  this site was rebuilt to avoid.
- **File missing or stalled** → falls back to the Villa Frente al Mar still
  after 4 seconds, via `onError` plus a timeout.

The hero has no stage labels overlaid on it. An earlier version carried a
`Plano / Modelo 3D / Render / Obra` indicator on the right edge, but it was
driven by scroll progress across the full 320vh hero while the overlay content
fades out at the halfway point — so the last two stages were only ever reached
after the indicator had already gone invisible. It was removed rather than
retimed: the video itself already shows the sequence, and labelling it added a
second thing to read over the headline.
