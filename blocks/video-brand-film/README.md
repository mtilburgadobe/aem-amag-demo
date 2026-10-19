# video-brand-film

Custom **video** block. Purpose: Full-width 16:9 video player (Vimeo, YouTube or an mp4 file) that loads lazily: with a poster image the player loads and starts only after the play button is pressed; without one a placeholder with a play button shows and the player loads paused when the block scrolls into view. It never autoplays with sound, and the iframe gets the authored title. A statement heading authored as default content directly before the block is reabsorbed as the film headline.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row; a link (or bare URL) to the video — Vimeo, YouTube or .mp4/.webm; optional `<picture>` poster; optional `<p>` without a link = the accessible video title (iframe title).

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
