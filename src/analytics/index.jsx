
export const playbackstart=(value,source,tray_name,video_name,show_name,series_name,genre,video_language,subtitles,chromecast,quality,consumption_type,content_type,content_value,full_screen,video_id,content_provider,u_id)=>{
    firebase.analytics().logEvent("playback_start",{
    value,
    source,
    tray_name,
    video_name,
    show_name,
    series_name,
    genre,
    video_language,
    subtitles,
    chromecast,
    quality, 
    consumption_type,
    content_type,
    content_value,
    full_screen,
    video_id,
    content_provider,
    u_id
  })
}
export const playbackend=(value,source,tray_name,video_name,show_name,series_name,genre,video_language,subtitles,chromecast,quality,consumption_type,content_type,content_value,full_screen,video_id,content_provider,u_id)=>{
  firebase.analytics().logEvent("playback_end",{
  value,
  source,
  tray_name,
  video_name,
  show_name,
  series_name,
  genre,
  video_language,
  subtitles,
  chromecast,
  quality, 
  consumption_type,
  content_type,
  content_value,
  full_screen,
  video_id,
  content_provider,
  u_id
})
}

export const watchlater=(content_type,video_name,genre,video_language,video_id,u_id)=>{
    firebase.analytics().logEvent("watch_later",{
    content_type,
    video_name,
    genre,
    video_language,
    video_id,
    u_id
  })
  }

export const searchResult=(video_name,keyword,clicked,content_type,content_value)=>{
  firebase.analytics().logEvent("search_result_clicked",{
  video_name,
  keyword,
  clicked,
  content_type,
  content_value
})

}

export const Loginsuccess = (method, u_id) => {
    firebase.analytics().logEvent('login_sucess', {
      method,
      u_id
    });
  };

  export const artwork_tapped=(source,video_name,tray_name,position_within_tray,content_type,video_id)=>{
    firebase.analytics().logEvent("artwork_tapped",{
      source,
      video_name,
      tray_name,
      position_within_tray,
      content_type,
      video_id
  })
  }