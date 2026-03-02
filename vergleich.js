//by mschro67

import noten from "./noten.json" with {type: "json"};

const output = document.getElementById("out");
let verglichen={};

function vergleich(id){
    for (const schueler of noten){
        for (const fach in schueler){
            if (!verglichen[fach]){
                verglichen[fach] = [schueler[fach]];
            }else{
                verglichen[fach].push(schueler[fach]);
            }
        }
    }
    let string = "<table><tr><th>Fach</th><th>Durchschnitt</th><th>Deine Note</th></tr>";
    for (const fach in verglichen){
        let summe = 0;
        for (const note of verglichen[fach]){
            summe += parseFloat(note);
        }
        const durchschnitt = summe / verglichen[fach].length;
        if (document.getElementById(fach).value != 7){
            string += `<tr><td>${fach}</td><td>${durchschnitt.toFixed(2)}</td><td>${document.getElementById(fach).value}</td></tr>`;
        }
    }
    string += "</table>";
    output.innerHTML = string;
}

window.vergleich = vergleich;