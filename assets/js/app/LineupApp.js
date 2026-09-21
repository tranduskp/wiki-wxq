import { Route } from '../services/Route.js';
import { STRINGS as T } from '../ui/strings.js';

/**
 * Coordinates the lineup page: the active group (tab), the search filter, the chosen lineup and the bottom sheet
 * on phones. The URL is `#/<nhom>/<ma-doi-hinh>`. Every collaborator is injected; the UI parts never talk to each other.
 */
export class LineupApp {
  #groups = [];
  #groupId = null;
  #lineup = null;
  #visible = [];
  #sheetOpen = false;
  #wired = false;
  #toastTimer = null;

  /**
   * @param {object} deps
   * @param {import('../data/LineupRepository.js').LineupRepository} deps.repository
   * @param {import('../services/HashRouter.js').HashRouter} deps.router
   * @param {import('../services/LineupSearch.js').LineupSearch} deps.search
   * @param {import('../services/MediaWatcher.js').MediaWatcher} deps.phone
   * @param {import('../services/ClipboardService.js').ClipboardService} deps.clipboard
   * @param {import('../services/GlobalShortcuts.js').GlobalShortcuts} deps.shortcuts
   * @param {import('../services/PageTitle.js').PageTitle} deps.title
   * @param {Location} deps.location
   * @param {object} deps.ui  tabs, searchBox, list, detail, sheet, toast
   */
  constructor(deps) {
    Object.assign(this, deps);
  }

  async start() {
    try {
      this.#groups = await this.repository.load();
    } catch (error) {
      console.error(error);
      this.ui.list.showError(this.location.protocol === 'file:' ? T.loadFailedFile : T.loadFailedNetwork, () => this.start());
      return;
    }
    this.ui.tabs.render(this.#groups);
    this.#wire();
    this.#applyRoute();
  }

  #wire() {
    if (this.#wired) return;
    this.#wired = true;
    const { tabs, searchBox, list, detail, sheet } = this.ui;

    tabs.on('select', (id) => this.router.navigate(new Route(id)));
    searchBox.on('input', (text) => this.#search(text));
    list.on('select', (lineup) => this.#choose(lineup));
    list.on('copy', (lineup) => this.#copy(lineup));
    detail.on('copy', (lineup) => this.#copy(lineup));
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

  get #group() {
    return this.#groups.find((g) => g.id === this.#groupId);
  }

  #applyRoute() {
    const route = this.router.current();
    const groupId = this.#groups.some((g) => g.id === route.kindId) ? route.kindId : this.#groups[0].id;
    const groupChanged = groupId !== this.#groupId;
    this.#groupId = groupId;

    const lineup = route.cardId ? this.#group.find(route.cardId) : null;
    if (groupChanged) this.#mountGroup(lineup);

    if (lineup) this.#show(lineup);
    else if (!this.phone.matches && (groupChanged || !this.#lineup)) {
      const first = this.#visible[0];
      if (first) this.#show(first); // wide screens always show a lineup; default to the first without touching the URL
    }

    this.#sheetOpen = Boolean(lineup) && this.phone.matches;
    this.ui.sheet.apply(this.#sheetOpen, () => this.ui.list.openButtonOf(this.#lineup));
    this.ui.tabs.setActive(groupId);
    this.title.forLineup(this.#group.name, this.#lineup);
  }

  #mountGroup(selected) {
    this.#visible = this.#filter();
    this.#lineup = null;
    this.ui.list.render(this.#visible, selected && this.#visible.includes(selected) ? selected : null);
    this.#summarize();
  }

  #filter() {
    return this.#group.lineups.filter((l) => this.search.matches(l));
  }

  #summarize() {
    if (!this.#visible.length) this.ui.list.showEmpty();
    this.ui.list.showSummary(this.#visible.length, this.#group.size, this.search);
  }

  #search(text) {
    this.search.setQuery(text);
    this.#visible = this.#filter();
    this.ui.list.render(this.#visible, this.#visible.includes(this.#lineup) ? this.#lineup : null);
    this.#summarize();
  }

  #show(lineup) {
    if (this.#lineup === lineup) return;
    this.#lineup = lineup;
    this.ui.list.select(lineup);
    this.ui.detail.render(lineup);
  }

  #choose(lineup) {
    this.router.navigate(new Route(this.#groupId, lineup.code), { push: this.phone.matches, sheet: this.phone.matches });
    this.#show(lineup);
  }

  #closeSheet() {
    if (!this.#sheetOpen) return;
    if (this.router.atSheetEntry) this.router.back();
    else this.router.navigate(new Route(this.#groupId));
  }

  async #copy(lineup) {
    const ok = await this.clipboard.copy(lineup.code);
    this.ui.toast.textContent = ok ? T.codeCopied : T.codeCopyFailed;
    clearTimeout(this.#toastTimer);
    this.#toastTimer = setTimeout(() => (this.ui.toast.textContent = ''), 1800);
  }
}
