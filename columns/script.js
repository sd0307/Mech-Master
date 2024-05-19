//script.js

let selectedTheory; // Declare selectedTheory at a higher scope

const theorySelect = document.getElementById('theory');
const endConditionSelect = document.getElementById('end-condition');
const lengthInput = document.getElementById('length');
const crossSectionSelect = document.getElementById('cross-section');
const materialSelect = document.getElementById('material');
const calculateButton = document.getElementById('calculate');
const resultValue = document.getElementById('result-value');
const endConditionImage = document.getElementById('end-condition-image');

// Constants for material properties

const materialConstants = {
    cu: { youngsModulus: 117000, rankineConstant: 0.0002164, elasticLimitCompression: 250, factorOfSafety: 2 },
    al: { youngsModulus: 70000, rankineConstant: 0.0002202, elasticLimitCompression: 150, factorOfSafety: 1.5 },
    steel: { youngsModulus: 200000, rankineConstant: 0.000144, elasticLimitCompression: 300, factorOfSafety: 3 },
    rcc: { youngsModulus: 24000, rankineConstant: 0.000126, elasticLimitCompression: 30, factorOfSafety: 2 }
};

// Update fields based on the selected theory
theorySelect.addEventListener('change', () => {
    selectedTheory = theorySelect.value; // Set selectedTheory when theory changes
    updateForm();
});

// Update fields based on the selected end condition
endConditionSelect.addEventListener('change', () => {
    const selectedEndCondition = endConditionSelect.value;
    updateEndConditionImage(selectedEndCondition);
});

// Update fields based on the selected cross-section
crossSectionSelect.addEventListener('change', updateForm);

// Call the function on page load
updateForm();

// Function to calculate area and moment of inertia for circle cross-section
function calculateCircleProperties(diameter) {
    const radius = diameter/2;
    const area = Math.PI * radius * radius;
    const momentOfInertia = (Math.PI * radius ** 4) / 4;
    return { area, momentOfInertia };
}

// Function to calculate area and moment of inertia for square cross-section
function calculateSquareProperties(side) {
    const area = side ** 2;
    const momentOfInertia = (side ** 4) / 12;
    return { area, momentOfInertia };
}

// Function to calculate area and moment of inertia for rectangle cross-section
function calculateRectangleProperties(length, width) {
    const area = length * width;
    const momentOfInertia = (width * length ** 3) / 12;
    return { area, momentOfInertia };
}
// Function to calculate area and moment of inertia for triangle cross-section
function calculateTriangleProperties(base, height) {
    const area = (base * height) / 2;
    const momentOfInertia = (base * height ** 3) / 36;
    return { area, momentOfInertia };
}


function calculateHollowCircleProperties(outerDiameter, innerDiameter) {
    const outerRadius = outerDiameter / 2;
    const innerRadius = innerDiameter / 2;
    
    const outerArea = Math.PI * outerRadius * outerRadius;
    const innerArea = Math.PI * innerRadius * innerRadius;

    const area = outerArea - innerArea;
    const momentOfInertia = (Math.PI / 4) * (outerRadius ** 4 - innerRadius ** 4);

    return { area, momentOfInertia };
}


// Function to calculate area and moment of inertia for T-section cross-section
function calculateTSectionProperties(bc,hc,bw,hw) {
    const a1T = hc*bc;
    const a2T = hw*bw;
    const x1T = bc/2;
    const x2T = bc/2;
    const y1T = hw + (hc/2);
    const y2T = hw/2;
            

    const centroidX = ((a1T * x1T) + (a2T * x2T)) / (a1T + a2T);
    const centroidY = ((a1T * y1T) + (a2T * y2T)) / (a1T + a2T);
    const area = a1T+a2T;
    const momentOfInertia = ((bc * Math.pow(hc, 3)) / 12) +
    ((bw * Math.pow(hw, 3)) / 12) + (a1T * Math.pow(y1T - centroidY, 2)) + (a2T * Math.pow(y2T - centroidY, 2));
    return { area, momentOfInertia };
}

// Function to calculate area and moment of inertia for I-section cross-section
function calculateISectionProperties(a,b,c,d,e,f) {

    const a1 = a*b ;
    const a2 = f*c ;
    const a3 = e*d;
    const x1 = a/2;
    const x2 = a/2;
    const x3 = a/2;
    const y1 = d+c+(b/2);
    const y2 = d+(c/2);
    const y3 = d/2 ;

    const centroidX = ((a1 * x1) + (a2 * x2) + (a3*x3)) / (a1 + a2 + a3);
    const centroidY = ((a1 * y1) + (a2 * y2) + (a3*y3)) / (a1 + a2 + a3);


    const area = a1+a2+a3;
    const momentOfInertia = ((a * Math.pow(b, 3)) / 12) +((f * Math.pow(c, 3)) / 12)+
    ((e* Math.pow(d,3)) / 12) + (a1 * Math.pow(y1 - centroidY, 2)) + (a2 * Math.pow(y2 - centroidY, 2)) 
    +(a3 * Math.pow(y3-centroidY,2));
    return { area, momentOfInertia };
}

// Function to calculate area and moment of inertia for L-section cross-section
function calculateLSectionProperties(H,B,t) {
    
    const H1 = H-t;
    const a1L = H1*t;
    const a2L = B*t;
    const X1L = t/2;
    const X2L = B/2;
    const Y1L = t+(H1/2);
    const Y2L = t/2;

    const centroidX = ((a1L * X1L) + (a2L * X2L)) / (a1L + a2L);
    const centroidY = ((a1L * Y1L) + (a2L * Y2L)) / (a1L + a2L);
    const area = a1L+a2L;
    const momentOfInertia = ((t * Math.pow(H1, 3)) / 12) +
    ((B * Math.pow(t, 3)) / 12) + (a1L * Math.pow(Y1L - centroidY, 2)) + (a2L * Math.pow(Y2L - centroidY, 2));
    return { area, momentOfInertia };
}
// Function to calculate equivalent length based on end condition
function calculateEquivalentLength(length, endCondition) {
    let equivalentLength;

    switch (endCondition) {
        case 'both-ends-pinned':
            equivalentLength = length*1000;
            break;
        case 'both-ends-fixed':
            equivalentLength = 0.5 * length*1000;
            break;
        case 'one-end-fixed-one-end-pinned':
            equivalentLength = 0.707 * length*1000;
            break;
        case 'one-end-fixed-one-end-free':
            equivalentLength = 2*length*1000;
            break;
        // Add other cases for additional end conditions
        default:
            equivalentLength = length*1000; // Default to the original length
            break;
    }

    return equivalentLength;
}

// Function to calculate least radius of gyration
function calculateLeastRadiusOfGyration(momentOfInertia, area) {
    const leastRadiusOfGyration = Math.sqrt(momentOfInertia / area);
    return leastRadiusOfGyration;
}

// Function to calculate slenderness ratio
function calculateSlendernessRatio(equivalentLength, leastRadiusOfGyration) {
    const slendernessRatio = equivalentLength / leastRadiusOfGyration;
    return slendernessRatio;
}

// Function to calculate critical load based on Euler's theory
function calculateEulerCriticalLoad(area, momentOfInertia, effectiveLength,material) {
    // Implement Euler's critical load calculation
    // ...
    const materialKey = String(material).toLowerCase();
    const { youngsModulus } = materialConstants[materialKey];
    const criticalLoad = ((Math.PI ** 2 *youngsModulus* momentOfInertia) / (effectiveLength ** 2))/1000;
    return criticalLoad;
}

// Function to calculate critical load based on Rankine-Gordon formula
function calculateRankineGordonCriticalLoad(area, momentOfInertia, effectiveLength,material,slendernessRatio) {
    // Implement Rankine-Gordon critical load calculation
    // ...
    const materialKey = String(material).toLowerCase();
    const { rankineConstant, elasticLimitCompression } = materialConstants[materialKey];
    const criticalLoad = (elasticLimitCompression*area)/(1+(rankineConstant*slendernessRatio*slendernessRatio))/1000;
    return criticalLoad;
}

// Function to calculate critical load based on Johnson Parabolic theory
function calculateJohnsonParabolicCriticalLoad(area, momentOfInertia, effectiveLength,material,slendernessRatio) {
    // Implement Johnson Parabolic critical load calculation
    // ...
    const materialKey = String(material).toLowerCase();
    const { rankineConstant, elasticLimitCompression } = materialConstants[materialKey];
    const criticalLoad = area*( elasticLimitCompression - (rankineConstant*slendernessRatio*slendernessRatio))/1000;
    return criticalLoad;
}
function calculateSafeLoad(criticalLoad, material) {
    const materialKey = String(material).toLowerCase();
    if (materialConstants[materialKey]) {
        const { factorOfSafety } = materialConstants[materialKey];
        const safeLoad = criticalLoad / factorOfSafety;
        return safeLoad;
    } else {
        console.error(`Invalid material key: ${materialKey}`);
        return null;
    }
}

// Function to show/hide fields based on the selected theory and cross-section
function updateForm() {
    selectedTheory = theorySelect.value; // Set selectedTheory here as well

    // Show/hide fields based on selected theory
    switch (selectedTheory) {
        case 'euler':
            // Show fields specific to Euler's Theory
            break;
        case 'rankine-gordon':
            // Show fields specific to Rankine-Gordon Theory
            break;
        // Add other cases for additional theories
    }

    // Show/hide fields based on selected cross-section
    const selectedCrossSection = crossSectionSelect.value;

    // Hide all cross-section fields
    hideAllCrossSectionFields();
    document.getElementById('cross-section-image').style.display = 'none';

    // Show fields specific to the selected cross-section
    switch (selectedCrossSection) {
        case 'circle':
            document.getElementById('circle-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection); // Call this function to display the image
            break;
        case 'square':
            document.getElementById('square-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection);
            break;
        case 'rectangle':
            document.getElementById('rectangle-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection);
            break;
        case 'triangle':
            document.getElementById('triangle-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection);
            break;
        case 'hollow-circle':
            document.getElementById('hollow-circle-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection);
            break;
        case 't-section':
            document.getElementById('t-section-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection);
            break;
        case 'i-section':
            document.getElementById('i-section-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection);
            break;
        case 'l-section':
            document.getElementById('l-section-fields').style.display = 'block';
            updateCrossSectionImage(selectedCrossSection);
            break;        
        // Add similar cases for other cross-section types
    }
    document.getElementById('cross-section-image').style.display = 'none';
}
// Function to update the cross-section image
function updateCrossSectionImage(selectedCrossSection) {
    const crossSectionImage = document.getElementById('cross-section-image');

    // Set the image source based on the selected cross-section
    console.log('Selected Cross Section:', selectedCrossSection);
    switch (selectedCrossSection) {
        case 'circle':
            crossSectionImage.src = 'radius.jpg'; 
            break;
        case 'square':
            crossSectionImage.src = 'square.png';
            break;
        case 'rectangle':
            crossSectionImage.src = 'rec.png'; 
            break;
        case 'triangle':
            crossSectionImage.src = 'triangle.png'; 
            break;
        case 'hollow-circle':
            crossSectionImage.src = 'hollow.jpeg'; 
            break;
        case 't-section':
            crossSectionImage.src = 't-section.png'; 
            break;
        case 'i-section':
            crossSectionImage.src = 'i secton 2.jpg'; 
            break;
        case 'l-section':
            crossSectionImage.src = 'l section.png'; 
            break;
        // Add similar cases for other cross-section types
    }

    // Show the image
    crossSectionImage.style.display = 'block';
    console.log('Image Source:', crossSectionImage.src);
}


// Function to hide all cross-section fields
function hideAllCrossSectionFields() {
    document.getElementById('circle-fields').style.display = 'none';
    document.getElementById('square-fields').style.display = 'none';
    document.getElementById('rectangle-fields').style.display = 'none';
    document.getElementById('triangle-fields').style.display = 'none';
    document.getElementById('hollow-circle-fields').style.display = 'none';
    document.getElementById('t-section-fields').style.display = 'none';
    document.getElementById('i-section-fields').style.display = 'none';
    document.getElementById('l-section-fields').style.display = 'none';
    // Hide fields for other cross-section types
}

// Function to update the end condition image
function updateEndConditionImage(endCondition) {
    // Set the image source based on the selected end condition
    switch (endCondition) {
        case 'both-ends-pinned':
            endConditionImage.src = '2.png';
            break;
        case 'both-ends-fixed':
            endConditionImage.src = '4.png';
            break;
        case 'one-end-fixed-one-end-pinned':
            endConditionImage.src = '3.png';
            break;
        case 'one-end-fixed-one-end-free':
            endConditionImage.src = '1.png';
            break;
        // Add other end conditions as needed
        default:
            // Set a default image or hide the image
            endConditionImage.src = '';
            break;
    }

    // Show the image
    endConditionImage.style.display = 'block';
}

// Function to calculate critical load
function calculateCriticalLoad() {
    // Get inputs
    const length = parseFloat(lengthInput.value);
    const crossSection = crossSectionSelect.value;
    const endCondition = endConditionSelect.value;
    const material = materialSelect.value;

    // Calculate area and moment of inertia based on cross-section type
    let { area, momentOfInertia } = { area: 0, momentOfInertia: 0 };

    switch (crossSection) {
        case 'circle':
            const circleDiameter = parseFloat(document.getElementById('circle-diameter').value);
            ({ area, momentOfInertia } = calculateCircleProperties(circleDiameter));
            break;
        case 'square':
            const squareSide = parseFloat(document.getElementById('square-side').value);
            ({ area, momentOfInertia } = calculateSquareProperties(squareSide));
            break;
        case 'rectangle':
            const rectangleLength = parseFloat(document.getElementById('rectangle-length').value);
            const rectangleWidth = parseFloat(document.getElementById('rectangle-width').value);
            ({ area, momentOfInertia } = calculateRectangleProperties(rectangleLength, rectangleWidth));
            break;
        case 'triangle':
                const triangleBase = parseFloat(document.getElementById('triangle-base').value);
                const triangleHeight = parseFloat(document.getElementById('triangle-height').value);
                ({ area, momentOfInertia } = calculateTriangleProperties(triangleBase, triangleHeight));
                break;
        case 'hollow-circle':
            const outerDiameter = parseFloat(document.getElementById('hollow-circle-outer-diameter').value);
            const innerDiameter = parseFloat(document.getElementById('hollow-circle-inner-diameter').value);
            ({ area, momentOfInertia } = calculateHollowCircleProperties(outerDiameter, innerDiameter));
            break;
                
        case 't-section':
                const bc = parseFloat(document.getElementById('bc').value);
                const hc = parseFloat(document.getElementById('hc').value);
                const bw = parseFloat(document.getElementById('bw').value);
                const hw = parseFloat(document.getElementById('hw').value);
                ({ area, momentOfInertia } = calculateTSectionProperties(bc,hc,bw,hw));
                break;
        case 'i-section':
                const a = parseFloat(document.getElementById('a').value);
                const b = parseFloat(document.getElementById('b').value);
                const c = parseFloat(document.getElementById('c').value);
                const d = parseFloat(document.getElementById('d').value);
                const e = parseFloat(document.getElementById('e').value);
                const f = parseFloat(document.getElementById('f').value);
                ({ area, momentOfInertia } = calculateISectionProperties(a,b,c,d,e,f));
                break;
        case 'l-section':
                const H = parseFloat(document.getElementById('H').value);
                const B = parseFloat(document.getElementById('B').value);
                const t = parseFloat(document.getElementById('t').value);
                ({ area, momentOfInertia } = calculateLSectionProperties(H,B,t));
                break;        
        
        // Add cases for other cross-section types
    }

    console.log('Area:', area);
    console.log('Moment of Inertia:', momentOfInertia);

    // Calculate equivalent length, least radius of gyration, and slenderness ratio
    const effectiveLength = calculateEquivalentLength(length, endCondition);
    const leastRadiusOfGyration = calculateLeastRadiusOfGyration(momentOfInertia, area);
    const slendernessRatio = calculateSlendernessRatio(effectiveLength, leastRadiusOfGyration);

    console.log('Effective Length:', effectiveLength);
    console.log('Least Radius of Gyration:', leastRadiusOfGyration);
    console.log('Slenderness Ratio:', slendernessRatio);

    // Calculate critical load based on selected theory
    let criticalLoad;

    switch (selectedTheory) {
        case 'euler':
            criticalLoad = calculateEulerCriticalLoad(area, momentOfInertia, effectiveLength,material);
            break;
        case 'rankine-gordon':
            criticalLoad = calculateRankineGordonCriticalLoad(area, momentOfInertia, effectiveLength,material,slendernessRatio);
            break;
        case 'johnson-parabolic':
            criticalLoad = calculateJohnsonParabolicCriticalLoad(area, momentOfInertia, effectiveLength,material,slendernessRatio);
            break;
        // Add other cases for additional theories
    }

    console.log('Critical Load:', criticalLoad);
    console.log('Critical Load:', criticalLoad);

    // Calculate safe load based on critical load and factor of safety
    const safeLoad = calculateSafeLoad(criticalLoad, material);

    // Display the results
    resultValue.innerHTML = `Calculated Crippling Load: ${criticalLoad.toFixed(2)} kN<br>`;
    resultValue.innerHTML += `Safe Load: ${safeLoad.toFixed(2)} kN (Factor of Safety: ${materialConstants[String(material).toLowerCase()].factorOfSafety})<br>`;
    resultValue.innerHTML += `Equivalent Length: ${effectiveLength.toFixed(2)} mm<br>`;
    resultValue.innerHTML += `Least Radius of Gyration: ${leastRadiusOfGyration.toFixed(2)} mm<br>`;
    resultValue.innerHTML += `Slenderness Ratio: ${slendernessRatio.toFixed(2)}`;

    // ... (existing code)
}

// Attach the calculation function to the Calculate button
calculateButton.addEventListener('click', calculateCriticalLoad);

// ... (existing code)

