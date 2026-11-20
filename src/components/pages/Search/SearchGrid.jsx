import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { contentDetails } from '../../../redux/reducer/detailsReducer.jsx';
import { getupdateSearch } from '../../../redux/reducer/SearchReducer.jsx';
import SearchCard from './SearchCard.jsx';
import up_Arrow from '../../../assets/images/icon_upArrow.svg';
import down_Arrow from '../../../assets/images/icon_downArrow.svg';
import './SearchGrid.scss';

const SearchGrid = ({ data = [], searchvalue = '', count, totalCount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const { ref, focusKey } = useFocusable();
  const [focusedIndex, setFocusedIndex] = useState(1);
  const [page, setPage] = useState(1);

  const displayCount =
    count !== undefined && count !== null
      ? count
      : totalCount !== undefined && totalCount !== null
      ? totalCount
      : data?.length || 0;

  const totalItems = data?.length || 0;
  const totalRows = Math.ceil(totalItems / 4);
  const currentRow = Math.ceil(focusedIndex / 4);
  const showUpArrow = totalRows > 1 && currentRow > 1;
  const showDownArrow = totalRows > 1 && currentRow < totalRows;

  const onCardFocus = useCallback(
    (layout, itemIndex) => {
      setFocusedIndex(itemIndex);

      if (scrollRef.current) {
        const row = Math.ceil(itemIndex / 4);
        const isSmallScreen = window.innerWidth <= 1300;
        const rowHeight = isSmallScreen ? 215 : 312;

        // When in row 1, scroll to very top. For subsequent rows, scroll down row-by-row
        const targetScroll = row <= 1 ? 0 : (row - 1) * rowHeight;
        scrollRef.current.scrollTop = targetScroll;
      }

      // Infinite scroll / pagination
      if (itemIndex > 12 * page && searchvalue && searchvalue.trim() !== '') {
        dispatch(getupdateSearch({ search: searchvalue, count: page }));
        setPage((prev) => prev + 1);
      }
    },
    [page, searchvalue, dispatch]
  );

  const renderDetails = (item) => {
    dispatch(contentDetails(item));

    const theme = item?.theme || item?.content_type;
    const catFriendlyId = item?.catalog_object?.friendly_id || item?.catalog_id;
    const itemFriendlyId = item?.friendly_id || item?.content_id;

    if (theme === 'livetv') {
      navigate(
        `/moviesdetails/${theme}/${catFriendlyId}/${itemFriendlyId}/${item.content_id}/${item.catalog_id}`
      );
    } else if (
      theme === 'show_episode' ||
      theme === 'episode' ||
      theme === 'videolist'
    ) {
      const showFriendlyId =
        item?.show_object?.friendly_id ||
        item?.catalog_object?.friendly_id ||
        catFriendlyId;
      navigate(
        `/showsdetails/${theme}/${showFriendlyId}/${itemFriendlyId}/${item?.content_id}/${item?.catalog_id}`
      );
    } else if (theme === 'movie' || theme === 'video') {
      navigate(
        `/moviesdetails/${theme}/${catFriendlyId}/${itemFriendlyId}/${item.content_id}/${item.catalog_id}`
      );
    } else if (theme === 'show') {
      if (item?.last_episode) {
        navigate(
          `/showsdetails/${theme}/${catFriendlyId}/${itemFriendlyId}/${item?.last_episode?.content_id}/${item?.last_episode.catalog_id}`
        );
      } else {
        navigate(
          `/showsdetails/${theme}/${catFriendlyId}/${itemFriendlyId}/${item?.content_id}/${item?.catalog_id}`
        );
      }
    } else if (theme === 'catalog_list') {
      navigate(`/catalog/${itemFriendlyId}`);
    } else {
      if (item?.show_object || item?.episode_friendly_id) {
        const showId = item?.show_object?.friendly_id || catFriendlyId;
        navigate(
          `/showsdetails/episode/${showId}/${itemFriendlyId}/${item?.content_id}/${item?.catalog_id}`
        );
      } else {
        navigate(
          `/moviesdetails/movie/${catFriendlyId}/${itemFriendlyId}/${item?.content_id}/${item?.catalog_id}`
        );
      }
    }
  };

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowRight') {
        if (focusedIndex === totalItems || focusedIndex % 4 === 0) {
          event.stopPropagation();
        }
      }
    },
    [focusedIndex, totalItems]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="search-grid-wrapper">
        <div className="search-results-header row-title">
          Search Results ({displayCount})
        </div>
        <div ref={scrollRef} className="search-grid-scroll-box">
          <div className="search-grid-content">
            {data &&
              data.map((item, i) => (
                <SearchCard
                  key={item?.content_id || item?.id || i}
                  index={i + 1}
                  data={item}
                  onFocus={onCardFocus}
                  onEnterPress={renderDetails}
                  onClick={renderDetails}
                />
              ))}
          </div>
        </div>

        {(showUpArrow || showDownArrow) && (
          <div className="search-arrow-container">
            {showUpArrow && (
              <img
                className="arrowbtn"
                src={up_Arrow}
                alt="Up"
                onClick={() => {
                  if (scrollRef.current) scrollRef.current.scrollTop -= 260;
                }}
              />
            )}
            {showDownArrow && (
              <img
                className="arrowbtn"
                src={down_Arrow}
                alt="Down"
                onClick={() => {
                  if (scrollRef.current) scrollRef.current.scrollTop += 260;
                }}
              />
            )}
          </div>
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default SearchGrid;

