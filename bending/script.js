// script.js

const crossSectionSelect = document.getElementById('cross-section-select');
const crossSectionForm = document.getElementById('cross-section-form');
const crossSectionImage = document.getElementById('cross-section-image');
const centroidResult = document.getElementById('centroid');
const momentOfInertiaXResult = document.getElementById('moment-of-inertia-x');
const momentOfInertiaYResult = document.getElementById('moment-of-inertia-y');
const momentOfInertiaZResult = document.getElementById('moment-of-inertia-z');
const calculateButton = document.getElementById('calculate-button');
const resultsSection = document.getElementById('results');

function updateFormAndImage() {
    // Show the form first
    updateForm();
    crossSectionForm.style.display = 'block';

    // Then show the image
    const selectedCrossSection = crossSectionSelect.value;
    // crossSectionImage.src = "";
    // console.log(crossSectionImage.src);
    crossSectionImage.style.display = 'block';
}


crossSectionSelect.addEventListener('change', updateFormAndImage);

function updateForm() {
    const selectedCrossSection = crossSectionSelect.value;
    let formContent = '';
    switch (selectedCrossSection) {
        case 'circle':
            formContent = '<label for="radius">Enter the value of radius:</label><input type="number" placeholder="Enter value in (mm)" id="radius" required>';
            crossSectionImage.src="radius.jpg"
            break;
        case 'rectangle':
            formContent = '<label for="width">Width :</label><input type="number" placeholder="Enter value in (mm)" id="width" required>' +
                '<label for="length">Length :</label><input type="number" placeholder="Enter value in (mm)" id="length" required>';
                crossSectionImage.src="rec.png"
            break;
        case 'square':
            formContent = '<label for="side">Side Length :</label><input type="number" placeholder="Enter value in (mm)" id="side" required>';
            crossSectionImage.src="square.png"
            break;
        case 'triangle':
            formContent = '<label for="base">Base Length :</label><input type="number" placeholder="Enter value in (mm)" id="base" required>' +
                '<label for="height-triangle">Height :</label><input type="number" placeholder="Enter value in (mm)" id="height-triangle" required>';
                crossSectionImage.src="triangle.png"
                break;
       
        case 'i-section':
            formContent = '<label for="a"> Enter the value of a:</label><input type="number" placeholder="Enter value in (mm)" id="a" required>' +
                '<label for="b">Enter the value of b:</label><input type="number" placeholder="Enter value in (mm)" id="b" required>' +
                '<label for="c">Enter the value of c:</label><input type="number" placeholder="Enter value in (mm)" id="c" required>' +
                '<label for="d">Enter the value of d:</label><input type="number" placeholder="Enter value in (mm)" id="d" required>'+
                '<label for="e">Enter the value of e:</label><input type="number" placeholder="Enter value in (mm)" id="e" required>' +
                '<label for="f">Enter the value of f:</label><input type="number" placeholder="Enter value in (mm)" id="f" required>';
                crossSectionImage.src="i secton 2.jpg"
            break;
        case 't-section':
            formContent = '<label for="bc">Flange Width (bc):</label><input type="number" placeholder="Enter value in (mm)" id="bc" required>' +
                '<label for="hc">Flange Height (hc):</label><input type="number" placeholder="Enter value in (mm)" id="hc" required>' +
                '<label for="bw">Web Width (bw):</label><input type="number" placeholder="Enter value in (mm)" id="bw" required>' +
                '<label for="hw">Web Height (hw):</label><input type="number" placeholder="Enter value in (mm)" id="hw" required>';
                crossSectionImage.src="t-section.png"
                break;
        case 'l-section':
                    formContent = '<label for="H">Enter the Value of H :</label><input type="number" placeholder="Enter value in (mm)" id="H" required>' +
                        '<label for="B">Enter the value of B:</label><input type="number" placeholder="Enter value in (mm)" id="B" required>' +
                        '<label for="t">Enter the value of t:</label><input type="number" placeholder="Enter value in (mm)" id="t" required>' 
                        ;
                        crossSectionImage.src="l section.png"
                        break;
               
        default:
            formContent = ''; // Empty form for unknown cross-sections
    }
    crossSectionForm.innerHTML = formContent;
}

function calculateAndShowResults() {
    calculate();
    // Display results immediately after calculation
    resultsSection.classList.add('show');
}

calculateButton.addEventListener('click', calculateAndShowResults);

crossSectionSelect.addEventListener('change', () => {
    // Hide results when cross-section selection changes
    resultsSection.classList.remove('show');
    const selectedCrossSection = crossSectionSelect.value;
    // crossSectionImage.src = `${selectedCrossSection}.png`;
    crossSectionImage.style.display = 'block';
});

// Calculate Ixx and Iyy relative to the centroidal axis
function calculate() {
    const selectedCrossSection = crossSectionSelect.value;
    let centroidX = 0;
    let centroidY = 0;
    let momentOfInertiaX = 0;
    let momentOfInertiaY = 0;
    let momentOfInertiaZ = 0;

    switch (selectedCrossSection) {

        case 'circle':
            const radius = parseFloat(document.getElementById('radius').value);
            centroidX = 0;
            centroidY = 0;
            momentOfInertiaX = (Math.PI * Math.pow(radius, 4)) / 4;
            momentOfInertiaY = (Math.PI * Math.pow(radius, 4)) / 4;
            momentOfInertiaZ = momentOfInertiaX+momentOfInertiaY; 
            break;
            case 'rectangle':
            const width = parseFloat(document.getElementById('width').value);
            const length = parseFloat(document.getElementById('length').value);
            centroidX = width / 2;
            centroidY = length / 2;
            momentOfInertiaX = (width * Math.pow(length, 3)) / 12 ;
            momentOfInertiaY = (length * Math.pow(width, 3)) / 12;
            momentOfInertiaZ = momentOfInertiaX+momentOfInertiaY; 
            break;
        case 'square':
            const side = parseFloat(document.getElementById('side').value);
            centroidX = side / 2;
            centroidY = side / 2;
            momentOfInertiaX = (side * Math.pow(side, 3)) / 12;
            momentOfInertiaY = (side * Math.pow(side, 3)) / 12;
            momentOfInertiaZ = momentOfInertiaX+momentOfInertiaY; 
            break;
        case 'triangle':
            const base = parseFloat(document.getElementById('base').value);
            const triangleHeight = parseFloat(document.getElementById('height-triangle').value);
            centroidX = base / 2;
            centroidY = triangleHeight / 3;
            momentOfInertiaX = (base * Math.pow(triangleHeight, 3)) / 36;
            momentOfInertiaY = (triangleHeight * Math.pow(base, 3)) / 36;
            momentOfInertiaZ = momentOfInertiaX+momentOfInertiaY; 
            break;
    
        case 'i-section':
            const a = parseFloat(document.getElementById('a').value);
            const b = parseFloat(document.getElementById('b').value);
            const c = parseFloat(document.getElementById('c').value);
            const d = parseFloat(document.getElementById('d').value);
            const e = parseFloat(document.getElementById('e').value);
            const f = parseFloat(document.getElementById('f').value);

            const a1 = a*b ;
            const a2 = f*c ;
            const a3 = e*d;
            const x1 = a/2;
            const x2 = a/2;
            const x3 = a/2;
            const y1 = d+c+(b/2);
            const y2 = d+(c/2);
            const y3 = d/2 ;

            centroidX = ((a1 * x1) + (a2 * x2) + (a3*x3)) / (a1 + a2 + a3);
            centroidY = ((a1 * y1) + (a2 * y2) + (a3*y3)) / (a1 + a2 + a3);
            momentOfInertiaX = ((a * Math.pow(b, 3)) / 12) +((f * Math.pow(c, 3)) / 12)+
            ((e* Math.pow(d,3)) / 12) + (a1 * Math.pow(y1 - centroidY, 2)) + (a2 * Math.pow(y2 - centroidY, 2)) 
            +(a3 * Math.pow(y3-centroidY,2));
            momentOfInertiaY = ((b * Math.pow(a, 3)) / 12) +((c * Math.pow(f, 3)) / 12)+
            ((d* Math.pow(e,3)) / 12) + (a1 * Math.pow(x1 - centroidX, 2)) + (a2 * Math.pow(x2 - centroidX, 2)) 
            +(a3 * Math.pow(x3-centroidX,2));
            momentOfInertiaZ = momentOfInertiaX+momentOfInertiaY; 
            break;
            case 't-section':
            const bc = parseFloat(document.getElementById('bc').value);
            const hc = parseFloat(document.getElementById('hc').value);
            const bw = parseFloat(document.getElementById('bw').value);
            const hw = parseFloat(document.getElementById('hw').value);

            const a1T = hc*bc;
            const a2T = hw*bw;
            const x1T = bc/2;
            const x2T = bc/2;
            const y1T = hw + (hc/2);
            const y2T = hw/2;
            

            centroidX = ((a1T * x1T) + (a2T * x2T)) / (a1T + a2T);
            centroidY = ((a1T * y1T) + (a2T * y2T)) / (a1T + a2T);
            momentOfInertiaX = ((bc * Math.pow(hc, 3)) / 12) +
                ((bw * Math.pow(hw, 3)) / 12) + (a1T * Math.pow(y1T - centroidY, 2)) + (a2T * Math.pow(y2T - centroidY, 2));
            momentOfInertiaY = (Math.pow(bc, 3) * hc) / 12 +
             (hw * Math.pow(bw, 3)) / 12 + (a1T * Math.pow(x1T - centroidX, 2)) + (a2T * Math.pow(x2T - centroidX, 2));
            momentOfInertiaZ = momentOfInertiaX+momentOfInertiaY; 
            break;
            case 'l-section':
                const H = parseFloat(document.getElementById('H').value);
                const B = parseFloat(document.getElementById('B').value);
                const t = parseFloat(document.getElementById('t').value);
                 
                const H1 = H-t;
                const a1L = H1*t;
                const a2L = B*t;
                const X1L = t/2;
                const X2L = B/2;
                const Y1L = t+(H1/2);
                const Y2L = t/2;

                centroidX = ((a1L * X1L) + (a2L * X2L)) / (a1L + a2L);
                centroidY = ((a1L * Y1L) + (a2L * Y2L)) / (a1L + a2L);
                momentOfInertiaX = ((t * Math.pow(H1, 3)) / 12) +
                ((B * Math.pow(t, 3)) / 12) + (a1L * Math.pow(Y1L - centroidY, 2)) + (a2L * Math.pow(Y2L - centroidY, 2));
                 momentOfInertiaY = (Math.pow(H1, 3) * t) / 12 +
                (t * Math.pow(B, 3)) / 12 + (a1L * Math.pow(Y1L - centroidX, 2)) + (a2L * Math.pow(X2L - centroidX, 2));
                momentOfInertiaZ = momentOfInertiaX+momentOfInertiaY; 

                break;


        default:
            break;
    }
   
    centroidResult.textContent = `(${centroidX.toFixed(2)} mm, ${centroidY.toFixed(2)}mm)`;
    momentOfInertiaXResult.textContent = `${momentOfInertiaX.toFixed(2)} mm^4`;
    momentOfInertiaYResult.textContent = `${momentOfInertiaY.toFixed(2)} mm^4`;
    momentOfInertiaZResult.textContent = `${momentOfInertiaZ.toFixed(2)} mm^4`;
}

