# InteractiveWorld

Project page for **InteractiveWorld: A Verifiable Human-Centric Environment for Building Better Interactive MLLM
Assistants**.

InteractiveWorld simulates a human and a wearable AI assistant interacting in the physical world: the assistant sees
through the human's eyes and talks, the human decides and acts, and the world responds. InteractiveBench builds a
closed-loop benchmark of 120 multi-turn tasks on top of it.

## Viewing the page

The site is static HTML, CSS and JavaScript with pre-rendered videos; there is no build step and nothing is loaded
from the network. Open `index.html` in a browser, or serve the folder locally:

```
python3 -m http.server 8000
```

and visit http://localhost:8000.

## Contents

```
index.html        the page
assets/           styles, scripts, demo timelines and fonts
media/            first-person videos rendered in InteractiveWorld, posters and short clips
```

All videos are rendered simulations, not real footage. The fonts (Inter and Newsreader) are licensed under the SIL
Open Font License 1.1; see `assets/fonts/OFL.txt`.

## Citation

```
@misc{wang2026interactiveworld,
  title   = {InteractiveWorld: A Verifiable Human-Centric Environment for Building Better Interactive MLLM Assistants},
  author  = {Wang, Qinsi and Wen, Wei and Zhou, Chong and Suri, Saksham and Liu, Zechun and Wu, Lemeng and
             Li, Hai Helen and Chen, Yiran and Krishnamoorthi, Raghuraman and Qian, Qi},
  year    = {2026}
}
```
