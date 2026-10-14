export function toast({ title, description }) {
  const el = document.createElement('div');
  el.className =
    'fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-lg';
  el.innerHTML = '<p class="text-sm font-medium"></p><p class="text-sm text-slate-500"></p>';
  el.children[0].textContent = title || '';
  el.children[1].textContent = description || '';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

export const useToast = () => ({ toast });