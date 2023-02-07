function timer(sec, redirect) {
    let timerDisplay = document.getElementById('timerDisplay')
    let time = sec / 1000
    function second() {
        time -= 1
        timerDisplay.innerText = time
    }
    let timerIntervel = setInterval(() => {
        second()    
    }, 1000);
    setTimeout(() => {
        clearInterval(timerIntervel)
        if (redirect) { window.location = redirect }
    },sec)
    
}

const toggleBtn = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')
const main = document.getElementById('adminMain')

toggleBtn.onclick = function () {
    sidebar.classList.toggle('sidebar-active')
    main.classList.toggle('sidebar-active')
}

window.onload = () => {
    const tabSwitchers = document.querySelectorAll('[data-switcher]');
    for (let i = 0; i < tabSwitchers.length; i++){
        let tabSwitcher = tabSwitchers[i]
        const pageId = tabSwitcher.dataset.tab;

        tabSwitcher.addEventListener('click', () => {
            document.querySelector('.profile-btn.active').classList.remove('active');
            tabSwitcher.classList.add('active')
            
            PageSwitcher(pageId);
           
        });
    }
}

function PageSwitcher(pageId) {
    const currentPage = document.querySelector('.page.active')
    currentPage.classList.remove('active')
    
    const newPage = document.querySelector(`.page[data-page="${pageId}"]`)

    newPage.classList.add('active')
}
/*-------------------*/

// const selectBtn = document.getElementById('select-btn')
// const fileBtn = document.getElementById('profilePicture')

// fileBtn.addEventListener('change', function(event){
//     const image = this.files[0]
//     const reader = new FileReader();
//     const url = URL.createObjectURL(event.target.files[0])
//     document.getElementById('preview').src = url
//     reader.onload = ()=>{
//         const imgUrl = reader.result
//     }

    
// }) 