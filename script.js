function formatPhone(raw) {
  const d = String(raw).replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  const head = "(" + d.substring(0, 2) + ") ";
  const rest = d.substring(2);
  if (d.length === 10) {
    return head + rest.substring(0, 4) + "-" + rest.substring(4, 8);
  }
  if (d.length === 11) {
    return head + rest.substring(0, 5) + "-" + rest.substring(5, 9);
  }
  if (rest[0] === "9") {
    if (rest.length <= 5) return head + rest;
    return head + rest.substring(0, 5) + (rest.length > 5 ? "-" + rest.substring(5, 9) : "");
  }
  if (rest.length <= 4) return head + rest;
  return head + rest.substring(0, 4) + (rest.length > 4 ? "-" + rest.substring(4) : "");
}

function formatCPF(raw) {
  const d = String(raw).replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.slice(0, 3) + "." + d.slice(3);
  if (d.length <= 9) return d.slice(0, 3) + "." + d.slice(3, 6) + "." + d.slice(6);
  return d.slice(0, 3) + "." + d.slice(3, 6) + "." + d.slice(6, 9) + "-" + d.slice(9, 11);
}

const form = document.getElementById("ficha-inscricao");
const phone = document.getElementById("field-whatsapp");
const cpf = document.getElementById("field-cpf");

phone.addEventListener("input", function () {
  const next = formatPhone(phone.value);
  if (phone.value !== next) phone.value = next;
});


cpf.addEventListener("input", function () {
  const next = formatCPF(cpf.value);
  if (cpf.value !== next) cpf.value = next;
});


//daqui pra baixo

const msg = document.getElementById("mensagem");
const button = form.querySelector("button");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

// formatar data
if (data.dataDeNascimento) {
  const [ano, mes, dia] = data.dataDeNascimento.split("-");
  data.dataDeNascimento = `${dia}/${mes}/${ano}`;
}

  button.disabled = true;
  button.textContent = "Enviando...";
  msg.classList.add("hidden");

  fetch("https://api.sheetmonkey.io/form/qXv1yFs4rVUgKxipgniUmJ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.ok) {
      msg.textContent = "Cadastro realizado com sucesso! ☕";
      msg.className = "text-green-400 text-sm mt-3";
      form.reset();
    } else {
      msg.textContent = "Erro ao enviar. Tente novamente.";
      msg.className = "text-red-400 text-sm mt-3";
    }
  })
  .catch(() => {
    msg.textContent = "Erro de conexão.";
    msg.className = "text-red-400 text-sm mt-3";
  })
  .finally(() => {
    msg.classList.remove("hidden");
    button.disabled = false;
    button.textContent = "Confirmar";

    setTimeout(() => {
      msg.classList.add("hidden");
    }, 3000);
  });
});