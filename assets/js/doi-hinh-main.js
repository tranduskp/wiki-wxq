// Composition root of the Đội hình page: the only place that knows which concrete classes make up this page.

import { must } from './core/dom.js';
import { HttpJsonSource } from './data/HttpJsonSource.js';
import { LocalImagePolicy } from './data/LocalImagePolicy.js';
import { CardMapper } from './data/CardMapper.js';
import { JsonCatalogRepository } from './data/JsonCatalogRepository.js';
import { PlayerMapper } from './data/PlayerMapper.js';
import { JsonPlayerRepository } from './data/JsonPlayerRepository.js';
import { JsonLineupRepository } from './data/JsonLineupRepository.js';
import { JsonKeywordRepository } from './data/JsonKeywordRepository.js';
import { HashRouter } from './services/HashRouter.js';
import { TextNormalizer } from './services/TextNormalizer.js';
import { LineupSearch } from './services/LineupSearch.js';
import { ClipboardService } from './services/ClipboardService.js';
import { MediaWatcher } from './services/MediaWatcher.js';
import { PageTitle } from './services/PageTitle.js';
import { GlobalShortcuts } from './services/GlobalShortcuts.js';
import { TabBar } from './ui/TabBar.js';
import { SearchBox } from './ui/SearchBox.js';
import { LineupList } from './ui/LineupList.js';
import { LineupDetail } from './ui/LineupDetail.js';
import { BottomSheet } from './ui/BottomSheet.js';
import { STRINGS as T } from './ui/strings.js';
import { LineupApp } from './app/LineupApp.js';

const SITE_NAME = 'Vương Giả Vạn Tượng Kỳ Quán';
const PHONE_QUERY = '(max-width: 819px)';
const BASE = '../'; // this page lives one folder below the site root
const IMAGE_ROOT = `${BASE}data/anh/web/`;

const source = new HttpJsonSource(BASE);
const imagePolicy = await LocalImagePolicy.load(source, IMAGE_ROOT);
const glossary = await new JsonKeywordRepository(source, imagePolicy).load();
const phone = new MediaWatcher(PHONE_QUERY);
const roleIcons = Object.fromEntries([1, 2, 3].map((n) => [n, `${IMAGE_ROOT}doi-hinh/icon/hero-icon${n}.webp`]));

const list = new LineupList({
  scroller: must('#danh-sach'),
  list: must('#ds-doi-hinh'),
  status: must('#ket-qua'),
  moreButton: must('#xem-them'),
  roleIcons,
});

const detail = new LineupDetail({
  name: must('#ten'),
  nameZh: must('#ten-zh'),
  meta: must('#meta'),
  body: must('#noi-dung'),
  scroller: must('#chi-tiet'),
  roleIcons,
  glossary,
});

const sheet = new BottomSheet({
  panel: must('#chi-tiet'),
  scrim: must('#man-che'),
  closeButton: must('#dong'),
  backgroundElements: [must('#danh-sach'), must('.toolbar'), must('.topbar')],
  phone,
});

const app = new LineupApp({
  repository: new JsonLineupRepository({
    source,
    catalogRepository: new JsonCatalogRepository(source, new CardMapper(imagePolicy), imagePolicy),
    playerRepository: new JsonPlayerRepository(
      source,
      new PlayerMapper({ imageRoot: IMAGE_ROOT, groupLabels: T.groupLabels, commonSource: T.commonSource }),
    ),
    groupMeta: T.lineupGroups,
  }),
  router: new HashRouter(),
  search: new LineupSearch(new TextNormalizer()),
  phone,
  clipboard: new ClipboardService(),
  shortcuts: new GlobalShortcuts(),
  title: new PageTitle(document, SITE_NAME),
  location: window.location,
  ui: {
    tabs: new TabBar(must('#nhom'), 'ds-doi-hinh-vung'),
    searchBox: new SearchBox({ wrap: must('.search'), input: must('#tim-kiem'), clearButton: must('#xoa-tim') }),
    list,
    detail,
    sheet,
    toast: must('#thong-bao'),
  },
});

app.start();
