// Illustrative field context; these are example locations and records.
const block = (x,y,w=50,h=26,lift=18) => `<g class="scene-building"><path class="building-shadow" d="M${x-10} ${y+8}l${w} -${h} ${w+16} ${h+8} -${w} ${h}Z"/><path class="building-side" d="M${x} ${y}l${w} ${h}v-${lift}l-${w} -${h}Z"/><path class="building-front" d="M${x+w} ${y+h}l${w} -${h}v-${lift}l-${w} ${h}Z"/><path class="building-roof" d="M${x} ${y-lift}l${w} -${h} ${w} ${h} -${w} ${h}Z"/><path class="building-detail" d="M${x+12} ${y-lift}l${w-12} -${h-7} ${w-12} ${h-7} -${w-12} ${h-7}Z"/></g>`;
const beacon=(x,y)=>`<g class="scene-beacon"><ellipse cx="${x}" cy="${y+4}" rx="20" ry="9" class="beacon-base"/><ellipse cx="${x}" cy="${y+4}" rx="13" ry="5" class="beacon-ring"/><path d="M${x} ${y+4}v-24" class="beacon-stem"/><circle cx="${x}" cy="${y-23}" r="4" class="beacon-light"/></g>`;
const floor=`<g class="scene-floor"><path class="floor-edge" d="M25 270L235 136 480 258 265 390v7L25 277Z"/><path class="floor-top" d="M25 270L235 136 480 258 265 390Z"/><g class="floor-grid">${Array.from({length:9},(_,i)=>`<path d="M${25+i*26} ${270-i*16.75}l240 120M${25+i*30} ${270+i*15}l210 -134"/>`).join('')}</g></g>`;

export const environments = {
  'nfc-badge': {
    source: ['NFC field','Contactless tap'], target:['Office record','Attendance linked'], legend:'IDENTITY → ATTENDANCE',
    art:`${floor}<g class="nfc-field"><path class="nfc-bracket" d="M65 120v-22h25M410 98h25v22M65 290v22h25M410 312h25v-22"/><g class="field-rings"><circle cx="300" cy="210" r="42"/><circle cx="300" cy="210" r="42"/><circle cx="300" cy="210" r="42"/></g><path class="nfc-scan" d="M68 145H432"/></g>${block(42,252,28,15,30)}${block(354,233,40,20,12)}${beacon(78,300)}${beacon(425,135)}<g class="scene-contours"><ellipse cx="260" cy="236" rx="192" ry="98"/><ellipse cx="260" cy="236" rx="166" ry="78"/></g>`,
    route:'M78 300L125 275Q147 260 147 242V184Q147 164 168 164H350Q372 164 390 153L425 135', start:[78,300],end:[425,135],
  },
  'guard-tag': {
    source:['Protected area','Asset assigned'],target:['Location context','Last known area'],legend:'DETECT → LOCATE → RECOVER',
    art:`${floor}${block(36,250,39,20,27)}${block(335,214,53,26,31)}${block(85,160,38,19,19)}<g class="guard-map"><path class="guard-boundary" d="M62 248L235 119 454 236 420 312 262 378 80 313Z"/><path class="guard-sweep" d="M250 220L250 80A140 140 0 0 1 390 220Z"/><g class="guard-lock"><circle cx="415" cy="132" r="18"/><circle cx="415" cy="132" r="10"/><path d="M415 102v12m0 36v12m-30-30h12m36 0h12"/></g></g>${beacon(78,310)}${beacon(415,132)}<g class="scene-contours"><path d="M26 195Q108 80 248 93T478 205M24 175Q108 55 248 71T487 180M37 335Q224 429 454 331"/></g>`,
    route:'M78 310L131 281Q150 267 172 281L260 324Q281 334 300 314L366 251Q384 235 387 216L415 132',start:[78,310],end:[415,132],
  },
  'tool-tag': {
    source:['Tool register','Identity retained'],target:['Custody trail','Handoff recorded'],legend:'IDENTITY → CUSTODY → HANDOFF',
    art:`${floor}<g class="tool-network"><path d="M65 130L85 307 390 321 432 125M65 130L432 125"/><g class="tool-node"><rect x="45" y="110" width="40" height="40" rx="8"/><path d="M57 130h16m-8-8v16"/></g><g class="tool-node"><rect x="412" y="105" width="40" height="40" rx="8"/><path d="M424 125h16m-8-8v16"/></g><g class="tool-node"><rect x="65" y="287" width="40" height="40" rx="8"/><path d="M75 307l7 7 13-15"/></g><g class="tool-node"><rect x="370" y="301" width="40" height="40" rx="8"/><path d="M380 321l7 7 13-15"/></g></g>${block(38,220,30,15,12)}${block(370,242,35,18,20)}<g class="scene-contours"><ellipse cx="250" cy="232" rx="211" ry="124"/></g>`,
    route:'M65 130L85 307Q85 335 115 335H360Q390 335 390 310L432 125',start:[65,130],end:[432,125],
  },
  'vehicle-gateway': {
    source:['Journey signal','Location received'],target:['Site arrival','Journey attached'],legend:'CONNECT → TRAVEL → ARRIVE',
    art:`${floor}${block(56,195,40,20,20)}${block(350,228,45,23,33)}<g class="gateway-road"><path class="road-bed" d="M18 322C98 322 105 258 132 205S239 90 305 120 355 287 477 250"/><path class="road-dashes" d="M18 322C98 322 105 258 132 205S239 90 305 120 355 287 477 250"/><g class="gateway-pin"><ellipse cx="435" cy="151" rx="18" ry="7" class="pin-shadow"/><path d="M420 120a15 15 0 1 1 30 0c0 15-15 29-15 29s-15-14-15-29Z"/><circle cx="435" cy="119" r="5"/></g></g>${beacon(48,322)}${beacon(477,250)}<g class="scene-contours"><path d="M22 115Q105 47 172 75T320 62 474 95M18 98Q105 29 172 56T320 44 484 78M25 360Q100 398 164 376T285 390 472 341"/></g>`,
    route:'M18 322C98 322 105 258 132 205S239 90 305 120 355 287 477 250',start:[18,322],end:[477,250],
  },
};
