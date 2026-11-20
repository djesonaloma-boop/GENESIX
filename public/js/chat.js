// GENESIX - public/js/chat.js
let myUid = localStorage.getItem('genesix_uid');
let convId = new URLSearchParams(location.search).get('id');

document.addEventListener('DOMContentLoaded', async () => {
  if(!myUid || !convId){ location.href='discussions.html'; return; }
  await loadMessages();
  document.getElementById('sendBtn').onclick = sendMessage;
});

async function loadMessages(){
  const res = await api('/messages/'+convId);
  const box = document.getElementById('messagesBox');
  const msgs = res.messages || [];
  if(!msgs.length){ box.innerHTML='<div class="empty"><div>💬</div><p>Aucun message.<br>Envoie le premier !</p></div>'; return; }
  box.innerHTML = msgs.map(m => `
    <div style="display:flex;justify-content:${m.senderId===myUid?'flex-end':'flex-start'};margin:6px 0">
      <div style="max-width:75%;padding:10px 13px;border-radius:16px;background:${m.senderId===myUid?'#7c5cff':'#14233d'};font-size:13px">${esc(m.text)}</div>
    </div>`).join('');
  box.scrollTop = box.scrollHeight;
}

async function sendMessage(){
  const inp = document.getElementById('msgInput');
  const text = inp.value.trim();
  if(!text) return;
  await api('/messages','POST',{ conversationId: convId, senderId: myUid, text });
  inp.value=''; await loadMessages();
}
