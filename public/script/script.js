function setTwoNumberDecimalRevenu() {
    document.getElementById('montantrevenu').value = parseFloat(document.getElementById('montantrevenu').value).toFixed(2);
}

function setTwoNumberDecimalDepense() {
    document.getElementById('montantdepense').value = parseFloat(document.getElementById('montantdepense').value).toFixed(2);
}


function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function send() {
    let key = randomIntFromInterval(100000, 999999);
    var number = {
        value: key
    }
    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/test', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(number));
    location.href = "/test/" + key;
}

// document.getElementById('submit-revenu').submit();

function checkdata() {
    const nomrevenu = document.getElementById('nomrevenu');
    const categorierevenue = document.getElementById('categorierevenu');
    const daterevenu = document.getElementById('daterevenu');
    const montantrevenu = document.getElementById('montantrevenu');

    if (nomrevenu.value == '') {
        nomrevenu.style.outline = "1px solid red";
    } else if (nomrevenu.value != '') {
        nomrevenu.style.outline = "none";
    }

    if (categorierevenue.value == '') {
        categorierevenue.style.outline = "1px solid red";
    } else if (categorierevenue.value != '') {
        categorierevenue.style.outline = "none";
    }

    if (daterevenu.value == '') {
        daterevenu.style.outline = "1px solid red";
    } else if (daterevenu.value != '') {
        daterevenu.style.outline = "none";
    }

    if (montantrevenu.value == '') {
        montantrevenu.style.outline = "1px solid red";
    } else if (montantrevenu.value != '') {
        montantrevenu.style.outline = "none";
    }

    if (nomrevenu.value != "" && categorierevenue.value != '' && daterevenu.value != '' && montantrevenu.value != '') {
        document.getElementById('modal1submit').setAttribute('data-dismiss', 'modal');
        document.getElementById('submit-revenu').submit();
    }
}


function checkdata2() {
    const nomdepense = document.getElementById('nomdepense');
    const categoriedepense = document.getElementById('categoriedepense');
    const datedepense = document.getElementById('datedepense');
    const montantdepense = document.getElementById('montantdepense');
    const dureereccurence = document.getElementById('dureereccurence');

    if (nomdepense.value == '') {
        nomdepense.style.outline = "1px solid red";
    } else if (nomdepense.value != '') {
        nomdepense.style.outline = "none";
    }

    if (categoriedepense.value == '') {
        categoriedepense.style.outline = "1px solid red";
    } else if (categoriedepense.value != '') {
        categoriedepense.style.outline = "none";
    }

    if (datedepense.value == '') {
        datedepense.style.outline = "1px solid red";
    } else if (datedepense.value != '') {
        datedepense.style.outline = "none";
    }

    if (montantdepense.value == '') {
        montantdepense.style.outline = "1px solid red";
    } else if (montantdepense.value != '') {
        montantdepense.style.outline = "none";
    }


    if (dureereccurence.value == '') {
      dureereccurence.style.outline = "1px solid red";
    } else if (dureereccurence.value != '') {
        dureereccurence.style.outline = "none";
    }



    if(categoriedepense.value == 'Reccurence'){
        if(nomdepense.value != "" && dureereccurence.value != '' && datedepense.value != '' && montantdepense.value != ''){
            document.getElementById('modal2submit').setAttribute('data-dismiss', 'modal');
            document.getElementById('submit-depense').submit();
            // console.log('Recc');
        }
    }else if(nomdepense.value != "" && categoriedepense.value != '' && datedepense.value != '' && montantdepense.value != ''){
        document.getElementById('modal2submit').setAttribute('data-dismiss', 'modal');
        document.getElementById('submit-depense').submit();
        // console.log('Pas recc');
    }
}




function nightmode() {
    if (document.getElementById('nightmode').getAttribute("src") == "../images/nightmod.png") {
        localStorage.setItem('mode','dark');
        document.getElementById('nightmode').setAttribute('src', '../images/sun.png');
        document.getElementById('nightmode').style.cssText = "filter:invert(0.5);";
        document.body.style.backgroundColor = "#1D1D1D";
        document.getElementById('carde').style.cssText = "background-color : #283742; color : white;";
        document.getElementById('btnrevenu').style.cssText = "background-color : #1A2D5C !important; color:white !important; border:1px solid #1A2D5C !important ;";
        document.getElementById('btndepense').style.cssText = "background-color : #183A53 !important; color:white !important; border:1px solid #183A53 !important ;";
        document.getElementById('infos').style.cssText = "background-color : #313131; color:white;";
        document.getElementById('chart').style.cssText = "background-color : #313131 ; color:white;";
        document.getElementById('SoldeChart').style.cssText = "color: #C7C7C7;";
        document.getElementById('camembert').style.cssText = "background-color : #313131 ; color : white;";
        document.getElementById('nav').style.cssText = "border: 1px solid rgba(255,255, 255, 0.1);";
        document.getElementById('navgauche').style.cssText = "border-right: 1px solid rgba(255,255, 255, 0.1); color:white;";
        document.getElementById('activities').style.cssText = "background-color : #313131 ; color : white;";
        document.getElementById('mobilenavbar').style.cssText = "background-color : #1D1D1D;"
        document.getElementById('label').setAttribute('src','../images/labelw.png');
        let activite = document.querySelectorAll('.activite');
        activite.forEach(item => {
            item.style.cssText = "background-color : #444444 ; color : white;";
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
                item.style.cssText = "color : white !important;";
            });
        })
    } else {
        localStorage.setItem('mode','white');
        document.getElementById('nightmode').setAttribute('src', '../images/nightmod.png');
        document.getElementById('label').setAttribute('src','../images/label.png');
        document.getElementById('nightmode').style.cssText = "filter:invert(0);";
        document.body.style.backgroundColor = "white";
        document.getElementById('carde').style.cssText = "background-color : #ACDCFF; color : black;";
        document.getElementById('btnrevenu').style.cssText = "background-color : #4B7EFF !important; color:black !important; border:1px solid #4B7EFF !important ;";
        document.getElementById('btndepense').style.cssText = "background-color : #5BB8FC !important; color:black !important; border:1px solid #5BB8FC !important ;";
        document.getElementById('infos').style.cssText = "background-color : #FFFFFF; color:black;";
        document.getElementById('chart').style.cssText = "background-color : #FFFFFF; color:black;";
        document.getElementById('SoldeChart').style.cssText = "color: black;";
        document.getElementById('camembert').style.cssText = "background-color : #FFFFFF;";
        document.getElementById('nav').style.cssText = "border: 1px solid rgba(0,0, 0, 0.1);";
        document.getElementById('navgauche').style.cssText = "border-right: 1px solid rgba(0,0,0, 0.1); color:black;";
        document.getElementById('activities').style.cssText = "background-color : #FFFFFF ; color : black;";
        document.getElementById('mobilenavbar').style.cssText = "background-color : white;"
        let activite = document.querySelectorAll('.activite');
        activite.forEach(item => {
            item.style.cssText = "background-color : #f2f2f2 ; color : black;";
        });
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
                item.style.cssText = "color : black !important;";
            });
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


const selectcategorie = document.getElementById('categoriedepense');
const selectrecurrence = document.getElementById('dureereccurence');


function checkcategorie() {
    if (selectcategorie.value === "Reccurence") {
        selectrecurrence.style.cssText = "display : inline-block;";
    } else {
        selectrecurrence.style.cssText = "display : none;";
    }
}

function hidealert() {
    document.getElementById("alert").style.cssText = "display : none;";
}


