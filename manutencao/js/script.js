
// Estado da aplicação - armazenamento em memória
let users = [
  { name: 'Usuário Demo', email: 'demo@email.com', password: 'Demo123!', id: 1 }
];
let vehicles = [];
let currentUser = null;
let editingIndex = null;

// Funções utilitárias
function showPage(pageId) {
  document.querySelectorAll('.container').forEach(container => {
    container.style.display = 'none';
  });
  const page = document.getElementById(pageId);
  if (page) {
    page.style.display = 'block';
  }

  // Limpar formulários ao trocar de página
  if (pageId === 'loginPage') {
    const form = document.getElementById('loginForm');
    if (form) form.reset();
    clearErrors();
  } else if (pageId === 'registerPage') {
    const form = document.getElementById('registerForm');
    if (form) form.reset();
    clearErrors();
    resetPasswordChecks();
  } else if (pageId === 'homePage') {
    updateWelcomeMessage();
    renderTable();
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(error => {
    error.style.display = 'none';
  });
  document.querySelectorAll('.success-message').forEach(msg => {
    msg.style.display = 'none';
  });
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    if (message) {
      errorElement.textContent = message;
    }
    errorElement.style.display = 'block';
  }
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const lengthCheck = document.getElementById('lengthCheck');
  const upperCheck = document.getElementById('upperCheck');
  const numberCheck = document.getElementById('numberCheck');
  const specialCheck = document.getElementById('specialCheck');

  if (lengthCheck) lengthCheck.classList.toggle('valid', hasLength);
  if (upperCheck) upperCheck.classList.toggle('valid', hasUpper);
  if (numberCheck) numberCheck.classList.toggle('valid', hasNumber);
  if (specialCheck) specialCheck.classList.toggle('valid', hasSpecial);

  return hasLength && hasUpper && hasNumber && hasSpecial;
}

function resetPasswordChecks() {
  ['lengthCheck', 'upperCheck', 'numberCheck', 'specialCheck'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove('valid');
    }
  });
}

function updateWelcomeMessage() {
  if (currentUser) {
    const welcomeElement = document.getElementById('welcomeMsg');
    if (welcomeElement) {
      welcomeElement.textContent = `Bem-vindo, ${currentUser.name}!`;
    }
  }
}

// Funções de autenticação
function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    return true;
  }
  return false;
}

function logout() {
  if (confirm('Deseja realmente sair?')) {
    currentUser = null;
    editingIndex = null;
    showPage('loginPage');
  }
}

function registerUser(name, email, password) {
  if (users.find(u => u.email === email)) {
    return false; // Email já cadastrado
  }

  const newUser = {
    name,
    email,
    password,
    id: Date.now()
  };
  users.push(newUser);
  return true;
}

// Funções de veículos
function renderTable() {
  const tbody = document.querySelector('#vehicleTable tbody');
  const emptyState = document.getElementById('emptyState');
  const table = document.getElementById('vehicleTable');

  if (!tbody || !emptyState || !table) return;

  tbody.innerHTML = '';

  // Filtrar veículos do usuário atual
  const userVehicles = vehicles.filter(v => v.userId === currentUser?.id);

  if (userVehicles.length === 0) {
    table.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  table.style.display = 'table';
  emptyState.style.display = 'none';

  userVehicles.forEach((vehicle, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
                    <td>${vehicle.marca}</td>
                    <td>${vehicle.modelo}</td>
                    <td>${vehicle.ano}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="small edit" onclick="editVehicle(${index})">Editar</button>
                            <button class="small danger" onclick="deleteVehicle(${index})">Excluir</button>
                        </div>
                    </td>
                `;
    tbody.appendChild(row);
  });
}

function editVehicle(index) {
  const userVehicles = vehicles.filter(v => v.userId === currentUser?.id);
  const vehicle = userVehicles[index];
  const globalIndex = vehicles.findIndex(v => v === vehicle);

  const marcaInput = document.getElementById('marca');
  const modeloInput = document.getElementById('modelo');
  const anoInput = document.getElementById('ano');

  if (marcaInput) marcaInput.value = vehicle.marca;
  if (modeloInput) modeloInput.value = vehicle.modelo;
  if (anoInput) anoInput.value = vehicle.ano;

  editingIndex = globalIndex;

  const formTitle = document.getElementById('formTitle');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  if (formTitle) formTitle.textContent = 'Editar Veículo';
  if (submitBtn) submitBtn.textContent = 'Salvar Alterações';
  if (cancelBtn) cancelBtn.style.display = 'block';

  // Scroll para o formulário
  const formContainer = document.querySelector('.vehicle-form-container');
  if (formContainer) {
    formContainer.scrollIntoView({ behavior: 'smooth' });
  }
}

function cancelEdit() {
  editingIndex = null;
  const form = document.getElementById('vehicleForm');
  if (form) form.reset();

  const formTitle = document.getElementById('formTitle');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  if (formTitle) formTitle.textContent = 'Cadastrar Novo Veículo';
  if (submitBtn) submitBtn.textContent = 'Cadastrar Veículo';
  if (cancelBtn) cancelBtn.style.display = 'none';

  clearErrors();
}

function deleteVehicle(index) {
  if (confirm('Deseja realmente excluir este veículo?')) {
    const userVehicles = vehicles.filter(v => v.userId === currentUser?.id);
    const vehicle = userVehicles[index];
    const globalIndex = vehicles.findIndex(v => v === vehicle);

    vehicles.splice(globalIndex, 1);
    renderTable();
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');

      if (!emailInput || !passwordInput) return;

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      clearErrors();

      if (!validateEmail(email)) {
        showError('loginEmailError', 'Email inválido');
        return;
      }

      if (login(email, password)) {
        showPage('homePage');
      } else {
        showError('loginPasswordError', 'Email ou senha incorretos');
      }
    });
  }

  // Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirmPassword');

      if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) return;

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      let hasError = false;
      clearErrors();

      if (name.length < 3) {
        showError('nameError');
        hasError = true;
      }

      if (!validateEmail(email)) {
        showError('emailError', 'Email inválido');
        hasError = true;
      }

      if (!validatePassword(password)) {
        hasError = true;
      }

      if (password !== confirmPassword) {
        showError('passwordError');
        hasError = true;
      }

      if (!hasError) {
        if (registerUser(name, email, password)) {
          const successMsg = document.getElementById('registerSuccess');
          if (successMsg) {
            successMsg.style.display = 'block';
          }
          setTimeout(() => {
            showPage('loginPage');
          }, 2000);
        } else {
          showError('emailError', 'Este email já está cadastrado');
        }
      }
    });
  }

  // Forgot Password Form
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('recoveryEmail');
      if (!emailInput) return;

      const email = emailInput.value.trim();

      clearErrors();

      if (!validateEmail(email)) {
        showError('recoveryEmailError', 'Email inválido');
        return;
      }

      const userExists = users.find(u => u.email === email);
      if (!userExists) {
        showError('recoveryEmailError', 'Email não cadastrado');
        return;
      }

      const successMsg = document.getElementById('recoverySuccess');
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      setTimeout(() => {
        showPage('loginPage');
      }, 3000);
    });
  }

  // Vehicle Form
  const vehicleForm = document.getElementById('vehicleForm');
  if (vehicleForm) {
    vehicleForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const marcaInput = document.getElementById('marca');
      const modeloInput = document.getElementById('modelo');
      const anoInput = document.getElementById('ano');

      if (!marcaInput || !modeloInput || !anoInput) return;

      const marca = marcaInput.value.trim();
      const modelo = modeloInput.value.trim();
      const ano = anoInput.value;

      clearErrors();
      let hasError = false;

      if (!marca) {
        showError('marcaError');
        hasError = true;
      }

      if (!modelo) {
        showError('modeloError');
        hasError = true;
      }

      if (!ano || ano < 1900 || ano > 2030) {
        showError('anoError');
        hasError = true;
      }

      if (!hasError && currentUser) {
        const vehicleData = {
          marca,
          modelo,
          ano: parseInt(ano),
          userId: currentUser.id
        };

        if (editingIndex !== null) {
          vehicles[editingIndex] = vehicleData;
          cancelEdit();
        } else {
          vehicles.push(vehicleData);
        }

        vehicleForm.reset();
        renderTable();
      }
    });
  }

  // Password validation on input
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', function (e) {
      validatePassword(e.target.value);
    });
  }

  // Inicialização - mostrar página de login
  showPage('loginPage');
});

// Tornar funções globais para onclick
window.showPage = showPage;
window.logout = logout;
window.editVehicle = editVehicle;
window.deleteVehicle = deleteVehicle;
window.cancelEdit = cancelEdit;