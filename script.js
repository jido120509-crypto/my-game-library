'use strict';
const grid = document.querySelector('#game-grid');
const gameCount = document.querySelector('#game-count');
const matchCount = document.querySelector('#match-count');
const search = document.querySelector('#search');
const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#detail-content');
const labels = {web:'웹',windows:'PC',android:'모바일',ios:'iOS',mac:'macOS',linux:'Linux'};
let games=[];
let filter='all';
const element = (tag, className, text) => {
  const node=document.createElement(tag);
  if (className) node.className=className;
  if (text!==undefined) node.textContent=String(text);
  return node;
};
const validUrl = (url) => {
  if (!url || typeof url!=='string') return null;
  try {
    const parsed=new URL(url,location.href);
    // Relative project files or https destinations only. Do not allow script/data URLs.
    if (parsed.protocol !== 'https:' && !(parsed.protocol==='http:' && parsed.hostname==='localhost')) return null;
    return parsed.href;
  } catch {return null;}
};
function action(label,url,secondary=false) {
  const href=validUrl(url);
  if (!href) {
    const button=element('button','action'+(secondary?' secondary':''),label);
    button.disabled=true;
    button.title='아직 등록된 실행 주소가 없습니다.';
    return button;
  }
  const link=element('a','action'+(secondary?' secondary':''),label);
  link.href=href;link.target='_blank';link.rel='noopener noreferrer';
  return link;
}
function render() {
  const query=search.value.trim().toLocaleLowerCase();
  const selected=games.filter(g=>(filter==='all'||g.platforms.includes(filter))&&g.title.toLocaleLowerCase().includes(query));
  grid.replaceChildren();
  matchCount.textContent=`표시 ${selected.length}개`;
  if (!selected.length) {grid.append(element('p','status-message','조건에 맞는 게임이 없습니다.'));return;}
  for(const g of selected) {
    const card=element('article','game-card');
    const img=element('img','game-cover');img.src=g.image||'assets/placeholder.svg';img.alt=g.title+' 대표 이미지';img.loading='lazy';img.addEventListener('error',()=>{img.src='assets/placeholder.svg'}, {once:true});card.append(img);
    const body=element('div','game-content');
    const heading=element('div','game-heading');heading.append(element('h3','',g.title),element('span','status-tag',g.status));body.append(heading);
    body.append(element('p','game-desc',g.description));
    const chips=element('div','chips');for(const p of g.platforms)chips.append(element('span','chip',labels[p]||p));body.append(chips);
    const meta=element('div','game-meta');meta.append(element('span','',`버전 ${g.version}`),element('span','',g.updated||''));body.append(meta);
    const actions=element('div','game-actions');
    if(g.platforms.includes('web'))actions.append(action('웹에서 플레이',g.playUrl));
    else actions.append(action('다운로드',g.downloadUrl));
    const more=element('button','action secondary','상세');more.type='button';more.addEventListener('click',()=>showDetails(g));actions.append(more);
    body.append(actions);card.append(body);grid.append(card);
  }
}
function showDetails(g) {
  dialogContent.replaceChildren();
  const img=element('img','detail-cover');img.src=g.image||'assets/placeholder.svg';img.alt=g.title+' 대표 이미지';img.addEventListener('error',()=>{img.src='assets/placeholder.svg'}, {once:true});dialogContent.append(img);
  dialogContent.append(element('h2','detail-title',g.title),element('p','detail-desc',g.description));
  const dl=element('dl','detail-table');
  for(const [key,value] of [['상태',g.status],['버전',g.version],['지원 플랫폼',g.platforms.map(p=>labels[p]||p).join(', ')],['업데이트',g.updated||'미입력'],['메모',g.notes||'—']]) {dl.append(element('dt','',key),element('dd','',value));}
  dialogContent.append(dl);
  const actions=element('div','detail-actions');
  if(g.platforms.includes('web'))actions.append(action('웹에서 플레이',g.playUrl));
  if(g.downloadUrl)actions.append(action('빌드 다운로드',g.downloadUrl,true));
  if(!g.platforms.includes('web')&&!g.downloadUrl)actions.append(action('다운로드 준비 중',''));
  dialogContent.append(actions);
  dialog.showModal();
}
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(other=>{const on=other===button;other.classList.toggle('is-active',on);other.setAttribute('aria-pressed',String(on))});
  render();
}));
search.addEventListener('input',render);
async function initialize(){
  try{
    const response=await fetch('games.json',{cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const data=await response.json();
    if(!Array.isArray(data.games))throw new Error('games 배열이 없습니다.');
    games=data.games.filter(g=>g&&typeof g.title==='string').map(g=>({id:String(g.id||''),title:g.title,description:String(g.description||''),image:String(g.image||''),version:String(g.version||'미정'),updated:String(g.updated||''),status:String(g.status||'개발 중'),platforms:Array.isArray(g.platforms)?g.platforms.filter(x=>typeof x==='string'):[],playUrl:String(g.playUrl||''),downloadUrl:String(g.downloadUrl||''),notes:String(g.notes||'')}));
    gameCount.textContent=String(games.length);render();
  }catch(err){
    gameCount.textContent='—';grid.replaceChildren(element('p','status-message','게임 목록을 불러오지 못했습니다. GitHub Pages로 배포하거나 로컬 서버에서 실행해 주세요. games.json 파일 형식도 확인해 주세요.'));
    matchCount.textContent='';console.error('게임 목록 로딩 실패:',err);
  }
}
initialize();
