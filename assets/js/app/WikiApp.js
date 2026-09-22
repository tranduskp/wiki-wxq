import { Route } from '../services/Route.js';
import { STRINGS as T } from '../ui/strings.js';

/**
 * Coordinates the lookup page. It owns the state (active kind, selected card, sheet) and turns what the
 * components report into what the other components show. Every collaborator is injected, so the app
 * itself holds no DOM lookups, no fetch calls and no URL parsing.
 */
export class WikiApp {
  #catalog = null;
  #views = new Map();
  #kindId = null;
  #card = null;
  #variant = 0;
  #sheetOpen = false;
  #lastTrigger = null;
  #wired = false;

  /**
   * @param {object} deps
   * @param {import('../data/CatalogRepository.js').CatalogRepository} deps.repository
   * @param {import('../services/HashRouter.js').HashRouter} deps.router
   * @param {import('../services/CardSearch.js').CardSearch} deps.search
   * @param {import('../services/MediaWatcher.js').MediaWatcher} deps.phone
   * @param {import('../services/ClipboardService.js').ClipboardService} deps.clipboard
   * @param {import('../services/PageTitle.js').PageTitle} deps.title
   * @param {import('../services/GlobalShortcuts.js').GlobalShortcuts} deps.shortcuts
   * @param {(kind: object, onSelect: Function) => object} deps.createView  builds the grid for one card kind
   * @param {Location} deps.location  read only to tell a file:// page from a served one
   * @param {object} deps.ui  tabs, searchBox, rail, list, viewer, sheet
   */
  constructor(deps) {
    this.repository = deps.repository;
    this.router = deps.router;
    this.search = deps.search;
    this.phone = deps.phone;
    this.clipboard = deps.clipboard;
    this.title = deps.title;
    this.shortcuts = deps.shortcuts;
    this.createView = deps.createView;
    this.ui = deps.ui;
    this.location = deps.location;
  }

  async start() {
    try {
      this.#catalog = await this.repository.load();
    } catch (error) {
      console.error(error);
      const onFile = this.location.protocol === 'file:';
      this.ui.list.showError(onFile ? T.loadFailedFile : T.loadFailedNetwork, () => this.start());
      return;
    }
    this.ui.tabs.render(this.#catalog.kinds);
    this.#wire();
    this.#applyRoute();
  }

  /* ---------- wiring (once) ---------- */

  #wire() {
    if (this.#wired) return;
    this.#wired = true;
    const { tabs, searchBox, rail, list, viewer, sheet } = this.ui;

    tabs.on('select', (kindId) => this.#selectKind(kindId));
    searchBox.on('input', (text) => this.#search(text));
    rail.on('jump', (section) => list.jumpTo(section));
    list.on('scroll', () => this.#syncActiveChapter());
    viewer.on('variant', (index) => this.#pickVariant(index));
    viewer.on('copy', () => this.#copyLink());
    sheet.on('close', () => this.#closeSheet());

    this.shortcuts.on('escape', () => this.#closeSheet());
    this.shortcuts.on('focus-search', (event) => {
      if (this.#sheetOpen) return;
      event.preventDefault();
      searchBox.focus();
    });

    this.router.onChange(() => this.#applyRoute());
    this.phone.onChange(() => this.#applyRoute());
  }

  /* ---------- routing ---------- */

  #applyRoute() {
    const route = this.router.current();
    const kindId = this.#catalog.resolveKindId(route.kindId);
    const kindChanged = kindId !== this.#kindId;
    this.#kindId = kindId;
    if (kindChanged) this.#mountKind();

    const card = route.cardId ? this.#catalog.findCard(kindId, route.cardId) : null;
    this.#sheetOpen = Boolean(card) && this.phone.matches;

    if (card) {
      this.#variant = Math.min(route.variant, card.variantCount - 1);
      this.#showCard(card);
    } else if (!this.phone.matches && (kindChanged || this.#card?.kindId !== kindId)) {
      // Wide screens always show a card; default to the first one without touching the URL.
      const first = this.#view.visibleTiles[0]?.card;
      if (first) {
        this.#variant = 0;
        this.#showCard(first);
      }
    }
    this.#applySheet();
    this.ui.tabs.setActive(kindId);
    this.ui.list.setLabelledBy(this.ui.tabs.tabId(kindId));
  }

  #navigate(route, options) {
    this.router.navigate(route, options);
  }

  /* ---------- the current kind ---------- */

  get #kind() {
    return this.#catalog.kind(this.#kindId);
  }

  get #view() {
    let view = this.#views.get(this.#kindId);
    if (!view) {
      view = this.createView(this.#kind, (card, tile) => this.#chooseCard(card, tile));
      this.#views.set(this.#kindId, view);
    }
    return view;
  }

  #mountKind() {
    const view = this.#view;
    this.ui.list.show(view);
    this.ui.rail.show(view);
    this.title.forKind(this.#kind);
    this.#applyFilter();
    this.#syncActiveChapter();
  }

  #selectKind(kindId) {
    if (kindId !== this.#kindId) this.#navigate(new Route(kindId), { push: true });
  }

  /* ---------- search ---------- */

  #search(text) {
    this.search.setQuery(text);
    this.#applyFilter();
  }

  #applyFilter() {
    const view = this.#view;
    const shown = view.applyFilter(this.search);
    this.ui.rail.refresh(view);
    this.ui.list.clearEmpty();
    this.ui.list.showSummary(this.#kind, shown, this.search);
    if (shown === 0) this.ui.list.showEmpty(() => this.ui.searchBox.clear());
  }

  #syncActiveChapter() {
    this.ui.rail.setActive(this.#view, this.ui.list.activeSection());
  }

  /* ---------- the selected card ---------- */

  #chooseCard(card, tile) {
    this.#lastTrigger = tile;
    const route = new Route(card.kindId, card.id);
    if (this.phone.matches) this.#navigate(route, { push: !this.#sheetOpen, sheet: true });
    else this.#navigate(route);
  }

  #showCard(card) {
    if (this.#card) this.#views.get(this.#card.kindId)?.tileFor(this.#card)?.setSelected(false);
    this.#card = card;
    this.#views.get(card.kindId)?.tileFor(card)?.setSelected(true);

    this.ui.viewer.render(card, this.#kind, this.#variant);
    this.title.forCard(card, this.#kind);
  }

  #pickVariant(index) {
    if (!this.#card) return;
    this.#variant = index;
    this.#navigate(new Route(this.#card.kindId, this.#card.id, index), {});
  }

  async #copyLink() {
    this.ui.viewer.showCopyResult(await this.clipboard.copy(this.router.url));
  }

  /* ---------- bottom sheet ---------- */

  #applySheet() {
    this.ui.sheet.apply(this.#sheetOpen, () => (this.#lastTrigger?.isConnected ? this.#lastTrigger : this.#view.tileFor(this.#card)));
  }

  #closeSheet() {
    if (!this.#sheetOpen) return;
    if (this.router.atSheetEntry) this.router.back();
    else this.#navigate(new Route(this.#kindId));
  }
}
