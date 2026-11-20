// GENESIX — fonctions communes
const API_URL = `${location.origin}/api`;
function esc(value){return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function formatTime(value){if(!value)return '';const d=new Date(Number(value));if(Number.isNaN(d.getTime()))return '';const n=new Date();return d.toDateString()===n.toDateString()?d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'});}
async function api(path,method='GET',body=null){const options={method,headers:{'Content-Type':'application/json'}};if(body!==null)options.body=JSON.stringify(body);const response=await fetch(API_URL+path,options);let data={};try{data=await response.json();}catch{}if(!response.ok)throw new Error(data.message||`Erreur serveur (${response.status})`);return data;}
function toast(message){let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';document.body.appendChild(el);}el.textContent=message;el.classList.add('show');clearTimeout(window.__genesixToast);window.__genesixToast=setTimeout(()=>el.classList.remove('show'),2600);}
function requireUser(){const uid=localStorage.getItem('genesix_uid');if(!uid){location.href='login.html';return null;}return uid;}
function logout(){localStorage.removeItem('genesix_uid');localStorage.removeItem('genesix_email');localStorage.removeItem('genesix_username');location.href='index.html';}
