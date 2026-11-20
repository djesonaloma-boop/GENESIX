// GENESIX - public/js/profil.js
document.addEventListener('DOMContentLoaded', async () => {
  const uid = localStorage.getItem('genesix_uid');
  if(!uid){ location.href='index.html'; return; }
  const res = await api('/users/'+uid);
  if(!res.success) return;
  const u = res.user;
  const nameEl = document.getElementById('profileName');
  if(nameEl) nameEl.textContent = u.fullName || u.username;
  const userEl = document.getElementById('profileUsername');
  if(userEl) userEl.textContent = '@'+u.username;
  const bioEl = document.getElementById('profileBio');
  if(bioEl) bioEl.textContent = u.bio || 'Aucune bio';
});
function logout(){
  localStorage.removeItem('genesix_uid');
  location.href='index.html';
}
