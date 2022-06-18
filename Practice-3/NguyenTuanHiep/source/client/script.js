
// api url
const api_url = 
      "http://localhost:5000";
  
// Defining async function
async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    if (response) {
        hideloader();
    }
    show(data);
}
// Calling that async function
getapi(api_url);
  
// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}
// Function to define innerHTML for HTML table
function show(data) {
    let tab = 
        `<tr>
            <th>STT</th>
            <th>Name</th>
            <th>Year</th>
            <th>University</th>
            <th>Major</th>
        </tr>`;
    
    // Loop to access all rows
    for (let r of data) {
        tab += `<tr>
    <td>${r.stt} </td>
    <td>${r.name} </td>
    <td>${r.birth}</td>
    <td>${r.university}</td> 
    <td>${r.major}</td>          
</tr>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("data").innerHTML = tab;
}
