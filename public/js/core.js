// GENESIX - public/js/core.js - Fonctions partagées
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

function toast(msg){
  let el = document.getElementById('toast');
  if(!el){ el=document.createElement('div'); el.id='toast'; el.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#14233d;padding:11px 18px;border-radius:20px;font-size:12px;z-index:99'; document.body.appendChild(el); }
  el.textContent=msg; el.style.display='block';
  clearTimeout(window._tt); window._tt=setTimeout(()=>el.style.display='none',2500);
}
function esc(v){ return String(v||'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function formatTime(t){
  if(!t) return '';
  const d=new Date(t), now=new Date();
  if(d.toDateString()===now.toDateString()) return d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'});
}
async function api(path, method='GET', body=null){
  const opt={ method, headers:{'Content-Type':'application/json'} };
  if(body) opt.body=JSON.stringify(body);
  const r=await fetch(API_URL+path, opt);
  return r.json();
}
