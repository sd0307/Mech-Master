// Predefined allowable stresses and shear stresses for different materials
var allowableStresses = {
    steel: 250, // MPa
    copper: 100, // MPa
    aluminum: 70, // MPa
    rcc: 5 // MPa
};

var allowableShearStresses = {
    steel: 140, // MPa
    copper: 40, // MPa
    aluminum: 25, // MPa
    rcc: 0.4 // MPa
};

function calculateDiameter() {
    var L = parseFloat(document.getElementById('shaftLength').value);
    var x = parseFloat(document.getElementById('gearPosition').value);
    var F = parseFloat(document.getElementById('appliedLoad').value);
    var P = parseFloat(document.getElementById('power').value);
    var N = parseFloat(document.getElementById('speed').value);
    var material = document.getElementById('material').value;
    // var safetyFactor = parseFloat(document.getElementById('safetyFactor').value);

    var sigma = allowableStresses[material];
    var tau = allowableShearStresses[material];

    // Calculate maximum bending moment (M)
    var M = F * (L - x);

    // Calculate torsion (T)
    var T = 9.55 * P / N;

    // Combine bending moment and torsion
    var Me = 0.5 * (M + Math.sqrt(M ** 2 + T ** 2));
    var Te = Math.sqrt(M ** 2 + T ** 2);

    // Calculate maximum allowable diameter
    var d1 = Math.pow(32 * Me / (Math.PI * sigma), 1/3);
    var d2 = Math.pow(16 * Te / (Math.PI  * tau), 1/3);
    var d = Math.max(d1, d2);

    // Display result
    var resultDiv = document.getElementById('result');
    if (!isNaN(d)) {
        resultDiv.innerHTML = "Maximum allowable diameter: " + d.toFixed(2) + " m<br>" +
                              "Combined Bending Moment (Me): " + Me.toFixed(2) + " Nm<br>" +
                              "Combined Torsion (Te): " + Te.toFixed(2) + " Nm";
        
    } else {
        resultDiv.innerHTML = "Please enter valid inputs.";
    }

    // Draw beam and gear diagrams
    drawDiagrams(L, x, F);
}

// Dynamically populate allowable stress and shear stress fields based on selected material
document.getElementById('material').addEventListener('change', function() {
    var material = this.value;
    var allowableStress = allowableStresses[material];
    var allowableShearStress = allowableShearStresses[material];

    document.getElementById('allowableStressContainer').innerHTML = '<label for="allowableStress">Allowable Stress (MPa):</label><input type="number" id="allowableStress" value="' + allowableStress + '" disabled>';
    document.getElementById('allowableShearStressContainer').innerHTML = '<label for="allowableShearStress">Allowable Shear Stress (MPa):</label><input type="number" id="allowableShearStress" value="' + allowableShearStress + '" disabled>';
});

// Function to draw beam diagram
function drawBeam(L, canvasWidth) {
    var canvas = document.getElementById('diagramCanvas');
    var ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate starting point for beam diagram
    var startX = (canvasWidth - 20 * L) / 2;

    // Set canvas width
    canvas.width = canvasWidth;

    // Draw beam
    ctx.beginPath();
    ctx.moveTo(startX, 100);
    var beamEndX = startX + 20 * L;
    ctx.lineTo(beamEndX, 100);
    ctx.lineWidth = 5;
    ctx.stroke();

    // Label length of beam
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(L + 'm', (startX + beamEndX) / 2, 130);

    // Draw supports (A and B)
    ctx.fillStyle = 'gray';
    ctx.fillRect(startX - 10, 90, 20, 20); // Left support A
    ctx.fillRect(beamEndX - 10, 90, 20, 20); // Right support B
    ctx.fillStyle = 'black';
    ctx.fillText('A', startX, 108);
    ctx.fillText('B', beamEndX, 108);
}

// Function to draw load diagram
function drawLoad(L, x, F, canvasWidth) {
    var canvas = document.getElementById('diagramCanvas');
    var ctx = canvas.getContext('2d');

    // Calculate starting point for load diagram
    var startX = (canvasWidth - 20 * L) / 2;

    // Draw load
    var loadX = startX + x * 20;
    var loadY = 100;
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.arc(loadX, loadY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText(F + 'N', loadX, loadY + 7);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    for (var i = 0; i < 8; i++) {
        var angle = (i * 45) * Math.PI / 180;
        var x1 = loadX + 15 * Math.cos(angle);
        var y1 = loadY + 15 * Math.sin(angle);
        var x2 = loadX + 20 * Math.cos(angle);
        var y2 = loadY + 20 * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

// Function to handle input change
function handleInputChange() {
    var L = parseFloat(document.getElementById('shaftLength').value);
    var x = parseFloat(document.getElementById('gearPosition').value);
    var F = parseFloat(document.getElementById('appliedLoad').value);
    var canvas = document.getElementById('diagramCanvas');

    if (!isNaN(L)) {
        var canvasWidth = 20 * L + 100; // Calculate required canvas width
        drawBeam(L, canvasWidth);
        if (!isNaN(F) && !isNaN(x)) {
            drawLoad(L, x, F, canvasWidth);
        }
    }
}

// Add event listeners to inputs
document.getElementById('shaftLength').addEventListener('input', handleInputChange);
document.getElementById('gearPosition').addEventListener('input', handleInputChange);
document.getElementById('appliedLoad').addEventListener('input', handleInputChange);



