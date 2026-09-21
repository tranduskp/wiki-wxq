// Composition root of the Kỳ thủ page: the only place that knows which concrete classes make up this page.

import { must } from './core/dom.js';
import { HttpJsonSource } from './data/HttpJsonSource.js';
import { PlayerMapper } from './data/PlayerMapper.js';
import { JsonPlayerRepository } from './data/JsonPlayerRepository.js';
import { JsonKeywordRepository } from './data/JsonKeywordRepository.js';
import { HashRouter } from './services/HashRouter.js';
import { PlayerRoute } from './services/PlayerRoute.js';
import { PageTitle } from './services/PageTitle.js';
import { PlayerRoster } from './ui/PlayerRoster.js';
import { PlayerBanner } from './ui/PlayerBanner.js';
import { PlayerAbilities } from './ui/PlayerAbilities.js';
import { PlayerCardGrid } from './ui/PlayerCardGrid.js';
import { PlayerCardDetail } from './ui/PlayerCardDetail.js';
import { STRINGS as T } from './ui/strings.js';
import { PlayersApp } from './app/PlayersApp.js';

const SITE_NAME = 'Vương Giả Vạn Tượng Kỳ Quán';
const BASE = '../'; // this page lives one folder below the site root

const glossary = await new JsonKeywordRepository(new HttpJsonSource(BASE)).load();

const mapper = new PlayerMapper({
  imageRoot: `${BASE}data/anh/web/`,
  groupLabels: T.groupLabels,
  commonSource: T.commonSource,
});

const app = new PlayersApp({
  repository: new JsonPlayerRepository(new HttpJsonSource(BASE), mapper),
  router: new HashRouter(window, PlayerRoute),
  title: new PageTitle(document, SITE_NAME),
  status: must('#trang-thai'),
  ui: {
    stage: must('.profile'),
    roster: new PlayerRoster({
      viewport: must('#ky-thu'),
      wrapper: must('#ky-thu .swiper-wrapper'),
      prevButton: must('#ky-thu-truoc'),
      nextButton: must('#ky-thu-sau'),
      SwiperClass: window.Swiper ?? null, // loaded by a classic script tag in the page
    }),
    banner: new PlayerBanner({
      image: must('#anh-bia'),
      ghost: must('#ten-en'),
      name: must('#ten'),
      nameZh: must('#ten-zh'),
      quote: must('#cau-noi'),
      quoteZh: must('#cau-noi-zh'),
      skinName: must('#ten-trang-phuc'),
      skins: must('#trang-phuc'),
    }),
    abilities: new PlayerAbilities(must('#nang-luc')),
    cards: new PlayerCardGrid({ heading: must('#tieu-de-bai'), container: must('#bai-rieng') }),
    cardDetail: new PlayerCardDetail(must('#chi-tiet-bai'), glossary),
  },
});

app.start();
