export async function loadPage(page) {
  const res = await fetch(`pages/${page}.html`);
  const html = await res.text();

  document.getElementById('app').innerHTML = html;

  try {
    const module = await import(`../modules/${page}.js`);
    if (module.init) module.init();
  } catch (e) {
    console.log(`No JS for ${page}`);
  }
}
