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
        output.innerHTML = `Durchschnitt: ${Math.floor(average*100)/100} <br> <button onclick="vergleich()">Vergleichen</button>`;
        
    } else {
        output.innerHTML = "Bitte stimme den Nutzungsbedingungen zu.";
        output.hidden = false;
    }
}

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