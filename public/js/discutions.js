// GENESIX - public/js/discussions.js
let myUid = localStorage.getItem('genesix_uid');
let allConvs = [];

document.addEventListener('DOMContentLoaded', async () => {
  if(!myUid){ location.href='index.html'; return; }
  await loadConversations();
});

async function loadConversations(){
  const res = await api('/conversations/'+myUid);
  allConvs = res.conversations || [];
  renderConversations();
}

function renderConversations(){
  const list = document.getElementById('conversationList');
  const count = document.getElementById('conversationCount');
  if(!list) return;
  if(count) count.textContent = allConvs.length + ' discussion' + (allConvs.length>1?'s':'');
  if(!allConvs.length){
    list.innerHTML = '<div class="empty"><div>💬</div><strong>Aucune discussion</strong><p>Tu n\'as pas encore de discussion.<br>Appuie sur + pour commencer.</p></div>';
    return;
  }
  list.innerHTML = allConvs.map(c => `
    <div class="card" style="display:flex;gap:11px;margin:8px 12px;cursor:pointer" onclick="location.href='chat.html?id=${c.id}'">
      <div style="width:50px;height:50px;border-radius:16px;background:linear-gradient(135deg,#7c5cff,#12d6b4);display:grid;place-items:center;font-weight:bold;font-size:19px">${esc((c.name||'?').charAt(0))}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between"><b>${esc(c.name||'Groupe')}</b><span style="font-size:10px;color:var(--muted)">${formatTime(c.time)}</span></div>
        <div style="font-size:12px;color:var(--muted);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.lastMessage||'Aucun message')}</div>
      </div>
    </div>`).join('');
}
