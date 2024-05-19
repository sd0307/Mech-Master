function calculate() {
    const springType = document.getElementById("springType").value;
    const materialType = document.getElementById("materialType").value;
    const load = parseFloat(document.getElementById("load").value); // Load in N
    const springDiameter = parseFloat(document.getElementById("springDiameter").value); // Diameter in mm
    const wireDiameter = parseFloat(document.getElementById("wireDiameter").value); // Diameter in mm
    const turns = parseFloat(document.getElementById("turns").value);
    let helixAngle = 0;
    if (springType === "open") {
        helixAngle = parseFloat(document.getElementById("helixAngle").value);
    }

    // Perform calculations based on spring type
    let results = {};
    const R = springDiameter / 2; // Spring radius in mm
    const G = getModulusOfRigidity(materialType); // Modulus of rigidity in Pa (N/mm^2)
    const E = getYoungsModulus(materialType); // Young's modulus in Pa (N/mm^2)
    const I = (Math.PI * Math.pow(wireDiameter, 4)) / 64; // Moment of inertia in mm^4
    const J = (Math.PI * Math.pow(wireDiameter, 4)) / 32; // Polar moment of inertia in mm^4
    const sinAlpha = Math.sin(helixAngle);
    const cosAlpha = Math.cos(helixAngle);
    const secAlpha = 1 / cosAlpha;

    if (springType === "closed") {
        const tau = (16 * load * R) / (Math.PI * Math.pow(wireDiameter, 3)); // Shear stress in N/mm^2
        const U = (32 * Math.pow(load, 2) * Math.pow(R, 3) * turns) / (G * Math.pow(wireDiameter, 4)); // Strain energy in Nmm
        const deflection = (64 * load * Math.pow(R, 3) * turns) / (G * Math.pow(wireDiameter, 4)); // Deflection in mm
        const stiffness = load / deflection; // Stiffness in N/mm
        results = { tau, U, deflection, stiffness };
    } else if (springType === "open") {
        const U = ((Math.pow(load, 2) * Math.pow(R, 2) * 2 * Math.PI * R * turns * secAlpha) *
            (G * J * Math.pow(sinAlpha, 2) + E * I * Math.pow(cosAlpha, 2))) / (2 * E * I * G * J); // Strain energy in Nmm
        const deflection = ((2 * Math.PI * load * Math.pow(R, 3) * turns * secAlpha) *
            (G * J * Math.pow(sinAlpha, 2) + E * I * Math.pow(cosAlpha, 2))) / (E * I * G * J); // Deflection in mm
        const stiffness = load / deflection; // Stiffness in N/mm
        const bendingStress = (16 * load * R * (sinAlpha + 1)) / (Math.PI * Math.pow(wireDiameter, 3)); // Bending stress in N/mm^2
        results = { U, deflection, stiffness, bendingStress };
    }

    displayResults(results, springType);
}

function toggleHelixAngle() {
    const springType = document.getElementById("springType").value;
    const helixAngleInput = document.getElementById("helixAngleInput");
    if (springType === "open") {
        helixAngleInput.style.display = "block";
    } else {
        helixAngleInput.style.display = "none";
    }
}

function displayResults(results, springType) {
    const resultsDiv = document.getElementById("results");
    let html = `<h2>Results</h2>
                <p>Strain Energy (U): ${results.U ? results.U.toFixed(2) + ' Nmm' : '-'}</p>
                <p>Deflection (δ): ${results.deflection ? results.deflection.toFixed(2) + ' mm' : '-'}</p>
                <p>Stiffness (k): ${results.stiffness ? results.stiffness.toFixed(2) + ' N/mm' : '-'}</p>`;
                
    if (springType === 'open' && results.bendingStress) {
        html += `<p>Bending Stress (σ): ${results.bendingStress.toFixed(2) + ' N/mm<sup>2</sup>'}</p>`;
    } else if (springType === 'closed' && results.tau) {
        html += `<p>Shear Stress (τ): ${results.tau.toFixed(2) + ' N/mm<sup>2</sup>'}</p>`;
    }

    resultsDiv.innerHTML = html;
}


function getYoungsModulus(materialType) {
    switch (materialType) {
        case "copper":
            return 110 * Math.pow(10, 3); // Pa to N/mm^2
        case "aluminium":
            return 70 * Math.pow(10, 3);
        case "steel":
            return 210 * Math.pow(10, 3);
        case "rcc":
            return 25 * Math.pow(10, 3);
        default:
            return 0;
    }
}

function getModulusOfRigidity(materialType) {
    switch (materialType) {
        case "copper":
            return 42 * Math.pow(10, 3); // Pa to N/mm^2
        case "aluminium":
            return 26 * Math.pow(10, 3);
        case "steel":
            return 80 * Math.pow(10, 3);
        case "rcc":
            return 12 * Math.pow(10, 3);
        default:
            return 0;
    }
}
