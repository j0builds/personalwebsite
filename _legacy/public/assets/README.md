# Media Assets

Place your media files in the appropriate folders:

## Images
- Put image files (jpg, png, gif, webp, etc.) in `images/` folder
- Reference them in your pages like: `/assets/images/your-image.jpg`

## Videos
- Put video files (mp4, webm, etc.) in `videos/` folder
- Reference them in your pages like: `/assets/videos/your-video.mp4`

## Example Usage in App.jsx

### Adding an Image:
```javascript
{
  title: "My Page",
  content: ["Some text..."],
  images: [
    {
      src: "/assets/images/photo1.jpg",
      alt: "Description of photo",
      caption: "Optional caption text"
    }
  ],
  videos: []
}
```

### Adding a Local Video:
```javascript
{
  title: "My Page",
  content: ["Some text..."],
  images: [],
  videos: [
    {
      src: "/assets/videos/my-video.mp4",
      poster: "/assets/images/video-thumbnail.jpg", // Optional thumbnail
      caption: "Optional caption"
    }
  ]
}
```

### Adding YouTube/Vimeo:
```javascript
{
  title: "My Page",
  content: ["Some text..."],
  images: [],
  videos: [
    {
      type: "youtube",
      src: "https://www.youtube.com/embed/VIDEO_ID",
      title: "Video title",
      caption: "Optional caption"
    }
  ]
}
```

