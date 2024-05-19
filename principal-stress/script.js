function calculateResults() {
    var sigma_x = parseFloat(document.getElementById('stressX').value);
    var sigma_y = parseFloat(document.getElementById('stressY').value);
    var tau_xy = parseFloat(document.getElementById('shearXY').value);
    
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Calculate major, minor principal stress, and maximum shear stress
    var sigma_1 = ((sigma_x + sigma_y) + Math.sqrt((sigma_x - sigma_y) ** 2 + 4 * tau_xy ** 2)) / 2;
    var sigma_2 = ((sigma_x + sigma_y) - Math.sqrt((sigma_x - sigma_y) ** 2 + 4 * tau_xy ** 2)) / 2;
    var tau_max = tau_xy == 0 ? (sigma_x - sigma_y) / 2 : (sigma_1 - sigma_2) / 2;

    // Create paragraphs to display the results
    var sigma1Element = document.createElement('p');
    sigma1Element.textContent = 'Major Principal Stress (σ1): ' + sigma_1.toFixed(2) + ' N/mm²'; // Add units to sigma_1
    sigma1Element.style.color = sigma_1 >= 0 ? 'green' : 'red'; // Apply color based on positive/negative value

    var sigma2Element = document.createElement('p');
    sigma2Element.textContent = 'Minor Principal Stress (σ2): ' + sigma_2.toFixed(2) + ' N/mm²'; // Add units to sigma_2
    sigma2Element.style.color = sigma_2 >= 0 ? 'green' : 'red'; // Apply color based on positive/negative value

    var tauMaxElement = document.createElement('p');
    tauMaxElement.textContent = 'Maximum Shear Stress (τmax): ' + tau_max.toFixed(2) + ' N/mm²'; // Add units to tau_max
    tauMaxElement.style.color = tau_max >= 0 ? 'green' : 'red'; // Apply color based on positive/negative value

    // Append results to the container before the table
    resultsContainer.appendChild(sigma1Element);
    resultsContainer.appendChild(sigma2Element);
    resultsContainer.appendChild(tauMaxElement);

    // Create the table to display the detailed results
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    var headers = ['θ', 'σN', 'τ', 'σR'];
    var headerRow = document.createElement('tr');
    headers.forEach(function(headerText) {
        var th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    for (var theta = 1; theta <= 90; theta++) {
        var sigma_n = ((sigma_x + sigma_y) + (sigma_x - sigma_y) * Math.cos(2 * theta * Math.PI / 180)) / 2 + tau_xy * Math.sin(2 * theta * Math.PI / 180);
        var shear_stress = ((sigma_x - sigma_y) * Math.sin(2 * theta * Math.PI / 180)) / 2 - tau_xy * Math.cos(2 * theta * Math.PI / 180);
        var res_stress = Math.sqrt(sigma_n ** 2 + shear_stress ** 2);
        
        var row = document.createElement('tr');
        var cellTheta = document.createElement('td');
        cellTheta.textContent = theta;
        row.appendChild(cellTheta);
        var cellSigmaN = document.createElement('td');
        cellSigmaN.textContent = sigma_n.toFixed(2) ; 
        row.appendChild(cellSigmaN);
        var cellTau = document.createElement('td');
        cellTau.textContent = shear_stress.toFixed(2);
        row.appendChild(cellTau);
        var cellSigmaR = document.createElement('td');
        cellSigmaR.textContent = res_stress.toFixed(2); 
        row.appendChild(cellSigmaR);

        tbody.appendChild(row);
    }

    // Append the table to the container
    table.appendChild(thead);
    table.appendChild(tbody);
    resultsContainer.appendChild(table);

    // Display the results container
    resultsContainer.style.display = 'block';
}
