// Import React!
import React from 'react';
import ReactDOM from 'react-dom';
import CommonToolbar from '../../components/toolbar/common-toolbar'
import Logo from "../../components/logo";
import SearchViewPanel from './main-panel'

import '../../css/layout.css';
import '../../css/toolbar.css';
import '../../css/search.css';

export const repo = window.search ? window.search.pageOptions.repo : '';
export const keyword = window.search ? window.search.pageOptions.keyword : '';
export const results = window.search ? window.search.pageOptions.results : '';
export const total = window.search ? window.search.pageOptions.total : '';
export const hasMore = window.search ? window.search.pageOptions.hasMore : '';
export const currentPage = window.search ? window.search.pageOptions.currentPage : '';
export const prevPage = window.search ? window.search.pageOptions.prevPage : '';
export const nextPage = window.search ? window.search.pageOptions.nextPage : '';
export const perPage = window.search ? window.search.pageOptions.perPage : '';
export const searchRepo = window.search ? window.search.pageOptions.searchRepo : '';
export const searchFtypes = window.search ? window.search.pageOptions.searchFtypes : '';
export const customFtypes = window.search ? window.search.pageOptions.customFtypes : '';
export const inputFileexts = window.search ? window.search.pageOptions.inputFileexts : '';
export const error = window.search ? window.search.pageOptions.error : '';
export const enableThumbnail = window.search ? window.search.pageOptions.enableThumbnail : '';
export const thumbnailSize = window.search ? window.search.pageOptions.thumbnailSize : '';
export const dateFrom = window.search ? window.search.pageOptions.dateFrom : '';
export const dateTo = window.search ? window.search.pageOptions.dateTo : '';
export const sizeFromMb = window.search ? window.search.pageOptions.sizeFromMb : '';
export const sizeToMb = window.search ? window.search.pageOptions.sizeToMb : '';
export const customSearch = window.search ? window.search.pageOptions.customSearch : '';


class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResponse: {
        repo: repo,
        keyword: repo,
        results: results,
        total: total,
        hasMore: hasMore,
        currentPage: currentPage,
        prevPage: prevPage,
        nextPage: nextPage,
        perPage: perPage,
        searchRepo: searchRepo,
        searchFtypes: searchFtypes,
        customFtypes: customFtypes,
        inputFileexts: inputFileexts,
        error: error,
        enableThumbnail: enableThumbnail,
        thumbnailSize: thumbnailSize,
        dateFrom: dateFrom,
        dateTo: dateTo,
        sizeFromMb: sizeFromMb,
        sizeToMb: sizeToMb,
        customSearch: customSearch,
      }
    };
  }

  render() {
    return (
      <div id="main">
        <div style={{width: '100%'}}>
          <div className="main-panel-north border-left-show">
            <Logo/>
            <CommonToolbar/>
          </div>
          <div>
            <SearchViewPanel searchResponse={this.state.searchResponse}/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <SearchView/>,
  document.getElementById('wrapper')
);


