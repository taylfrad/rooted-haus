# Gallery

Every gallery photo is a square or rectangle with gently rounded corners (no arches or circles); only the size changes.

The gallery is a mosaic: photos of different sizes that fit together like a photo wall. Each photo is one entry in the editing panel under "Gallery".

| Setting | What it does |
|---|---|
| Photo | The picture. Leave it empty to show a placeholder. |
| Describe the photo | A short description for people who use screen readers, and shown if the picture fails to load. |
| Group | Used by the filter buttons above the gallery (color, cut, scalp, and so on). |
| Size | **small** = 1 square, **wide** = 2 across, **tall** = 2 down, **large** = 2 x 2. |
| Order | 1 shows first. |

## Choosing sizes

- Pick the size to suit the photo: portraits suit **tall**, full-length or group shots suit **large**, landscapes and studio shots suit **wide**. A photo is cropped to the middle of its frame, so keep the subject near the center.
- On a big screen the gallery is 4 squares across; on tablets and phones it is 2. Wide and large photos fill a whole row on a phone.
- **For a neat grid with no gaps, keep the total a multiple of 4**, counting small = 1, wide or tall = 2, large = 4. The current 16 photos add up to 32. If a gap appears at the end, change one photo from small to wide (or back).
- A good mix is about half small, a few wide and tall, and one or two large. Too many large photos in a row makes the page feel heavy.
- The grid fills gaps automatically, so a small photo may sit beside a large one even if it comes later in the order.

## Photos

- Use the original photo from the phone or camera; the site makes smaller versions for each screen.
- Photos are stored in the repo under `web/src/assets/photos/` (gallery photos in `rituals/`). The site adds the warm tone from the brand guide, so avoid heavy filters before uploading.
- Photo uploads from the panel have **not been tested yet**. Pages CMS should save the file into that folder and write a path like `../../assets/photos/rituals/img-0142.jpg` into the entry. If the panel saves it somewhere else, the build will fail on the missing file; tell your web person and they can adjust the panel's media setting.

## Not built yet

Clicking a photo does not open a larger view. A lightbox (PhotoSwipe) can be added once the real photos are in.
