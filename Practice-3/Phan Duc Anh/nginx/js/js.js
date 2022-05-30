const init = async () => {
  let res = await fetch("/api/attendees", {
    method: "GET",
  })
    .then((response) => {
      if (response.status != 200) {
        return { err: "Error" };
      }
      return response.json();
    })
    .catch((err) => console.log(err));

  if (!res.err) {
    res = eval(res);
    res.forEach((element) => {
      let trElement = document.createElement("tr");
      trElement.innerHTML = `<td>${element.name}</td><td>${element.year_of_birth}</td><td>${element.gender}</td><td>${element.email}</td>`;
      document.querySelector(".info-table").appendChild(trElement);
    });
  } else {
    alert("Something went wrong in the server");
  }
};

init();
