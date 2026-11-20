

export const isYoutubeItem = (item) => {
  if (!item) return false;
  const type = item.play_url_type || item.stream_info?.play_url_type || '';
  if (String(type).toLowerCase() === 'youtube') return true;
  if (item.youtube_id || item.stream_info?.youtube_id) return true;
  return false;
};


export const extractYoutubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/(?:v|shorts|live)\/([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
};

export const getYoutubeVideoId = (item) => {
  if (!item) return null;
  const rawId = item.youtube_id || item.stream_info?.youtube_id;
  if (rawId && typeof rawId === 'string' && rawId.trim()) {
    return extractYoutubeId(rawId) || rawId.trim();
  }
  if (!isYoutubeItem(item)) return null;
  return (
    extractYoutubeId(item.youtube_url) ||
    extractYoutubeId(item?.play_url?.youtube?.url) ||
    null
  );
};

const sameContent = (a, b) =>
  !!a && !!b && !!a.content_id && a.content_id === b.content_id;


export const resolveYoutubeItem = (card, detailsData, getAllDetailsData) => {
  const allDetailsItem = getAllDetailsData?.data || getAllDetailsData;
  if (getYoutubeVideoId(allDetailsItem)) return allDetailsItem;
  if (getYoutubeVideoId(card)) return card;
  if (sameContent(card, detailsData) && getYoutubeVideoId(detailsData)) return detailsData;
  if (getYoutubeVideoId(detailsData)) return detailsData;
  return null;
};
