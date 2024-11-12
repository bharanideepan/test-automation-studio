import { faker } from '@faker-js/faker';
import { RecordingMetadata } from '../../src/models/interface/recording-meta';
import { S3Upload } from '../../src/models/interface/s3-upload';
import { DomEntity } from '../../src/models/interface/db-operations';

export const getUuid = () => faker.datatype.uuid();

export const setUuid = () => {
  data.dom_uuid = getUuid();
  data.recordingId = getUuid();
};

export const data = {
  'dom': '<html lang="en" class="js-focus-visible js" data-js-focus-visible=""><head>\n    \n      <meta charset="utf-8">\n      <meta name="viewport" content="width=device-width,initial-scale=1">\n      \n        <meta name="description" content="KServe Documentation">\n      \n      \n      \n        <link rel="canonical" href="https://kserve.io/website/0.8/admin/serverless/">\n      \n      <link rel="icon" href="../../images/favicon/favicon-32x32.png">\n      <meta name="generator" content="mkdocs-1.3.0, mkdocs-material-8.0.5">\n    \n    \n      \n        <title>Serverless installation - KServe Documentation Website</title>\n      \n    \n    \n      <link rel="stylesheet" href="../../assets/stylesheets/main.a617204b.min.css">\n      \n        \n        <link rel="stylesheet" href="../../assets/stylesheets/palette.9204c3b2.min.css">\n        \n      \n    \n    \n    \n      \n        \n        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">\n        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,700%7CRoboto+Mono&amp;display=fallback">\n        <style>:root{--md-text-font:"Roboto";--md-code-font:"Roboto Mono"}</style>\n      \n    \n    \n      <link rel="stylesheet" href="../../stylesheets/extra.css">\n    \n    <script>__md_scope=new URL("../..",location),__md_get=(e,_=localStorage,t=__md_scope)=>JSON.parse(_.getItem(t.pathname+"."+e)),__md_set=(e,_,t=localStorage,a=__md_scope)=>{try{t.setItem(a.pathname+"."+e,JSON.stringify(_))}catch(e){}}</script>\n    \n      \n\n    \n    \n  </head>\n  \n  \n    \n    \n    \n    \n    \n    <body dir="ltr" data-md-color-scheme="" data-md-color-primary="none" data-md-color-accent="none" data-new-gr-c-s-check-loaded="14.1091.0" data-gr-ext-installed="">\n  \n    \n    \n    <input class="md-toggle" data-md-toggle="drawer" type="checkbox" id="__drawer" autocomplete="off">\n    <input class="md-toggle" data-md-toggle="search" type="checkbox" id="__search" autocomplete="off">\n    <label class="md-overlay" for="__drawer"></label>\n    <div data-md-component="skip">\n      \n        \n        <a href="#serverless-installation-guide" class="md-skip">\n          Skip to content\n        </a>\n      \n    </div>\n    <div data-md-component="announce">\n      \n        <aside class="md-banner">\n          <div class="md-banner__inner md-grid md-typeset">\n            \n <h1>\n   <b>KServe v0.8 is Released</b>, <a href="/website/0.8/blog/articles/2022-02-18-KServe-0.8-release/">Read blog &gt;&gt;</a>\n </h1>\n\n          </div>\n        </aside>\n      \n    </div>\n    \n      <div data-md-component="outdated" hidden="">\n        <aside class="md-banner md-banner--warning">\n          \n        </aside>\n      </div>\n    \n    \n      \n\n  \n\n<header class="md-header md-header--lifted" data-md-component="header">\n  <nav class="md-header__inner md-grid" aria-label="Header">\n    <a href="../.." title="KServe Documentation Website" class="md-header__button md-logo" aria-label="KServe Documentation Website" data-md-component="logo">\n      \n  <img src="../../images/logo/kserve.png" alt="logo">\n\n    </a>\n    <label class="md-header__button md-icon" for="__drawer">\n      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"></path></svg>\n    </label>\n    <div class="md-header__title" data-md-component="header-title">\n      <div class="md-header__ellipsis">\n        <div class="md-header__topic">\n          <span class="md-ellipsis">\n            KServe Documentation Website\n          </span>\n        <div class="md-version"><button class="md-version__current" aria-label="Select version">0.8</button><ul class="md-version__list"><li class="md-version__item"><a href="https://kserve.github.io/website/0.9/" class="md-version__link">0.9</a></li><li class="md-version__item"><a href="https://kserve.github.io/website/0.8/" class="md-version__link">0.8</a></li><li class="md-version__item"><a href="https://kserve.github.io/website/0.7/" class="md-version__link">0.7</a></li><li class="md-version__item"><a href="https://kserve.github.io/website/master/" class="md-version__link">master</a></li></ul></div></div>\n        <div class="md-header__topic" data-md-component="header-topic">\n          <span class="md-ellipsis">\n            \n              Serverless installation\n            \n          </span>\n        </div>\n      </div>\n    </div>\n    \n    \n    \n      <label class="md-header__button md-icon" for="__search">\n        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"></path></svg>\n      </label>\n      <div class="md-search" data-md-component="search" role="dialog">\n  <label class="md-search__overlay" for="__search"></label>\n  <div class="md-search__inner" role="search">\n    <form class="md-search__form" name="search">\n      <input type="text" class="md-search__input" name="query" aria-label="Search" placeholder="Search" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" data-md-component="search-query" required="">\n      <label class="md-search__icon md-icon" for="__search">\n        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"></path></svg>\n        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"></path></svg>\n      </label>\n      <nav class="md-search__options" aria-label="Search">\n        \n        <button type="reset" class="md-search__icon md-icon" aria-label="Clear" tabindex="-1">\n          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>\n        </button>\n      </nav>\n      \n    </form>\n    <div class="md-search__output">\n      <div class="md-search__scrollwrap">\n        <div class="md-search-result" data-md-component="search-result">\n          <div class="md-search-result__meta">Type to start searching</div>\n          <ol class="md-search-result__list"></ol>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n    \n    \n      <div class="md-header__source">\n        <a href="https://github.com/kserve/website" title="Go to repository" class="md-source" data-md-component="source">\n  <div class="md-source__icon md-icon">\n    \n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M439.55 236.05 244 40.45a28.87 28.87 0 0 0-40.81 0l-40.66 40.63 51.52 51.52c27.06-9.14 52.68 16.77 43.39 43.68l49.66 49.66c34.23-11.8 61.18 31 35.47 56.69-26.49 26.49-70.21-2.87-56-37.34L240.22 199v121.85c25.3 12.54 22.26 41.85 9.08 55a34.34 34.34 0 0 1-48.55 0c-17.57-17.6-11.07-46.91 11.25-56v-123c-20.8-8.51-24.6-30.74-18.64-45L142.57 101 8.45 235.14a28.86 28.86 0 0 0 0 40.81l195.61 195.6a28.86 28.86 0 0 0 40.8 0l194.69-194.69a28.86 28.86 0 0 0 0-40.81z"></path></svg>\n  </div>\n  <div class="md-source__repository" data-md-state="done">\n    GitHub\n  <ul class="md-source__facts"><li class="md-source__fact md-source__fact--stars">59</li><li class="md-source__fact md-source__fact--forks">51</li></ul></div>\n</a>\n      </div>\n    \n  </nav>\n  \n    \n      \n<nav class="md-tabs" aria-label="Tabs" data-md-component="tabs">\n  <div class="md-tabs__inner md-grid">\n    <ul class="md-tabs__list">\n      \n        \n  \n  \n\n\n  <li class="md-tabs__item">\n    <a href="../.." class="md-tabs__link">\n      Home\n    </a>\n  </li>\n\n      \n        \n  \n  \n\n\n  \n  \n  \n    <li class="md-tabs__item">\n      <a href="../../get_started/" class="md-tabs__link">\n        Getting started\n      </a>\n    </li>\n  \n\n      \n        \n  \n  \n    \n  \n\n\n  \n  \n  \n    \n\n  \n  \n  \n    <li class="md-tabs__item">\n      <a href="./" class="md-tabs__link md-tabs__link--active">\n        Administration Guide\n      </a>\n    </li>\n  \n\n  \n\n      \n        \n  \n  \n\n\n  \n  \n  \n    \n\n  \n  \n  \n    \n\n  \n  \n  \n    <li class="md-tabs__item">\n      <a href="../../modelserving/control_plane/" class="md-tabs__link">\n        User Guide\n      </a>\n    </li>\n  \n\n  \n\n  \n\n      \n        \n  \n  \n\n\n  \n  \n  \n    <li class="md-tabs__item">\n      <a href="../../reference/api/" class="md-tabs__link">\n        API Reference\n      </a>\n    </li>\n  \n\n      \n        \n  \n  \n\n\n  \n  \n  \n    <li class="md-tabs__item">\n      <a href="../../developer/developer/" class="md-tabs__link">\n        Developer Guide\n      </a>\n    </li>\n  \n\n      \n        \n  \n  \n\n\n  \n  \n  \n    \n\n  \n  \n  \n    <li class="md-tabs__item">\n      <a href="../../blog/articles/2022-02-18-KServe-0.8-release/" class="md-tabs__link">\n        Blog\n      </a>\n    </li>\n  \n\n  \n\n      \n        \n  \n  \n\n\n  \n  \n  \n    <li class="md-tabs__item">\n      <a href="../../community/adopters/" class="md-tabs__link">\n        Community\n      </a>\n    </li>\n  \n\n      \n    </ul>\n  </div>\n</nav>\n    \n  \n</header>\n    \n <div class="md-dialog" data-md-component="dialog">\n      <div class="md-dialog__inner md-typeset"></div>\n    </div>\n    <script id="__config" type="application/json">{"base": "../..", "features": ["navigation.tabs", "navigation.tracking", "navigation.tabs.sticky", "navigation.top"], "search": "../../assets/javascripts/workers/search.cefbb252.min.js", "translations": {"clipboard.copied": "Copied to clipboard", "clipboard.copy": "Copy to clipboard", "search.config.lang": "en", "search.config.pipeline": "trimmer, stopWordFilter", "search.config.separator": "[\\\\s\\\\-]+", "search.placeholder": "Search", "search.result.more.one": "1 more on this page", "search.result.more.other": "# more on this page", "search.result.none": "No matching documents", "search.result.one": "1 matching document", "search.result.other": "# matching documents", "search.result.placeholder": "Type to start searching", "search.result.term.missing": "Missing", "select.version.title": "Select version"}, "version": {"provider": "mike"}}</script>\n    \n    \n      <script src="../../assets/javascripts/bundle.a5f8ea78.min.js"></script>\n      \n    \n  \n</body><grammarly-desktop-integration data-grammarly-shadow-root="true"></grammarly-desktop-integration></html>',
  'domTimeStamp': new Date(),
  'recordingId': '',
  'baseURI': 'https://kserve.github.io/website/0.8/admin/serverless/',
  'dom_uuid': '',
  'width': 1680,
  'height': 479
};

export const getRecordingMetadata = (): RecordingMetadata => ({
  recordingId: data.recordingId,
  domTimeStamp: data.domTimeStamp,
  tableName: '',
  isScreenshot: false,
  dom_uuid: data.dom_uuid,
  height: data.height,
  width: data.width
});

export const getDomEntity = (): DomEntity => ({
  recordingId: data.recordingId,
  domPath: data.dom_uuid,
  domTimeStamp: new Date(),
  dom: data.dom,
  baseURI: data.baseURI,
  recordingMetaData: getRecordingMetadata(),
  dom_uuid: data.dom_uuid,
  height: data.height,
  width: data.width
});

export const getS3UploadDomData = (): S3Upload => ({
  isDom: true,
  uploadContent: data.dom,
  resourceUrlHash: getUuid(),
  recordingMeta: getRecordingMetadata(),
  contentType: 'text/html'
});

export const getS3UploadScreenshotData = (): S3Upload => ({
  isDom: false,
  uploadContent: data.dom,
  resourceUrlHash: getUuid(),
  recordingMeta: {
    recordingId: data.recordingId,
    domTimeStamp: data.domTimeStamp,
    tableName: '',
    isScreenshot: true,
    dom_uuid: data.dom_uuid,
  },
  contentType: 'plaintext'
});

export const getS3UploadData = (): S3Upload => ({
  isDom: false,
  uploadContent: data.dom,
  resourceUrlHash: getUuid(),
  recordingMeta: {
    dom_uuid: data.dom_uuid,
  },
  contentType: 'plaintext'
});
