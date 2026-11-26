import { airfare, apps, booking, bookings, days, experiences, flights, groups, hotels, map, reminders, taskById, tasks, transport } from './data.js';

const $ = (selector) => document.querySelector(selector);
const format = new Intl.NumberFormat('zh-CN', { minimumFractionDigits:2, maximumFractionDigits:2 });
const money = (amount) => `${amount < 0 ? '−' : ''}¥${format.format(Math.abs(amount))}`;
const text = (value) => String(value).replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const external = (label,url) => `<a href="${text(url)}" target="_blank" rel="noopener noreferrer">${text(label)}</a>`;
const outlinks = (items) => items.length ? `<div class="outlinks">${items.map(({label,url})=>external(label,url)).join('')}</div>` : '';
const details = (rows) => rows.map(([label,value])=>`<div><dt>${text(label)}</dt><dd>${text(value)}</dd></div>`).join('');
const metrics = (rows) => rows.map(([label,value])=>`<div class="metric"><span>${text(label)}</span><strong>${text(value)}</strong></div>`).join('');
const storageKey = 'uae-travel-2027.v1';
const defaultBudget = { total:40000, food:5000, transport:3000, misc:1000, shopping:0 };
const budgetFields = { total:'双人总预算', food:'全程餐饮', transport:'全程交通', misc:'保险、网络及杂费', shopping:'额外购物' };
const amount = (value) => Math.round(Math.min(99999999, Math.max(0, Number(value) || 0)) * 100) / 100;
let saved = {};
let storageAvailable = true;
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { storageAvailable = false; }
const checked = new Set(Array.isArray(saved.checked) ? saved.checked.filter(id=>Object.hasOwn(taskById,id)) : ['flight','rose','creek']);
const budget = Object.fromEntries(Object.entries(defaultBudget).map(([key,value])=>[key,amount(saved.budget?.[key] ?? value)]));
const state = { day:1, bookingFilter:'all', taskFilter:'all', memo:typeof saved.memo === 'string' ? saved.memo.slice(0,20000) : '' };
const hotelTotal = hotels.reduce((sum,hotel)=>sum+Math.round(hotel.price*100),0)/100;
const booked = Math.round((airfare + hotelTotal)*100)/100;
const experienceTotal = experiences.reduce((sum,item)=>sum+item.price,0);

function storageMessage() {
  if (!storageAvailable) $('#storage-note').textContent = '当前浏览器无法保存更改。请使用复制功能留存。';
}
function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ checked:[...checked], budget, memo:state.memo }));
    storageAvailable = true;
  } catch { storageAvailable = false; }
  storageMessage();
}
function checkbox(id, label, source) {
  return `<label class="check"><input type="checkbox" data-check="${id}" data-source="${source}" ${checked.has(id) ? 'checked' : ''}><span>${text(label)}</span></label>`;
}
function matchesFilter(item, filter) {
  return filter === 'all' || checked.has(item.id) === (filter === 'done');
}
function filterButtons(selector, kind, labels) {
  $(selector).innerHTML = Object.entries(labels).map(([filter,label])=>`<button type="button" data-filter="${filter}" data-kind="${kind}" aria-pressed="${state[kind] === filter}">${label}</button>`).join('');
}
function renderBookings() {
  const count = booking.filter(item=>checked.has(item.id)).length;
  $('#booking-count').textContent = `景点预约完成 ${count} / ${booking.length}`;
  const visible = booking.filter(item=>matchesFilter(item,state.bookingFilter));
  $('#booking-list').innerHTML = visible.map(item=>`<article class="booking-item"><div>
    ${checkbox(item.id,item.name,'booking')}
    <p>游玩 2月${item.day}日 · 提前${item.ahead}</p><p>建议预约 ${item.window}</p>
    ${item.note ? `<p class="warning">${text(item.note)}</p>` : ''}${outlinks(item.links)}
    </div><div class="booking-meta"><strong>${item.price ? money(item.price) : '免费'}</strong><small>双人预算</small></div></article>`).join('') || '<p class="empty">该筛选下暂无预约。</p>';
}
function renderTasks() {
  const count = tasks.filter(item=>checked.has(item.id)).length;
  $('#task-count').textContent = `${count} / ${tasks.length}`;
  $('#task-progress').max = tasks.length;
  $('#task-progress').value = count;
  $('#task-list').innerHTML = groups.map(([name,items])=>{
    const visible = items.filter(item=>matchesFilter(item,state.taskFilter));
    if (!visible.length) return '';
    return `<section class="panel task-group"><div class="card-head"><h3>${name}</h3><span class="badge">${items.filter(item=>checked.has(item.id)).length} / ${items.length}</span></div>${visible.map(item=>`<div class="task-row">${checkbox(item.id,item.name,'tasks')}<small>${item.window}${item.price !== undefined ? ` · ${money(item.price)}` : ''}</small></div>`).join('')}</section>`;
  }).join('') || '<p class="empty">该筛选下暂无待办。</p>';
}

const dayPhotos = {1:'flight',2:'mosque',3:'mosque',4:'mosque',5:'mosque',6:'dubai',7:'desert',8:'dubai',9:'dubai',10:'dubai',11:'dubai',12:'dubai',13:'flight'};
function renderDay() {
  const entry = days[state.day-1];
  $('#day-label').textContent = `${entry.date} · ${entry.weekday}`;
  $('#day-index').textContent = `${entry.day} / ${days.length}`;
  for (const id of ['#prev-day','#prev-bottom']) $(id).disabled = entry.day === 1;
  for (const id of ['#next-day','#next-bottom']) $(id).disabled = entry.day === days.length;
  document.querySelectorAll('#day-picker button').forEach(button=>button.setAttribute('aria-pressed', Number(button.dataset.day) === state.day));
  $('#day-detail').innerHTML = `<article class="panel day-card">
    <header class="day-banner" style="background-image:linear-gradient(90deg,#112d29f0,#112d2959),url('./${dayPhotos[entry.day]}.jpg')"><p>${entry.place} · 住宿 ${entry.stay}</p><h3>${entry.title}</h3></header>
    <ol class="timeline">${entry.stops.map(([time,title,description,ids=[],links=[]])=>`<li><time>${time}</time><div><h4>${title}</h4>${description ? `<p>${description}</p>` : ''}${outlinks(links)}${ids.map(id=>{
      const item = taskById[id];
      const reservation = bookings[id];
      const label = id === 'abra' ? '已体验传统木船' : reservation ? `${item.name}已预约` : `完成：${item.name}`;
      return `<div class="stop-task">${reservation ? `<p><strong>${reservation.range}</strong> · 建议预约 ${reservation.window}</p>${reservation.note ? `<p>${reservation.note}</p>` : ''}` : ''}${outlinks(item.links || [])}${checkbox(id,label,'day')}</div>`;
    }).join('')}</div></li>`).join('')}</ol></article>`;
}
function selectDay(day, scroll = false) {
  if (!Number.isInteger(day) || day < 1 || day > days.length) return;
  state.day = day;
  renderDay();
  if (scroll) {
    $('#itinerary').scrollIntoView({ block:'start' });
    $(`#day-picker [data-day="${day}"]`).focus({ preventScroll:true });
  }
}
$('#day-picker').innerHTML = days.map(({day,date})=>`<button type="button" data-day="${day}" aria-label="第${day}天，${date}"><span>D${day}</span><small>2/${day}</small></button>`).join('');
$('#overview-days').innerHTML = days.map(({day,date,summary,stay})=>`<tr><td><a href="#itinerary" data-day="${day}">${date}</a></td><td>${summary}</td><td>${stay}</td></tr>`).join('');
$('#abu-map').href = map('Abu Dhabi UAE');
$('#dubai-map').href = map('Dubai UAE');
for (const selector of ['#abu-map','#dubai-map']) { $(selector).target = '_blank'; $(selector).rel = 'noopener noreferrer'; }
$('#flight-data').innerHTML = `<div class="card-head"><h3>阿提哈德航空 · 国际往返</h3><span class="badge">已预订</span></div><div class="flight-grid">${flights.map(({date,code,from,to,duration})=>{
  const airport = ([time,iata,city])=>`<div><strong>${time}</strong><b>${iata}</b><small>${city}</small></div>`;
  return `<article class="flight"><p>${date} · <b>${code}</b></p><div class="flight-route">${airport(from)}<div class="duration"><span>直飞</span><i aria-hidden="true"></i>${duration}</div>${airport(to)}</div></article>`;
}).join('')}</div><div class="card-foot"><strong>双人往返 ${money(airfare)}</strong>${external('阿提哈德航空官网','https://www.etihad.com/')}</div><p class="caption">航班均为当地时间。阿联酋比北京时间晚4小时。</p>`;
$('#hotel-data').innerHTML = hotels.map(hotel=>`<article class="panel hotel"><img class="hotel-img" src="./${hotel.key}.jpg" alt="${hotel.name}参考照片" loading="lazy"><div class="hotel-inner"><div class="card-head"><h3>${hotel.name}</h3><span class="badge">已预订</span></div><p class="caption">${hotel.en}</p>
  <dl class="detail-list">${details([['入住',hotel.in],...(hotel.arrival ? [['实际到店',hotel.arrival]] : []),['退房',hotel.out],['房型',hotel.room],['住宿',`2人 · ${hotel.nights}晚`],['总价',money(hotel.price)],['每晚',money(hotel.nightly)]])}</dl>
  ${outlinks([{label:'酒店官网',url:hotel.url},{label:'酒店导航',url:hotel.map},{label:'小红书攻略',url:`https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(hotel.name)}`}])}
  ${hotel.arrival ? '<p class="callout">提前联系酒店，确认2月2日凌晨到店仍保留2月1日起订的房间。</p>' : ''}</div></article>`).join('');
$('#transport-list').innerHTML = transport.map(([name,date,duration,fare,url,note])=>`<article class="travel-card"><h3>${name}</h3><p class="caption">${date}</p><dl class="detail-list">${details([['参考车程',duration],['双人参考车费',fare]])}</dl>${note ? `<p>${note}</p>` : ''}${external('查看导航路线',url)}</article>`).join('');
$('#app-list').innerHTML = apps.map(([name,description,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer"><strong>${name}</strong><small>${description}</small></a>`).join('');
$('#prep-list').innerHTML = reminders.map(([title,body,item])=>`<article class="panel prep-card"><h3>${title}</h3><p>${body}</p>${item ? outlinks([item]) : ''}</article>`).join('');

function budgetValues() {
  const rows = [['国际机票',airfare],['两家酒店',hotelTotal],['门票及体验',experienceTotal],['餐饮',budget.food],['交通',budget.transport],['杂费及购物',budget.misc+budget.shopping]];
  const cents = rows.reduce((sum,[,value])=>sum+Math.round(value * 100),0);
  return {rows, total:cents/100, person:Math.round(cents/2)/100, remaining:(Math.round(budget.total*100)-cents)/100, later:(cents-Math.round(booked*100))/100};
}
function renderBudget() {
  const {rows,total,person,remaining,later} = budgetValues();
  const bookedRatio = budget.total ? booked/budget.total*100 : 0;
  $('#overview-metrics').innerHTML = metrics([['双人总预算',money(budget.total)],['已预订费用',money(booked)],['剩余可支配预算',money(budget.total-booked)],['预计门票及体验','约 ¥8,500']]);
  $('#booked-caption').textContent = budget.total ? `已预订费用占总预算 ${bookedRatio.toFixed(2)}%` : '目前总预算为 ¥0';
  $('#booked-progress').value = Math.min(bookedRatio,100);
  $('#budget-summary').innerHTML = metrics([['预计双人总花费',money(total)],['人均预计花费',money(person)],['剩余预算',money(remaining)]]);
  $('#budget-breakdown').innerHTML = details(rows.map(([label,value])=>[label,money(value)]));
  const rate = budget.total ? `${(total/budget.total*100).toFixed(1)}%` : '—';
  $('#budget-use').textContent = `已确认 ${money(booked)} · 后续预计 ${money(later)} · 使用率 ${rate}`;
}
$('#budget-inputs').innerHTML = Object.entries(budgetFields).map(([id,label])=>`<label class="budget-input"><span>${label}</span><input type="number" min="0" max="99999999" step="0.01" inputmode="decimal" data-budget="${id}" value="${budget[id]}"></label>`).join('');
$('#experience-total').textContent = money(experienceTotal);
$('#experience-list').innerHTML = details(experiences.map(item=>[item.name,money(item.price)]));
$('#memo').value = state.memo;
$('[data-copy="memo"]').disabled = !state.memo.trim();

let toastTimer;
async function copy(value) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    clearTimeout(toastTimer);
    $('#toast').textContent = '已复制到剪贴板';
    $('#toast').hidden = false;
    toastTimer = setTimeout(()=>{ $('#toast').hidden = true; },2200);
  } catch {
    const dialog = $('#copy-dialog');
    const textarea = dialog.querySelector('textarea');
    textarea.value = value;
    dialog.showModal();
    textarea.focus();
    textarea.select();
  }
}
function copyValue(kind) {
  if (kind === 'memo') return state.memo;
  if (kind === 'tasks') return ['阿联酋旅行待办',...groups.flatMap(([name,items])=>['',name,...items.map(item=>`${checked.has(item.id) ? '✓' : '□'} ${item.name} · ${item.window}`)])].join('\n');
  const {rows,total,person,remaining} = budgetValues();
  return ['阿联酋旅行双人预算',`双人总预算 ${money(budget.total)}`,...rows.map(([label,value])=>`${label} ${money(value)}`),`预计双人总花费 ${money(total)}`,`人均 ${money(person)}`,`剩余 ${money(remaining)}`].join('\n');
}
const filterLabels = { bookingFilter:{all:'全部',pending:'待预订',done:'已预订'}, taskFilter:{all:'全部事项',pending:'待完成',done:'已完成'} };
const updateFilters = () => {
  filterButtons('#booking-filter','bookingFilter',filterLabels.bookingFilter);
  filterButtons('#task-filter','taskFilter',filterLabels.taskFilter);
};
document.addEventListener('click', event=>{
  const action = event.target.closest('button,a[data-day]');
  if (!action) return;
  if (action.dataset.day) {
    event.preventDefault();
    selectDay(Number(action.dataset.day), action.tagName === 'A');
  } else if (action.id === 'prev-day' || action.id === 'prev-bottom') {
    selectDay(state.day-1, action.id === 'prev-bottom');
  } else if (action.id === 'next-day' || action.id === 'next-bottom') {
    selectDay(state.day+1, action.id === 'next-bottom');
  } else if (action.dataset.filter) {
    const {kind,filter} = action.dataset;
    state[kind] = filter;
    updateFilters();
    document.querySelector(`[data-kind="${kind}"][data-filter="${filter}"]`).focus();
    if (kind === 'bookingFilter') renderBookings(); else renderTasks();
  } else if (action.dataset.copy) {
    copy(copyValue(action.dataset.copy));
  }
});
document.addEventListener('change', event=>{
  const input = event.target;
  const id = input.dataset.check;
  if (id) {
    if (input.checked) checked.add(id); else checked.delete(id);
    save();
    document.querySelectorAll('#day-detail [data-check]').forEach(item=>{ item.checked = checked.has(item.dataset.check); });
    renderBookings();
    renderTasks();
    if (!input.isConnected) {
      const replacement = document.querySelector(`[data-check="${id}"][data-source="${input.dataset.source}"]`);
      const filter = input.dataset.source === 'booking' ? '#booking-filter' : '#task-filter';
      (replacement || $(`${filter} [aria-pressed="true"]`))?.focus({ preventScroll:true });
    }
  } else if (input.dataset.budget) {
    input.value = budget[input.dataset.budget];
  }
});
document.addEventListener('input', event=>{
  const input = event.target;
  if (input.dataset.budget) {
    budget[input.dataset.budget] = amount(input.value);
    save();
    renderBudget();
  } else if (input.id === 'memo') {
    state.memo = input.value;
    $('[data-copy="memo"]').disabled = !state.memo.trim();
    save();
  }
});
const sidebarLinks = [...document.querySelectorAll('.contents a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries=>{
    const current = entries.find(entry=>entry.isIntersecting);
    if (!current) return;
    sidebarLinks.forEach(anchor=>{
      if (anchor.hash === `#${current.target.id}`) anchor.setAttribute('aria-current','location');
      else anchor.removeAttribute('aria-current');
    });
  }, { rootMargin:'-120px 0px -60% 0px' });
  sidebarLinks.forEach(anchor=>observer.observe($(anchor.hash)));
}
renderDay();
updateFilters();
renderBookings();
renderTasks();
renderBudget();
storageMessage();
