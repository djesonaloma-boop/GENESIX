// GENESIX - public/js/admin.js - Admin Jason Aloma uniquement
document.addEventListener('DOMContentLoaded', async () => {
  const res = await api('/users');
  const users = res.users || [];
  const el = document.getElementById('adminUsers');
  if(el) el.textContent = users.length + ' utilisateurs';
  const list = document.getElementById('adminList');
  if(list) list.innerHTML = users.map(u => `<div class="card" style="margin:8px 0;display:flex;justify-content:space-between"><span><b>${esc(u.fullName||u.username)}</b><br><small style="color:var(--muted)">@${esc(u.username)} - ${esc(u.email||'')}</small></span><span>${u.verified?'✅':'⏳'}</span></div>`).join('') || '<p>Aucun utilisateur</p>';
});
