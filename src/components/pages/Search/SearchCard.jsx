import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import ph_web_69 from '../../../assets/images/ph_web_169.svg';
import tag_premium from '../../../assets/images/tag_premium.svg';

const SearchCard = ({ data, index, onFocus, onEnterPress, onClick }) => {
  const { ref, focused } = useFocusable({
    onFocus: (layout) => {
      if (onFocus) {
        onFocus(layout, index);
      }
    },
    onEnterPress: () => {
      if (onEnterPress) {
        onEnterPress(data);
      }
    },
  });

  const imageOnError16x9 = (e) => {
    e.currentTarget.src = ph_web_69;
  };

  const title =
    data?.display_title ||
    data?.title ||
    data?.name ||
    data?.catalog_object?.title ||
    "";

  const thumbnail =
    data?.thumbnails?.medium_16_9?.url ||
    data?.thumbnails?.l_medium?.url ||
    data?.thumbnails?.high_16_9?.url ||
    ph_web_69;

  return (
    <div
      ref={ref}
      className={`search-card-item ${focused ? 'search-card-focused' : ''}`}
      onClick={() => onClick && onClick(data)}
      data-index={index}
    >
      <div className="search-card-thumbnail-box">
        {data?.access_control?.is_free === false && (
          <img className="search-card-premium-tag" src={tag_premium} alt="Premium" />
        )}
        <img
          src={thumbnail}
          onError={imageOnError16x9}
          className="search-card-img"
          alt={title}
          loading="lazy"
        />
      </div>
      <div className="search-card-title-box">
        <span className="search-card-title" title={title}>
          {title}
        </span>
      </div>
    </div>
  );
};

export default SearchCard;

