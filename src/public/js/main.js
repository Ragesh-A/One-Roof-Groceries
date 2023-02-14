//timer function with redirect
function timer(sec, redirect) {
  let timerDisplay = document.getElementById('timerDisplay');
  let time = sec / 1000;
  function second() {
    time -= 1;
    timerDisplay.innerText = time;
  }
  let timerIntervel = setInterval(() => {
    second();
  }, 1000);
  setTimeout(() => {
    clearInterval(timerIntervel);
    if (redirect) {
      window.location = redirect;
    }
  }, sec);
}
//admin emplyee profile edit
const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('adminMain');

toggleBtn.onclick = function () {
  sidebar.classList.toggle('sidebar-active');
  main.classList.toggle('sidebar-active');
};
window.onload = () => {
  const tabSwitchers = document.querySelectorAll('[data-switcher]');
  for (let i = 0; i < tabSwitchers.length; i++) {
    let tabSwitcher = tabSwitchers[i];
    const pageId = tabSwitcher.dataset.tab;

    tabSwitcher.addEventListener('click', () => {
      document.querySelector('.profile-btn.active').classList.remove('active');
      tabSwitcher.classList.add('active');

      PageSwitcher(pageId);
    });
  }
};
function PageSwitcher(pageId) {
  const currentPage = document.querySelector('.page.active');
  currentPage.classList.remove('active');
  const newPage = document.querySelector(`.page[data-page="${pageId}"]`);
  newPage.classList.add('active');
}
/*-------------------*/
