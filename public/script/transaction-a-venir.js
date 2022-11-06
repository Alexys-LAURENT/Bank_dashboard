

function nightmode() {
    if (document.getElementById('nightmode').getAttribute("src") == "../images/nightmod.png") {
        localStorage.setItem('mode','dark');
        document.getElementById('nightmode').setAttribute('src', '../images/sun.png');
        document.getElementById('nightmode').style.cssText = "filter:invert(0.5);";
        document.body.style.backgroundColor = "#1D1D1D";
        document.getElementById('label').setAttribute('src','../images/labelw.png');
        document.getElementById('nav').style.cssText = "border: 1px solid rgba(255,255, 255, 0.1);";
        document.getElementById('navgauche').style.cssText = "border-right: 1px solid rgba(255,255, 255, 0.1); color:white;";
        document.getElementById('mobilenavbar').style.cssText = "background-color : #1D1D1D;";
        let modifyimg = document.querySelectorAll('.modify-img');
        modifyimg.forEach(item => {
            item.setAttribute('src','../images/editw.png');
        });
        let activiteavenir = document.querySelectorAll('.activiteavenir');
        activiteavenir.forEach(item => {
            item.style.cssText = "background-color : #444444 ; color : white;";
        });
        let a = document.querySelectorAll('.item-navgauche');
        a.forEach(item => {
            item.style.cssText = "color : white !important;";
            item.addEventListener('mouseenter', e => {
                item.style.cssText = "color : #4B7EFF;";
            });
            item.addEventListener('mouseleave', e => {
                item.style.cssText = "color : white;";
            });
        })
        let h1 = document.querySelectorAll('h1');
        h1.forEach(item => {
            item.style.cssText = "color : white !important;";
        })
    } else {
        localStorage.setItem('mode','white');
        let modifyimg = document.querySelectorAll('.modify-img');
        modifyimg.forEach(item => {
            item.setAttribute('src','../images/edit.png');
        });
        document.getElementById('nightmode').setAttribute('src', '../images/nightmod.png');
        document.getElementById('nightmode').style.cssText = "filter:invert(0);";
        document.body.style.backgroundColor = "white";
        document.getElementById('label').setAttribute('src','../images/label.png');
        document.getElementById('nav').style.cssText = "border: 1px solid rgba(0,0, 0, 0.1);";
        document.getElementById('navgauche').style.cssText = "border-right: 1px solid rgba(0,0,0, 0.1); color:black;";
        document.getElementById('mobilenavbar').style.cssText = "background-color : white;"
        let activiteavenir = document.querySelectorAll('.activiteavenir');
        activiteavenir.forEach(item => {
            item.style.cssText = "background-color : #FFFFFF ; color : black;";
        });
        let a = document.querySelectorAll('.item-navgauche');
        a.forEach(item => {
            item.style.cssText = "color : black !important;";
            item.addEventListener('mouseenter', e => {
                item.style.cssText = "color : #4B7EFF;";
            });
            item.addEventListener('mouseleave', e => {
                item.style.cssText = "color : black;";
            });
        })
        let h1 = document.querySelectorAll('h1');
        h1.forEach(item => {
            item.style.cssText = "color : black !important;";
        })
    }
}


function logout() {
    if (document.getElementById('logout').style.display == "flex") {
        document.getElementById('logout').style.display = "none";
    } else {
        document.getElementById('logout').style.display = "flex";
    }
}

function mobilenavbar() {
    if (document.getElementById('mobilenavbar').style.display == "flex") {
        document.getElementById('mobilenavbar').style.display = "none";
    } else {
        document.getElementById('mobilenavbar').style.display = "flex";
    }
}

window.addEventListener('resize', checksize)

function checksize() {
    var viewport_width = document.documentElement.clientWidth;
    if (viewport_width > 700) {
        document.getElementById('mobilenavbar').style.display = "none";
    }
}



