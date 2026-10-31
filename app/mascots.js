/* Ōta Life · mascot rigs
   TAKU-kun, Momo-chan and Puri-kun drawn as layered vector rigs.
   Every eye and mouth variant is drawn once inside the SVG; the wrapper's
   data-s (state), data-e (eyes) and data-mo (mouth) attributes decide what shows
   and how the rig moves (see mascots section of styles.css). */
(function () {
  const INK = '#2B2540';
  const st = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const limb = (d, fill, w = 20) =>
    `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w - 9}" stroke-linecap="round"/>`;

  const EYES = ['open', 'happy', 'closed', 'sparkle', 'wide', 'sad', 'angry', 'side', 'wink', 'dizzy'];
  const MOUTHS = ['smile', 'grin', 'open', 'o', 'frown', 'flat', 'tongue', 'rage', 'console', 'cat'];

  /* one eye; side = -1 (left) or 1 (right) */
  function eye(v, cx, cy, r, side, lash) {
    const hi = (x, y, rr) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff"/>`;
    const lashes = lash ? `<path d="M${cx + side * r * .55} ${cy - r * .75} l${side * r * .45} ${-r * .4}" ${st(2.6)} fill="none"/>` : '';
    switch (v) {
      case 'open':
        return `<ellipse cx="${cx}" cy="${cy}" rx="${r * .62}" ry="${r * .8}" fill="${INK}"/>${hi(cx - r * .2, cy - r * .32, r * .26)}${lashes}`;
      case 'sparkle':
        return `<ellipse cx="${cx}" cy="${cy}" rx="${r * .78}" ry="${r * .95}" fill="${INK}"/>${hi(cx - r * .25, cy - r * .35, r * .32)}${hi(cx + r * .3, cy + r * .35, r * .16)}<path d="M${cx + r * 1.1} ${cy - r * 1.3} l${r * .18} ${r * .42} l${r * .42} ${r * .18} l${-r * .42} ${r * .18} l${-r * .18} ${r * .42} l${-r * .18} ${-r * .42} l${-r * .42} ${-r * .18} l${r * .42} ${-r * .18}z" fill="#FFC23D"/>${lashes}`;
      case 'happy':
        return `<path d="M${cx - r} ${cy + r * .35} Q${cx} ${cy - r * 1.05} ${cx + r} ${cy + r * .35}" fill="none" ${st(Math.max(3.2, r * .42))}/>`;
      case 'closed':
        return `<path d="M${cx - r} ${cy} Q${cx} ${cy + r * .7} ${cx + r} ${cy}" fill="none" ${st(Math.max(3, r * .38))}/>`;
      case 'wide':
        return `<circle cx="${cx}" cy="${cy}" r="${r * .95}" fill="#fff" ${st(3)}/><circle cx="${cx}" cy="${cy + r * .1}" r="${r * .45}" fill="${INK}"/>`;
      case 'sad':
        return `<ellipse cx="${cx}" cy="${cy + r * .15}" rx="${r * .5}" ry="${r * .62}" fill="${INK}"/>${hi(cx - r * .15, cy - r * .1, r * .2)}<path d="M${cx - side * r} ${cy - r * 1.05} L${cx + side * r * .8} ${cy - r * 1.6}" fill="none" ${st(3)}/>`;
      case 'angry':
        return `<path d="M${cx - side * r} ${cy - r * .75} L${cx + side * r * .55} ${cy} L${cx - side * r} ${cy + r * .75}" fill="none" ${st(Math.max(3.2, r * .42))}/>`;
      case 'side':
        return `<ellipse cx="${cx + r * .35}" cy="${cy}" rx="${r * .58}" ry="${r * .78}" fill="${INK}"/>${hi(cx + r * .15, cy - r * .3, r * .24)}`;
      case 'wink':
        return side < 0 ? eye('open', cx, cy, r, side, lash) : eye('happy', cx, cy, r, side, lash);
      case 'dizzy':
        return `<path d="M${cx - r * .7} ${cy - r * .7} L${cx + r * .7} ${cy + r * .7} M${cx + r * .7} ${cy - r * .7} L${cx - r * .7} ${cy + r * .7}" ${st(3.2)}/>`;
    }
    return '';
  }

  function mouth(v, x, y, w) {
    const pink = '#F27A98';
    switch (v) {
      case 'smile': return `<path d="M${x - w} ${y} Q${x} ${y + w * .95} ${x + w} ${y}" fill="none" ${st(3.4)}/>`;
      case 'cat': return `<path d="M${x - w} ${y} q${w * .5} ${w * .6} ${w} 0 q${w * .5} ${w * .6} ${w} 0" fill="none" ${st(3.2)}/>`;
      case 'grin': return `<path d="M${x - w * 1.1} ${y - w * .1} Q${x} ${y + w * 1.7} ${x + w * 1.1} ${y - w * .1} Z" fill="${INK}" ${st(3)}/><ellipse cx="${x}" cy="${y + w * .75}" rx="${w * .5}" ry="${w * .28}" fill="${pink}"/>`;
      case 'open': return `<ellipse cx="${x}" cy="${y + w * .45}" rx="${w * .62}" ry="${w * .78}" fill="${INK}"/><ellipse cx="${x}" cy="${y + w * .85}" rx="${w * .4}" ry="${w * .26}" fill="${pink}"/>`;
      case 'o': return `<ellipse cx="${x}" cy="${y + w * .35}" rx="${w * .3}" ry="${w * .36}" fill="${INK}"/>`;
      case 'frown': return `<path d="M${x - w * .8} ${y + w * .6} Q${x} ${y - w * .15} ${x + w * .8} ${y + w * .6}" fill="none" ${st(3.4)}/>`;
      case 'flat': return `<path d="M${x - w * .6} ${y + w * .3} L${x + w * .6} ${y + w * .3}" ${st(3.4)}/>`;
      case 'tongue': return `<path d="M${x - w * .45} ${y + w * .3} q0 ${w * 1.25} ${w * .45} ${w * 1.25} q${w * .45} 0 ${w * .45} ${-w * 1.25}" fill="${pink}" ${st(3)}/><path d="M${x - w * 1.1} ${y} Q${x - w * .55} ${y + w * .7} ${x} ${y + w * .1} Q${x + w * .55} ${y + w * .7} ${x + w * 1.1} ${y}" fill="none" ${st(3.4)}/>`;
      case 'rage': return `<path d="M${x - w * 1.1} ${y - w * .1} L${x + w * 1.1} ${y - w * .1} L${x + w * .8} ${y + w * 1.1} L${x - w * .8} ${y + w * 1.1} Z" fill="${INK}" ${st(3)}/><path d="M${x - w * .8} ${y + w * .15} l${w * .4} ${w * .35} l${w * .4} ${-w * .35} l${w * .4} ${w * .35} l${w * .4} ${-w * .35}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`;
      case 'console':
        return `<ellipse cx="${x}" cy="${y + w * .5}" rx="${w * 1.05}" ry="${w * .85}" fill="${INK}"/>
          <g class="nsw" style="transform-origin:${x}px ${y + w}px"><rect x="${x - w * 1.9}" y="${y - w * 1.9}" width="${w * 3.8}" height="${w * 2.3}" rx="${w * .35}" fill="#3B3A48" ${st(2.4)}/><rect x="${x - w * 1.25}" y="${y - w * 1.65}" width="${w * 2.5}" height="${w * 1.8}" rx="2" fill="#9FE6FF"/><rect x="${x - w * 2.5}" y="${y - w * 1.9}" width="${w * .75}" height="${w * 2.3}" rx="${w * .35}" fill="#3AB7E8" ${st(2.4)}/><rect x="${x + w * 1.75}" y="${y - w * 1.9}" width="${w * .75}" height="${w * 2.3}" rx="${w * .35}" fill="#FF5A52" ${st(2.4)}/></g>`;
    }
    return '';
  }

  function face(geo) {
    const [lx, ly, rx, ry, r, mx, my, mw, lash] = geo;
    let out = `<g class="ew" style="transform-origin:${(lx + rx) / 2}px ${ly}px">`;
    for (const v of EYES) out += `<g class="fv e-${v}">${eye(v, lx, ly, r, -1, lash)}${eye(v, rx, ry, r, 1, lash)}</g>`;
    out += `</g>`;
    for (const v of MOUTHS) out += `<g class="fv m-${v}">${mouth(v, mx, my, mw)}</g>`;
    return out;
  }

  const spark = (x, y, s, c = '#FFC23D') =>
    `<path d="M${x} ${y - s} Q${x + s * .18} ${y - s * .18} ${x + s} ${y} Q${x + s * .18} ${y + s * .18} ${x} ${y + s} Q${x - s * .18} ${y + s * .18} ${x - s} ${y} Q${x - s * .18} ${y - s * .18} ${x} ${y - s}Z" fill="${c}" ${st(2.2)}/>`;
  const heart = (x, y, s) =>
    `<path d="M${x} ${y + s * .9} C${x - s * 1.6} ${y - s * .2} ${x - s * .8} ${y - s * 1.4} ${x} ${y - s * .5} C${x + s * .8} ${y - s * 1.4} ${x + s * 1.6} ${y - s * .2} ${x} ${y + s * .9}Z" fill="#FF6F96" ${st(2.4)}/>`;

  /* shared effect props; each mascot adds its own signature ones */
  function commonFx(head) {
    const [hx, hy] = head;
    return `
      <g class="fx fx-spark">${spark(hx - 70, hy - 30, 9)}${spark(hx + 72, hy - 44, 12, '#D5F45A')}${spark(hx + 64, hy + 36, 7)}</g>
      <g class="fx fx-heart"><g class="h1">${heart(hx + 58, hy - 40, 9)}</g><g class="h2">${heart(hx - 58, hy - 30, 7)}</g></g>
      <g class="fx fx-sweat"><path d="M${hx + 50} ${hy - 26} q-9 14 0 18 q9 -4 0 -18z" fill="#8FD3FF" ${st(2.4)}/></g>
      <g class="fx fx-z"><text class="z1" x="${hx + 46}" y="${hy - 26}" font-family="Dela Gothic One, sans-serif" font-size="18" fill="${INK}">z</text><text class="z2" x="${hx + 62}" y="${hy - 44}" font-family="Dela Gothic One, sans-serif" font-size="24" fill="${INK}">Z</text></g>
      <g class="fx fx-dots"><rect x="${hx + 34}" y="${hy - 70}" width="50" height="28" rx="14" fill="#fff" ${st(3)}/><circle class="d1" cx="${hx + 48}" cy="${hy - 56}" r="3.4" fill="${INK}"/><circle class="d2" cx="${hx + 59}" cy="${hy - 56}" r="3.4" fill="${INK}"/><circle class="d3" cx="${hx + 70}" cy="${hy - 56}" r="3.4" fill="${INK}"/></g>
      <g class="fx fx-swirl"><circle cx="${hx}" cy="${hy - 66}" r="12" fill="none" stroke="#FFC23D" stroke-width="3" stroke-dasharray="6 5"/></g>`;
  }

  /* ---------- TAKU-kun · blue husky, purple tee, backpack, glasses ---------- */
  function taku() {
    const B = 'var(--tk-body,#B5DDEC)';
    const stick = (x1, y1, x2, y2) => `<g class="stk"><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="var(--glow,#D5F45A)" stroke-width="6" stroke-linecap="round"/></g>`;
    return `
    <g class="rig">
      <path class="tail" style="transform-origin:138px 158px" d="M136 160 C164 160 184 138 178 108 C170 124 158 134 138 140 Z" fill="${B}" ${st()}/>
      <rect x="54" y="112" width="92" height="58" rx="20" fill="#3A3354" ${st()}/>
      <g class="ll" style="transform-origin:82px 170px"><rect x="71" y="164" width="22" height="30" rx="11" fill="${B}" ${st()}/></g>
      <g class="lr" style="transform-origin:118px 170px"><rect x="107" y="164" width="22" height="30" rx="11" fill="${B}" ${st()}/></g>
      <path d="M64 150 H136 V168 Q136 176 128 176 H72 Q64 176 64 168 Z" fill="#fff" ${st()}/>
      <path d="M66 122 Q100 110 134 122 L138 158 Q100 166 62 158 Z" fill="var(--tk-shirt,#CBB9F2)" ${st()}/>
      <path d="M79 118 L75 158 M121 118 L125 158" stroke="#3A3354" stroke-width="8" stroke-linecap="round"/>
      <text x="100" y="148" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif" font-weight="700" font-size="14" fill="${INK}" opacity=".75">推</text>
      <g class="al" style="transform-origin:68px 128px">${stick(50, 158, 38, 180)}${limb('M68 128 L52 156', B)}</g>
      <g class="ar" style="transform-origin:132px 128px">${stick(150, 158, 162, 180)}${limb('M132 128 L148 156', B)}</g>
      <g class="hd" style="transform-origin:100px 122px">
        <g class="earl" style="transform-origin:76px 46px"><path d="M56 58 L62 14 L96 40 Z" fill="${B}" ${st()}/><path d="M66 46 L67 28 L84 40 Z" fill="#fff"/></g>
        <g class="earr" style="transform-origin:124px 46px"><path d="M144 58 L138 14 L104 40 Z" fill="${B}" ${st()}/><path d="M134 46 L133 28 L116 40 Z" fill="#fff"/></g>
        <path d="M100 28 C146 28 162 56 162 82 C162 110 136 124 100 124 C64 124 38 110 38 82 C38 56 54 28 100 28 Z" fill="${B}" ${st()}/>
        <path d="M100 74 C112 64 136 66 141 86 C144 106 124 119 100 119 C76 119 56 106 59 86 C64 66 88 64 100 74 Z" fill="#fff"/>
        <path d="M90 31 Q100 54 110 31 Z" fill="#fff"/>
        <ellipse cx="58" cy="98" rx="8" ry="5" fill="#F7A1B5" opacity=".75"/><ellipse cx="142" cy="98" rx="8" ry="5" fill="#F7A1B5" opacity=".75"/>
        ${face([79, 74, 121, 74, 8, 100, 99, 9, false])}
        <g fill="none" stroke="${INK}" stroke-width="3.4"><circle cx="79" cy="74" r="15"/><circle cx="121" cy="74" r="15"/><path d="M94 71 Q100 67 106 71"/></g>
        <ellipse cx="100" cy="90" rx="6" ry="4.4" fill="${INK}"/>
      </g>
      ${commonFx([100, 70])}
    </g>`;
  }

  /* ---------- Momo-chan · pink dumpling idol, red bow, pom pigtails ---------- */
  function momo() {
    const B = 'var(--mo-body,#FAD3DD)';
    const P = 'var(--mo-pom,#E66F98)';
    const pomL = 'M52 50 C68 42 84 58 74 72 C88 80 82 106 64 104 C60 122 32 122 28 106 C10 104 10 78 26 72 C22 56 38 46 52 50Z';
    const pomR = 'M148 50 C132 42 116 58 126 72 C112 80 118 106 136 104 C140 122 168 122 172 106 C190 104 190 78 174 72 C178 56 162 46 148 50Z';
    let throwFx = '';
    const dirs = [[-60, -50], [60, -56], [-74, 6], [76, 4], [-40, 52], [44, 50]];
    dirs.forEach(([x, y], i) => { throwFx += `<g class="tw" style="--x:${x}px;--y:${y}px;animation-delay:${i * 40}ms">${spark(100, 92, 8, i % 2 ? '#D5F45A' : '#FFC23D')}</g>`; });
    return `
    <g class="rig">
      <g class="ll" style="transform-origin:89px 168px"><rect x="80" y="160" width="18" height="34" rx="9" fill="${B}" ${st()}/></g>
      <g class="lr" style="transform-origin:111px 168px"><rect x="102" y="160" width="18" height="34" rx="9" fill="${B}" ${st()}/></g>
      <g class="al" style="transform-origin:80px 130px">${limb('M80 130 L62 152', B)}</g>
      <g class="ar" style="transform-origin:120px 130px">${limb('M120 130 L138 152', B)}<g class="mic"><path d="M140 154 L150 134" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="152" cy="130" r="7" fill="#fff" ${st(3)}/></g></g>
      <path d="M78 120 Q100 112 122 120 L142 172 Q100 184 58 172 Z" fill="var(--mo-dress,#E8473F)" ${st()}/>
      <circle cx="84" cy="150" r="3" fill="#fff" opacity=".85"/><circle cx="104" cy="160" r="3" fill="#fff" opacity=".85"/><circle cx="118" cy="142" r="3" fill="#fff" opacity=".85"/>
      <g class="hd" style="transform-origin:100px 124px">
        <g class="pl" style="transform-origin:64px 74px"><path d="${pomL}" fill="${P}" ${st()}/></g>
        <g class="pr" style="transform-origin:136px 74px"><path d="${pomR}" fill="${P}" ${st()}/></g>
        <ellipse cx="100" cy="86" rx="46" ry="42" fill="${B}" ${st()}/>
        <path d="M86 50 Q93 59 100 47 Q107 59 114 50" fill="none" ${st(3)}/>
        <g class="bow" style="transform-origin:100px 40px"><path d="M100 40 L72 24 Q63 40 72 56 Z" fill="var(--mo-dress,#E8473F)" ${st()}/><path d="M100 40 L128 24 Q137 40 128 56 Z" fill="var(--mo-dress,#E8473F)" ${st()}/><circle cx="100" cy="40" r="8" fill="var(--mo-dress,#E8473F)" ${st()}/></g>
        <ellipse cx="72" cy="104" rx="8" ry="5" fill="#F58BA6" opacity=".8"/><ellipse cx="128" cy="104" rx="8" ry="5" fill="#F58BA6" opacity=".8"/>
        ${face([82, 90, 118, 90, 10, 100, 106, 6, true])}
      </g>
      <g class="fx fx-throw">${throwFx}</g>
      ${commonFx([100, 72])}
    </g>`;
  }

  /* ---------- Puri-kun · puffed golden puri, blue shorts, gamer ---------- */
  function puri() {
    const B = 'var(--pu-body,#F7D46A)';
    const band = 'M18 110 C18 94 38 90 54 96 C68 88 86 92 100 96 C114 92 132 88 146 96 C162 90 182 94 182 110 C182 128 164 134 148 128 C132 136 114 134 100 130 C86 134 68 136 52 128 C36 134 18 128 18 110Z';
    return `
    <g class="rig">
      <g class="ll" style="transform-origin:78px 176px"><ellipse cx="78" cy="186" rx="15" ry="9" fill="${B}" ${st()}/></g>
      <g class="lr" style="transform-origin:122px 176px"><ellipse cx="122" cy="186" rx="15" ry="9" fill="${B}" ${st()}/></g>
      <path d="M52 148 Q100 138 148 148 L146 170 Q100 184 54 170 Z" fill="var(--pu-shorts,#6E88C7)" ${st()}/>
      <g class="bd" style="transform-origin:100px 170px">
        <ellipse cx="62" cy="50" rx="14" ry="12" fill="${B}" ${st()}/><ellipse cx="138" cy="50" rx="14" ry="12" fill="${B}" ${st()}/>
        <path d="M28 112 C28 64 58 40 100 40 C142 40 172 64 172 112 Z" fill="${B}" ${st()}/>
        <path d="M40 118 L160 118 L152 150 Q100 164 48 150 Z" fill="${B}" ${st()}/>
        <ellipse cx="72" cy="58" rx="4" ry="2.6" fill="#E3A93A" opacity=".8"/><ellipse cx="128" cy="62" rx="5" ry="3" fill="#E3A93A" opacity=".8"/><ellipse cx="112" cy="48" rx="3" ry="2" fill="#E3A93A" opacity=".8"/><ellipse cx="86" cy="140" rx="4" ry="2.4" fill="#E3A93A" opacity=".7"/>
        <path d="${band}" fill="#FFF6DD" ${st()}/>
        <ellipse cx="66" cy="88" rx="7" ry="4.4" fill="#F59A7A" opacity=".7"/><ellipse cx="134" cy="88" rx="7" ry="4.4" fill="#F59A7A" opacity=".7"/>
        ${face([84, 76, 116, 76, 6, 100, 84, 5.5, false])}
        <g class="hs"><path d="M38 84 C36 26 164 26 162 84" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><rect x="26" y="70" width="18" height="30" rx="8" fill="#7553FF" ${st(4)}/><rect x="156" y="70" width="18" height="30" rx="8" fill="#7553FF" ${st(4)}/><path d="M36 98 Q46 114 68 106" fill="none" ${st(4)}/><circle cx="70" cy="105" r="4" fill="${INK}"/></g>
      </g>
      <g class="al" style="transform-origin:34px 124px">${limb('M34 124 L20 144', B)}</g>
      <g class="ar" style="transform-origin:166px 124px">${limb('M166 124 L180 144', B)}<g class="gg"><path d="M181 146 L181 104" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><rect x="152" y="66" width="58" height="40" rx="10" fill="#D5F45A" ${st(4)}/><text x="181" y="96" text-anchor="middle" font-family="Dela Gothic One, sans-serif" font-size="24" fill="${INK}">GG</text></g></g>
      <g class="fx fx-trophy"><path d="M84 -6 H116 V8 Q116 26 100 28 Q84 26 84 8 Z" fill="#FFC23D" ${st(3.4)}/><path d="M84 2 Q72 2 74 12 Q76 18 86 18 M116 2 Q128 2 126 12 Q124 18 114 18" fill="none" ${st(3)}/><rect x="92" y="28" width="16" height="8" fill="#FFC23D" ${st(3)}/><rect x="86" y="36" width="28" height="7" rx="2" fill="${INK}"/></g>
      <g class="fx fx-steam"><g class="s1"><circle cx="40" cy="36" r="10" fill="#fff" ${st(3)}/><circle cx="30" cy="24" r="7" fill="#fff" ${st(3)}/></g><g class="s2"><circle cx="160" cy="34" r="10" fill="#fff" ${st(3)}/><circle cx="172" cy="22" r="7" fill="#fff" ${st(3)}/></g></g>
      <g class="fx fx-pad"><rect x="150" y="150" width="44" height="24" rx="12" fill="#5A5870" ${st(3)}/><circle cx="162" cy="162" r="3.4" fill="#fff"/><circle cx="182" cy="158" r="3" fill="#FF5A52"/><circle cx="186" cy="166" r="3" fill="#3AB7E8"/></g>
      ${commonFx([100, 64])}
    </g>`;
  }

  const RIGS = { taku, momo, puri };
  const NAMES = { taku: 'TAKU-kun', momo: 'Momo-chan', puri: 'Puri-kun' };

  /* state → default eyes/mouth; per-mascot overrides for character */
  const FACE = {
    idle: ['open', 'smile'], happy: ['happy', 'grin'], excited: ['sparkle', 'open'], cheer: ['happy', 'open'],
    sad: ['sad', 'frown'], sleepy: ['closed', 'o'], watch: ['wide', 'o'], think: ['side', 'flat'],
    run: ['happy', 'open'], charge: ['angry', 'grin'], wotagei: ['happy', 'open'], sparkle: ['wink', 'grin'],
    gg: ['happy', 'cat'], rage: ['angry', 'rage'], victory: ['sparkle', 'open'], console: ['wide', 'console'],
    dizzy: ['dizzy', 'o'], wave: ['happy', 'smile'], lively: ['sparkle', 'grin'], celebrate: ['happy', 'open']
  };
  const OVERRIDE = {
    taku: { idle: ['happy', 'tongue'], wave: ['happy', 'tongue'] },
    puri: { idle: ['open', 'cat'], happy: ['happy', 'cat'] },
    momo: {}
  };
  const STATES = {
    taku: ['idle', 'happy', 'wave', 'excited', 'wotagei', 'cheer', 'think', 'sad', 'sleepy', 'watch', 'run', 'charge'],
    momo: ['idle', 'happy', 'wave', 'sparkle', 'excited', 'lively', 'celebrate', 'cheer', 'sad', 'sleepy', 'watch', 'run', 'charge'],
    puri: ['idle', 'happy', 'gg', 'victory', 'console', 'excited', 'cheer', 'rage', 'sad', 'dizzy', 'sleepy', 'watch', 'think', 'run', 'charge']
  };

  function faceFor(who, s) { return (OVERRIDE[who] && OVERRIDE[who][s]) || FACE[s] || FACE.idle; }

  function html(who, state = 'idle', opt = {}) {
    const [e, mo] = faceFor(who, state);
    const cls = ['m', opt.cls || '', opt.poke ? 'poke' : ''].join(' ').trim();
    const acc = opt.acc ? ` data-acc="${opt.acc}"` : '';
    const size = opt.size ? ` style="--sz:${typeof opt.size === 'number' ? opt.size + 'px' : opt.size}"` : '';
    return `<div class="${cls}" data-who="${who}" data-s="${state}" data-base="${state}" data-e="${e}" data-mo="${mo}"${acc}${size} role="img" aria-label="${NAMES[who]}, ${state}"><svg viewBox="0 0 200 200" aria-hidden="true">${RIGS[who]()}</svg></div>`;
  }

  function set(el, state, keepBase) {
    if (!el) return;
    const [e, mo] = faceFor(el.dataset.who, state);
    // restart CSS animations: drop the state for a frame
    el.dataset.s = 'none';
    void el.offsetWidth;
    el.dataset.s = state; el.dataset.e = e; el.dataset.mo = mo;
    if (!keepBase) el.dataset.base = state;
    el.setAttribute('aria-label', `${NAMES[el.dataset.who]}, ${state}`);
  }

  /* one-shot reaction that returns to the element's base state */
  function react(el, state, ms = 900) {
    if (!el) return;
    clearTimeout(el._rt);
    set(el, state, true);
    el._rt = setTimeout(() => set(el, el.dataset.base, true), ms);
  }

  /* Puri token: the coin that drops into the watch jar */
  function token(size = 22) {
    return `<svg class="tok" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="21" r="17" fill="#E3A93A" ${st(3)}/><circle cx="20" cy="18" r="16" fill="#F7D46A" ${st(3)}/><path d="M7 20 Q13 15 20 18 Q27 15 33 20 Q27 25 20 22 Q13 25 7 20Z" fill="#FFF6DD"/><circle cx="15.5" cy="14.5" r="1.8" fill="${INK}"/><circle cx="24.5" cy="14.5" r="1.8" fill="${INK}"/></svg>`;
  }

  /* ---------- gate bosses: original yokai of otaku woes ---------- */
  const BOSSES = {
    kappa: { name: 'Spoiler Kappa', line: 'I know how the season ends…', body: '#7CC98A', belly: '#D8F3C9', label: 'SPOILERS' },
    tanuki: { name: 'Filler Tanuki', line: 'Just one more recap episode~', body: '#B98A62', belly: '#F4E3CC', label: 'RECAP' },
    tengu: { name: 'Buffering Tengu', line: 'Loading… loading… loading…', body: '#E2604F', belly: '#FFD9CF', label: '99%' },
    oni: { name: 'Sold-Out Oni', line: 'All the merch? Mine.', body: '#6F80DD', belly: '#DCE2FF', label: 'SOLD OUT' },
    yuki: { name: 'Burnout Yuki-onna', line: 'Too tired to watch anything…', body: '#BFE0F2', belly: '#F2FAFF', label: '0%' },
    daimao: { name: 'Doomscroll Daimaō', line: 'Scroll forever. Feel nothing.', body: '#5F44A8', belly: '#D9CCFF', label: '∞' }
  };
  function boss(id) {
    const b = BOSSES[id];
    let top = '';
    if (id === 'kappa') top = `<ellipse cx="100" cy="46" rx="34" ry="10" fill="#EAF7F0" ${st(4)}/><path d="M86 92 Q100 108 114 92 Z" fill="#FFC23D" ${st(4)}/>`;
    if (id === 'tanuki') top = `<path d="M72 62 Q100 50 128 62 Q130 84 100 86 Q70 84 72 62Z" fill="#5B4130"/><path d="M92 30 Q100 6 116 22 Q108 34 92 30Z" fill="#7CC98A" ${st(3.4)}/><ellipse cx="62" cy="40" rx="12" ry="12" fill="${b.body}" ${st(4)}/><ellipse cx="138" cy="40" rx="12" ry="12" fill="${b.body}" ${st(4)}/>`;
    if (id === 'tengu') top = `<path d="M96 80 L100 76 L150 92 L100 92 Z" fill="${b.body}" ${st(4)}/><circle cx="100" cy="22" r="16" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 6"/>`;
    if (id === 'oni') top = `<path d="M70 44 L62 12 L84 36 Z M130 44 L138 12 L116 36 Z" fill="#FFF1C9" ${st(4)}/>`;
    if (id === 'yuki') top = `<path d="M48 70 Q50 24 100 22 Q150 24 152 70 Q140 50 100 48 Q60 50 48 70Z" fill="#fff" ${st(4)}/>`;
    if (id === 'daimao') top = `<path d="M70 40 L76 16 L88 32 L100 10 L112 32 L124 16 L130 40 Z" fill="#FFC23D" ${st(4)}/>`;
    return `<svg viewBox="0 0 200 200" class="boss-svg" aria-hidden="true"><g class="brig">
      <path d="M36 188 C18 130 34 40 100 40 C166 40 182 130 164 188 Z" fill="${b.body}" ${st()}/>
      <path d="M62 188 C56 140 72 118 100 118 C128 118 144 140 138 188 Z" fill="${b.belly}" ${st(4)}/>
      <text x="100" y="${b.label.length > 6 ? 160 : 162}" text-anchor="middle" font-family="Dela Gothic One, sans-serif" font-size="${b.label.length > 6 ? 13 : 18}" fill="#2B2540">${b.label}</text>
      ${top}
      <path d="M66 74 L90 84 M134 74 L110 84" ${st(5)}/>
      <circle cx="80" cy="92" r="7" fill="#2B2540"/><circle cx="120" cy="92" r="7" fill="#2B2540"/>
      <path d="M84 110 Q100 100 116 110" fill="none" ${st(4)}/>
      <path d="M34 140 Q14 128 18 108 M166 140 Q186 128 182 108" fill="none" stroke="${b.body}" stroke-width="14" stroke-linecap="round"/>
    </g></svg>`;
  }

  /* inject the attribute → variant rules once */
  const css = [];
  EYES.forEach(v => css.push(`.m[data-e="${v}"] .e-${v}`));
  MOUTHS.forEach(v => css.push(`.m[data-mo="${v}"] .m-${v}`));
  const tag = document.createElement('style');
  tag.textContent = `${css.join(',')}{display:inline}`;
  document.head.appendChild(tag);

  window.Mascot = { html, set, react, token, boss, BOSSES, NAMES, STATES, faceFor };
})();
