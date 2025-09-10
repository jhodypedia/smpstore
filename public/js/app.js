// Theme toggle
const htmlEl = document.documentElement;
document.getElementById('themeToggle')?.addEventListener('click', ()=>{
  const cur = htmlEl.getAttribute('data-theme') || 'dark';
  const next = cur==='dark'?'light':'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
(function(){
  const saved = localStorage.getItem('theme');
  if (saved) htmlEl.setAttribute('data-theme', saved);
})();

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
document.getElementById('sidebarToggle')?.addEventListener('click', ()=>{
  sidebar?.classList.toggle('collapsed');
});
document.getElementById('sidebarClose')?.addEventListener('click', ()=>{
  sidebar?.classList.add('collapsed');
});

// Loading overlay helper
window.showLoading = function(){
  document.getElementById('loading')?.classList.remove('d-none');
};
window.hideLoading = function(){
  document.getElementById('loading')?.classList.add('d-none');
};

// Toastr default
toastr.options = { "positionClass": "toast-bottom-right", "timeOut": "3000" };
