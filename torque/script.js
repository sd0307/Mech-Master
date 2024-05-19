const rotationalSpeedInput = document.getElementById('rotational-speed');
const powerInput = document.getElementById('power');
const shearStressInput = document.getElementById('shear-stress');
const angleOfTwistInput = document.getElementById('angle-of-twist');
const shaftLengthInput = document.getElementById('shaft-length');
const materialSelect = document.getElementById('material');
const torqueResult = document.getElementById('torque-result');
const diameterResult = document.getElementById('diameter-result');
const calculateButton = document.getElementById('calculate-button');
const resultSection = document.getElementById('result-section');

calculateButton.addEventListener('click', function(event) {
    event.preventDefault();

    const rotationalSpeed = parseFloat(rotationalSpeedInput.value);
    const power = parseFloat(powerInput.value);
    const shearStress = parseFloat(shearStressInput.value);
    const angleOfTwist = parseFloat(angleOfTwistInput.value);
    const shaftLength = parseFloat(shaftLengthInput.value) || 0; // Use 0 if shaft length is not provided
    const materialType = materialSelect.value;

    // Calculate torque using the power formula
    const calculatedTorque = (power * 60) / (2 * Math.PI * rotationalSpeed);

    let calculatedDiameter;

    if (shaftLength && angleOfTwist) {
        // Calculate two values of diameter
        const diameter1 = Math.pow((16 * calculatedTorque) / (Math.PI * shearStress), 1 / 3);
        const diameter2 = Math.pow((32 * calculatedTorque * shaftLength) / (Math.PI * getShearModulus(materialType) * angleOfTwist), 1 / 4);

        // Choose the larger diameter as the calculated diameter
        calculatedDiameter = Math.max(diameter1, diameter2);
    } else {
        // If shaft length and angle of twist are not provided, use the formula with no shaft length and angle of twist
        calculatedDiameter = Math.pow((16 * calculatedTorque) / (Math.PI * shearStress), 1 / 3);
    }

    torqueResult.textContent = calculatedTorque.toFixed(2) + " N-mm";
    diameterResult.textContent = calculatedDiameter.toFixed(2) + " mm";
    resultSection.style.display = 'block';
});

function getShearModulus(materialType) {
    const shearModulusValues = {
        aluminum: 26.2,      // GPa
        copper: 45,         // GPa
        steel: 79.3,        // GPa
        'stainless-steel': 77.2, // GPa
        'cast-iron': 41,      // GPa
        glass: 27,         // GPa
        default: 78         // Default value
    };

    return shearModulusValues[materialType] || shearModulusValues.default;
}







