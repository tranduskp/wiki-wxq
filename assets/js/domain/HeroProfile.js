/**
 * What the game says about a hero beyond its card: the skill with its three upgrades, the base stats, and what each
 * image version of the card is (the hero, its awakened form, or a related card). Plain data; no DOM, no network.
 *
 * `skill`    { nameZh, nameVi, descZh, descVi, icon, upgrades: [{ level, textVi, textZh }] }
 * `stats`    [{ key, value, suffix }] in display order; `suffix` is '%' for the crit stats, otherwise ''
 * `variants` [{ kind: 'goc' | 'thuc-tinh' | 'lien-quan', afterAwakening }] aligned with the card's images
 */
export class HeroProfile {
  constructor({ skill, stats, variants }) {
    this.skill = skill;
    this.stats = stats;
    this.variants = variants;
  }

  get hasSkill() {
    return Boolean(this.skill && (this.skill.nameVi || this.skill.nameZh));
  }

  variantKind(index) {
    return this.variants[index]?.kind ?? null;
  }
}
