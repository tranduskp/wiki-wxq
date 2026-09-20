import { replay } from '../core/dom.js';
import { PlayerRoute } from '../services/PlayerRoute.js';
import { STRINGS as T } from '../ui/strings.js';

/**
 * Coordinates the Kỳ thủ page: loads the players, shows the one in the URL (the first when none), and turns
 * clicks on the roster and the skin picker into navigation. UI parts never talk to each other; this class wires them.
 */
export class PlayersApp {
  #players = [];
  #card = null;
  #shown = null;

  constructor({ repository, router, title, status, ui }) {
    this.repository = repository;
    this.router = router;
    this.title = title;
    this.status = status;
    this.ui = ui;
  }

  async start() {
    try {
      this.#players = await this.repository.load();
    } catch (err) {
      console.error(err);
      this.status.textContent = `${T.loadFailedTitle}. ${location.protocol === 'file:' ? T.loadFailedFile : T.loadFailedNetwork}`;
      return;
    }
    this.status.hidden = true;
    this.ui.roster.render(this.#players);
    this.ui.roster.on('select', (player) => this.router.navigate(new PlayerRoute(player.id), { push: true }));
    this.ui.banner.on('skin', (index) => this.router.navigate(new PlayerRoute(this.#current?.id, index)));
    this.ui.cards.on('select', (card) => this.#selectCard(card));
    this.router.onChange(() => this.#show());
    this.#show();
  }

  get #current() {
    const route = this.router.current();
    return this.#players.find((p) => p.id === route.playerId) ?? this.#players[0] ?? null;
  }

  #show() {
    const player = this.#current;
    if (!player) return;
    const route = this.router.current();
    const skin = Math.min(route.skin, Math.max(player.skins.length - 1, 0));
    this.ui.roster.select(player);
    if (player !== this.#shown) {
      // a different kỳ thủ: the whole profile stages in. A skin change only swaps the artwork.
      this.#shown = player;
      this.ui.abilities.render(player.groups);
      this.ui.cards.render(player.cards);
      this.#selectCard(player.cards[0] ?? null);
      replay(this.ui.stage, 'is-entering');
    }
    this.ui.banner.render(player, skin);
    this.title.forPlayer(player, T.playersSection);
  }

  #selectCard(card) {
    this.#card = card;
    this.ui.cards.select(card);
    this.ui.cardDetail.render(card);
  }
}
