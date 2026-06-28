async function loadOptions() {
    try {
        // Departamentos
        const depts = await fetchData('/departments');
        const selectDept = document.getElementById('user-dept');
        if (selectDept) {
            selectDept.innerHTML = '<option value="">Selecione um Departamento</option>';
            depts.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.name;
                selectDept.appendChild(opt);
            });
        }

        // Usuários
        const users = await fetchData('/users');
        const selectUser = document.getElementById('task-user');
        if (selectUser) {
            selectUser.innerHTML = '<option value="">Selecione um Usuário</option>';
            users.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.id;
                opt.textContent = u.name;
                selectUser.appendChild(opt);
            });
        }

        // Statuses
        const statuses = await fetchData('/statuses');
        const selectStatus = document.getElementById('task-status');
        if (selectStatus) {
            selectStatus.innerHTML = '<option value="">Selecione o Status</option>';
            statuses.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.name;
                selectStatus.appendChild(opt);
            });
        }
    } catch (err) {
        console.error('Error loading options:', err);
    }
}

async function createDepartment() {
    const nameInput = document.getElementById('dept-name');
    const name = nameInput.value.trim();
    if (!name) return showToast('Por favor, informe o nome do departamento.', 'error');
    
    try {
        const res = await postData('/departments', { name });
        if (res.ok) {
            nameInput.value = '';
            loadOptions();
            showToast('Departamento cadastrado com sucesso!');
        } else {
            showToast('Falha ao cadastrar departamento.', 'error');
        }
    } catch (e) {
        showToast('Erro de conexão com o servidor.', 'error');
    }
}

async function createUser() {
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value;
    const birth = document.getElementById('user-birth').value;
    const age = document.getElementById('user-age').value;
    const department_id = document.getElementById('user-dept').value;
    
    if (!name) return showToast('Nome é um campo obrigatório.', 'error');

    try {
        const res = await postData('/users', { 
            name, 
            email, 
            data_nacimento: birth || null, 
            idade: age || null, 
            department_id: department_id || null 
        });
        if (res.ok) {
            ['user-name', 'user-email', 'user-birth', 'user-age'].forEach(id => {
                document.getElementById(id).value = '';
            });
            loadOptions();
            showToast('Usuário cadastrado com sucesso!');
        } else {
            showToast('Falha ao cadastrar usuário.', 'error');
        }
    } catch (e) {
        showToast('Erro de conexão com o servidor.', 'error');
    }
}

async function createTask() {
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-desc').value;
    const user_id = document.getElementById('task-user').value;
    const status_id = document.getElementById('task-status').value;
    
    if (!title) return showToast('O título da atividade é obrigatório.', 'error');

    try {
        const res = await postData('/tasks', { 
            title, 
            description, 
            user_id: user_id || null,
            status_id: status_id || null
        });
        if (res.ok) {
            document.getElementById('task-title').value = '';
            document.getElementById('task-desc').value = '';
            showToast('Atividade cadastrada com sucesso!');
        } else {
            showToast('Falha ao cadastrar atividade.', 'error');
        }
    } catch (e) {
        showToast('Erro de conexão com o servidor.', 'error');
    }
}

function initFormSelector() {
    const selector = document.getElementById('form-selector');
    const sections = {
        dept: document.getElementById('section-dept'),
        user: document.getElementById('section-user'),
        task: document.getElementById('section-task')
    };

    selector.addEventListener('change', () => {
        Object.values(sections).forEach(s => s.classList.add('hidden'));
        if (selector.value) {
            sections[selector.value].classList.remove('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadOptions();
    initFormSelector();
});
