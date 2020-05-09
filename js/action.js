read();
function read() {
  const count = document.getElementById('count');

  const query = {
    query: `{
      findPerson(input: {}) {
        code,
        name,
        age,
        email,
        cpf,
        rg,
        nickname,
        cellphone,
        gender
      }
    }`
  };
  const http = new XMLHttpRequest();
  http.open('POST', 'http://localhost:3001/graphql', true);
  http.setRequestHeader('Content-Type', 'application/json');

  http.onreadystatechange = function() {
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const objJSON = JSON.parse(http.responseText);
      const arrJSON = objJSON.data.findPerson;

      var pageLength = 9;
      var numberPage = 0;

      function page() {
        $('table > tbody > tr').remove();
        var tbody = $('table > tbody');
        for (var data = numberPage * pageLength; data < arrJSON.length && data < (numberPage + 1) *  pageLength; data++) {
          tbody.append(
              $('<tr>')
                .append($('<td>').append(arrJSON[data].code))
                .append($('<td>').append(arrJSON[data].name))
                .append($('<td>').append(arrJSON[data].age))
                .append($('<td>').append(arrJSON[data].email))
                .append($('<td>').append(`<button class="btn btn-info" onclick="select(${arrJSON[data].code})">
                                            Selecionar
                                          </button>`))
          )
        }
        $('#numeration').text('Página ' + (numberPage + 1) + ' de ' + Math.ceil(arrJSON.length / pageLength));
      }

      function adjustButtons() {
        $('#next').prop('disabled', arrJSON.length <= pageLength || numberPage > arrJSON.length / pageLength - 1);
        $('#previous').prop('disabled', arrJSON.length <= pageLength || numberPage == 0);
      }

      $(function() {
        $('#next').click(function() {
          if (numberPage < arrJSON.length / pageLength - 1) {
              numberPage++;
              page();
              adjustButtons();
          }
        });
        $('#previous').click(function() {
          if (numberPage > 0) {
              numberPage--;
              page();
              adjustButtons();
          }
        });
        page();
        adjustButtons();
      })

      let countRecord = `Total de Registros: ${arrJSON.length}`
      count.innerHTML = countRecord;
    }
  }
  http.send(JSON.stringify(query));
}

function select(_code=0) {
  const code = document.getElementById('code');
  const name = document.getElementById('name');
  const age = document.getElementById('age');
  const email = document.getElementById('email');
  const cpf = document.getElementById('cpf');
  const rg = document.getElementById('rg');
  const nickname = document.getElementById('nickname');
  const cellphone = document.getElementById('cellphone');
  const gender = document.getElementById('gender');

  const query = {
    query: `{
      findPersonOne(code: ${_code}) {
        code,
        name,
        age,
        email,
        cpf,
        rg,
        nickname,
        cellphone,
        gender
      }
    }`
  };

  const http = new XMLHttpRequest();
  http.open('POST', 'http://localhost:3001/graphql', true);
  http.setRequestHeader('Content-Type', 'application/json');

  http.onreadystatechange = function() {
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const objJSON = JSON.parse(http.responseText);
      const Person = objJSON.data.findPersonOne;

      code.value = Person.code;
      name.value = Person.name;
      age.value = Person.age;
      email.value = Person.email;
      cpf.value = Person.cpf;
      rg.value = Person.rg;
      nickname.value = Person.nickname;
      cellphone.value = Person.cellphone;
      gender.value = Person.gender;
    }
  }
  http.send(JSON.stringify(query));
}

function clean() {
  document.getElementById('code').value = 0;
  document.getElementById('name').value = '';
  document.getElementById('age').value = '';
  document.getElementById('email').value = '';
  document.getElementById('cpf').value = '';
  document.getElementById('rg').value = '';
  document.getElementById('nickname').value = '';
  document.getElementById('cellphone').value = '';
  document.getElementById('gender').value = '';
  document.getElementById('name').focus();	
}

function save() {
  const code = Number(document.getElementById('code').value);
  const name = document.getElementById('name').value.toString().trim();
  const age = Number(document.getElementById('age').value);
  const email = document.getElementById('email').value.toString().trim();
  const cpf = Number(document.getElementById('cpf').value);
  const rg = Number(document.getElementById('rg').value);
  const nickname = document.getElementById('nickname').value.toString().trim();
  const cellphone = Number(document.getElementById('cellphone').value);
  const gender = document.getElementById('gender').value.toString().trim();

  let query = '';
  if(code>0) {
    query = {
      query: `mutation {
        updatePerson(code: ${code}, input: {
          name: "${name}",
          age: ${age},
          email: "${email}",
          cpf: ${cpf},
          rg: ${rg},
          nickname: "${nickname}",
          cellphone: ${cellphone},
          gender: "${gender}"
        })
      }`
    };
  }else {
    query = {
      query: `mutation {
        insertPerson(input: {
          name: "${name}",
          age: ${age},
          email: "${email}",
          cpf: ${cpf},
          rg: ${rg},
          nickname: "${nickname}",
          cellphone: ${cellphone},
          gender: "${gender}"
        }) {
          code,
          name,
          age,
          email,
          cpf,
          rg,
          nickname,
          cellphone,
          gender
        }
      }`
    };
  }

  const http = new XMLHttpRequest();
  http.open('POST', 'http://localhost:3001/graphql', true);
  http.setRequestHeader('Content-Type', 'application/json');

  http.onreadystatechange = function() {
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      read();
      clean();
    }
  }
  http.send(JSON.stringify(query));	
}

function deleteButton() {
  const code = Number(document.getElementById('code').value);

  if(code>0) {
    const query = {
      query: `mutation {
        deletePerson(code: ${code})
      }`
    };

    const http = new XMLHttpRequest();
    http.open('POST', 'http://localhost:3001/graphql', true);
    http.setRequestHeader('Content-Type', 'application/json');

    http.onreadystatechange = function() {
      if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        read();
        clean();
      }
    }
    http.send(JSON.stringify(query));
  }	
}
