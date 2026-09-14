// Extracts a YouTube video id from the various URL shapes people paste
// (watch?v=, youtu.be/, shorts/, embed/) so we can build a reliable
// embed src regardless of what was pasted into the admin.

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '');

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1);
    return YOUTUBE_ID_RE.test(id) ? id : null;
  }

  if (host === 'youtube.com' || host === 'music.youtube.com') {
    if (u.pathname === '/watch') {
      const id = u.searchParams.get('v');
      return id && YOUTUBE_ID_RE.test(id) ? id : null;
    }
    const match = u.pathname.match(/^\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }

  return null;
}

export function getYoutubeEmbedUrl(url: string | null | undefined): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
