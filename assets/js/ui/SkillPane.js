import { make } from '../core/dom.js';
import { KeywordText } from './KeywordText.js';
import { STRINGS as T } from './strings.js';

/** The "Kỹ năng" pane of a hero: the skill's icon, name and description, and what each upgrade level unlocks. */
export class SkillPane {
  constructor({ container, glossary }) {
    this.container = container;
    this.glossary = glossary;
  }

  render(profile) {
    const skill = profile.skill;
    if (!profile.hasSkill) {
      this.container.replaceChildren(make('p', 'todo', T.skillMissing));
      return;
    }
    const keywords = [];
    const text = (vi, zh, className) => {
      const p = make('p', vi ? className : `${className} is-zh`);
      p.lang = vi ? 'vi' : 'zh-Hans';
      if (vi) keywords.push(...KeywordText.fill(p, vi, this.glossary));
      else p.textContent = zh;
      return p;
    };

    const head = make('div', 'skill-head');
    if (skill.icon) {
      const icon = new Image();
      icon.className = 'skill-icon';
      icon.src = skill.icon;
      icon.alt = '';
      icon.width = icon.height = 56;
      icon.decoding = 'async';
      head.append(icon);
    }
    const names = make('div');
    const name = make('h3', 'skill-name', skill.nameVi || skill.nameZh);
    if (!skill.nameVi) name.lang = 'zh-Hans';
    names.append(name);
    if (skill.nameVi && skill.nameZh) {
      const zh = make('p', 'skill-zh', skill.nameZh);
      zh.lang = 'zh-Hans';
      names.append(zh);
    }
    head.append(names);

    const parts = [head, text(skill.descVi, skill.descZh, 'skill-desc')];
    if (skill.upgrades.length) {
      const list = make('ol', 'skill-ups');
      for (const upgrade of skill.upgrades) {
        const item = make('li', 'skill-up');
        item.append(make('span', 'skill-lv', T.upgradeLevel(upgrade.level)), text(upgrade.textVi, upgrade.textZh, 'skill-up-text'));
        list.append(item);
      }
      parts.push(make('h4', 'skill-ups-title', T.skillUpgrades), list);
    }
    const box = KeywordText.box(keywords);
    if (box) parts.push(box);
    this.container.replaceChildren(...parts);
  }
}
