function calculate() {
    var thickness = parseFloat(document.getElementById("thickness").value);
    var diameter = parseFloat(document.getElementById("diameter").value);
    // var length = parseFloat(document.getElementById("length").value);
    var material = document.getElementById("material").value;
    var permissiblePressure = parseFloat(document.getElementById("pressure").value);

    if (isNaN(permissiblePressure) || permissiblePressure <= 0) {
        alert("Please enter a valid permissible pressure.");
        return;
    }

    var E, mew;
    // Assign values of E and mew based on material
    switch (material) {
        case "steel":
            E = 200000; // Young's Modulus for steel in MPa
            mew = 0.3; // Poisson's Ratio for steel
            break;
        case "copper":
            E = 117000; // Young's Modulus for copper in MPa
            mew = 0.34; // Poisson's Ratio for copper
            break;
        case "aluminium":
            E = 70000; // Young's Modulus for aluminium in MPa
            mew = 0.35; // Poisson's Ratio for aluminium
            break;
        case "rcc":
            E = 25000; // Young's Modulus for RCC in MPa
            mew = 0.2; // Poisson's Ratio for RCC
            break;
        default:
            alert("Please select a material");
            return;
    }

    var hoopStress = (permissiblePressure * diameter) / (2 * thickness);
    var longitudinalStress = (permissiblePressure * diameter) / (4 * thickness);
    var diametricalStrain = ((permissiblePressure * diameter) * (2 - mew)) / (4 * thickness * E);
    var longitudinalStrain = ((permissiblePressure * diameter) * (1 - 2 * mew)) / (4 * thickness * E);
    var volumetricStrain = ((permissiblePressure * diameter) * (5 - 4 * mew)) / (4 * thickness * E);
    var maxShearStress = (permissiblePressure * diameter) / (8 * thickness);

    // Display results
    var resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <p><strong>Hoop Stress:</strong> ${hoopStress.toFixed(2)} N/mm²</p>
        <p><strong>Longitudinal Stress:</strong> ${longitudinalStress.toFixed(2)} N/mm²</p>
        <p><strong>Diametrical Strain:</strong> ${diametricalStrain.toFixed(6)}</p>
        <p><strong>Longitudinal Strain:</strong> ${longitudinalStrain.toFixed(6)}</p>
        <p><strong>Volumetric Strain:</strong> ${volumetricStrain.toFixed(6)}</p>
        <p><strong>Maximum Shear Stress:</strong> ${maxShearStress.toFixed(2)} N/mm²</p>
    `;
}
