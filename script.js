//by mschro67 and Github Copilot

import faecher from "./faecher.json" with {type: "json"};
import noten from "./noten.json" with {type: "json"};

const faecher_in = document.getElementById("faecher_in");
const input = document.getElementById("input");
const output = document.getElementById("out");

for (const fach of faecher) {
    faecher_in.innerHTML+=`<tr><td>${fach}</td><td><input type="number" id=${fach}></td></tr>`;
}

document.getElementById("yes").checked = false;
document.getElementById("save").checked = true;

async function submit(){
    globalThis.durchschnittSchueler = 0;
    if (document.getElementById("yes").checked) {
        let average = 0;
        let count = 0;
        let noten = {};
        for (const fach of faecher) {
            const val = document.getElementById(fach).value;
            if (val <= 6 && val >= 1 && val != "") {
                noten[fach] = val;
                count++;
                average += parseFloat(val);
            }else if (val != ""){
                output.innerHTML = "Ungültige Note bei " + fach;
                return;
            }
        }
        output.hidden = false;
        average /= count;
        if (count > 0 && document.getElementById("save").checked) {
            output.innerHTML = "Daten werden gespeichert...";
            try {
                const res = await fetch('/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noten)
                });
                if (res.ok) {
                    output.innerHTML = 'Daten gespeichert.';
                } else {
                    output.innerHTML = 'Fehler beim Speichern.';
                }
            } catch (e) {
                output.innerHTML = 'Netzwerkfehler.';
            }
            input.hidden = true;
        }else if (count > 0){
            input.hidden = true;
        }else{
            output.innerHTML = "Bitte geben Sie mindestens eine gültige Note ein.";
        }
        
        output.innerHTML = `Durchschnitt: ${Math.ceil(average*100)/100} <br> <button onclick="vergleich()">Vergleichen</button>`;
        durchschnittSchueler = Math.ceil(average*100)/100;
    } else {
        output.innerHTML = "Bitte stimme den Nutzungsbedingungen zu.";
        output.hidden = false;
    }
}

let verglichen = {};
let alle = 0;

function vergleich(id){
    output.innerHTML="";
    globalThis.durchschnittSchueler;
    for (const schueler of noten){
        for (const fach in schueler){
            if (!verglichen[fach]){
                verglichen[fach] = [schueler[fach]];
            }else{
                verglichen[fach].push(schueler[fach]);
            }
        }
    }
    let string="";
    for (const fach in verglichen){
        let summe = 0;
        for (const note of verglichen[fach]){
            summe += parseFloat(note);
        }
        const durchschnitt = summe / verglichen[fach].length;
        alle+=durchschnitt;
        string += `<tr><td>${(document.getElementById(fach).value>Math.floor(durchschnitt) ? `<b>${fach}</b>` : fach)}</td><td>${Math.ceil(durchschnitt*100)/100}</td>${(document.getElementById(fach).value>durchschnitt ? `<td><b style="color: red;">${document.getElementById(fach).value}</b></td>` : (document.getElementById(fach).value<Math.ceil(durchschnitt*100)/100 ? `<td style="color: green;">${document.getElementById(fach).value}</td>` : `<td>${document.getElementById(fach).value}</td>`))}</tr>`;
    }
    string+="</table>";
    alle /= Object.keys(verglichen).length;
    const string2 = `<table><tr><th>Fach</th><th>Klasse</th><th>Dein Ergebnis</th></tr><tr><td>Durchschnitt</td><td>${Math.ceil(alle*100)/100}</td>${(durchschnittSchueler>Math.ceil(alle*100)/100 ? `<td><b style="color: red;">${durchschnittSchueler}</b></td>` : (durchschnittSchueler<Math.floor(alle*100)/100 ? `<td style="color: green;">${durchschnittSchueler}</td>` : `<td>${durchschnittSchueler}</td>`))}</td></tr>`;
    output.innerHTML += string2 + string;
}

window.vergleich = vergleich;

// attach handler to form submission
window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            submit();
        });
    }
});