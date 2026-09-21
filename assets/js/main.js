// Composition root: the only place that knows which concrete classes make up the app.

import { must } from './core/dom.js';
import { HttpJsonSource } from './data/HttpJsonSource.js';
import { LocalImagePolicy } from './data/LocalImagePolicy.js';
import { CardMapper } from './data/CardMapper.js';
import { JsonCatalogRepository } from './data/JsonCatalogRepository.js';
import { JsonKeywordRepository } from './data/JsonKeywordRepository.js';
import { HashRouter } from './services/HashRouter.js';
import { TextNormalizer } from './services/TextNormalizer.js';
import { CardSearch } from './services/CardSearch.js';
import { ClipboardService } from './services/ClipboardService.js';
import { MediaWatcher } from './services/MediaWatcher.js';
import { PageTitle } from './services/PageTitle.js';
import { GlobalShortcuts } from './services/GlobalShortcuts.js';
import { TabBar } from './ui/TabBar.js';
import { SearchBox } from './ui/SearchBox.js';
import { ChapterRail } from './ui/ChapterRail.js';
import { CardList } from './ui/CardList.js';
import { KindView } from './ui/KindView.js';
import { CardTile } from './ui/CardTile.js';
import { CardImageFrame } from './ui/CardImageFrame.js';
import { VariantPicker } from './ui/VariantPicker.js';
import { CardInfoPanel } from './ui/CardInfoPanel.js';
import { InfoTabs } from './ui/InfoTabs.js';
import { SkillPane } from './ui/SkillPane.js';
import { StatsPane } from './ui/StatsPane.js';
import { CardViewer } from './ui/CardViewer.js';
import { BottomSheet } from './ui/BottomSheet.js';
import { WikiApp } from './app/WikiApp.js';

const SITE_NAME = 'Vương Giả Vạn Tượng Kỳ Quán';
const PHONE_QUERY = '(max-width: 819px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const imagePolicy = await LocalImagePolicy.load(new HttpJsonSource(''));
const glossary = await new JsonKeywordRepository(new HttpJsonSource(''), imagePolicy).load();
const phone = new MediaWatcher(PHONE_QUERY);
const reduceMotion = new MediaWatcher(REDUCED_MOTION_QUERY);

const list = new CardList({
  scroller: must('#danh-sach'),
  container: must('#cac-chuong'),
  status: must('#ket-qua'),
  reduceMotion,
});

const viewer = new CardViewer({
  info: new CardInfoPanel({
    name: must('#ten'),
    nameZh: must('#ten-zh'),
    meta: must('#meta'),
    description: must('#mo-ta'),
    glossary,
    tabs: new InfoTabs({
      root: must('#tab-thong-tin'),
      panes: { 'mo-ta': must('#mo-ta'), 'ky-nang': must('#ky-nang'), 'chi-so': must('#chi-so') },
    }),
    skillPane: new SkillPane({ container: must('#ky-nang'), glossary }),
    statsPane: new StatsPane(must('#chi-so')),
  }),
  frame: new CardImageFrame({
    frame: must('#khung'),
    img: must('#anh'),
    retryButton: must('#thu-lai'),
    imagePolicy,
  }),
  variants: new VariantPicker(must('#bien-the')),
  pager: must('#chuyen-ban'),
  prevButton: must('#truoc'),
  nextButton: must('#sau'),
  copyButton: must('#chep-lien-ket'),
  toast: must('#thong-bao'),
});

const sheet = new BottomSheet({
  panel: must('#chi-tiet'),
  scrim: must('#man-che'),
  closeButton: must('#dong'),
  backgroundElements: [must('#danh-sach'), must('#chuong'), must('.toolbar'), must('.topbar')],
  phone,
});

const app = new WikiApp({
  repository: new JsonCatalogRepository(new HttpJsonSource(''), new CardMapper(imagePolicy), imagePolicy),
  router: new HashRouter(),
  search: new CardSearch(new TextNormalizer()),
  phone,
  clipboard: new ClipboardService(),
  title: new PageTitle(document, SITE_NAME),
  shortcuts: new GlobalShortcuts(),
  location: window.location,
  createView: (kind, onSelect) => new KindView(kind, (card) => new CardTile(card, { onSelect })),
  ui: {
    tabs: new TabBar(must('#loai'), 'cac-chuong'),
    searchBox: new SearchBox({ wrap: must('.search'), input: must('#tim-kiem'), clearButton: must('#xoa-tim') }),
    rail: new ChapterRail(must('#chuong')),
    list,
    viewer,
    sheet,
  },
});

app.start();
