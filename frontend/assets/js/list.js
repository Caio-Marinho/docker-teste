let currentId = null;
let allActivities = [];
let selectedStatuses = [];
let selectedDepartments = [];

async function loadActivities() {
    try {
        allActivities = await fetchData('/tasks');
        renderFilterOptions();
        renderFilterChips();
        filterActivities();
    } catch (err) {
        console.error('Error loading data:', err);
        showToast('Erro ao carregar relatório', 'error');
    }
}

function renderFilterOptions() {
    const statusContainer = document.getElementById('filter-status-options');
    const departmentContainer = document.getElementById('filter-department-options');

    if (!statusContainer || !departmentContainer) return;

    const statuses = [...new Set(allActivities.map(activity => activity.status_name).filter(Boolean))].sort();
    const departments = [...new Set(allActivities.map(activity => activity.department_name).filter(Boolean))].sort();

    statusContainer.innerHTML = '';
    statuses.forEach(status => {
        const label = document.createElement('label');
        label.className = 'filter-option';
        label.innerHTML = `
            <input type="checkbox" value="${status}" ${selectedStatuses.includes(status) ? 'checked' : ''}>
            <span>${status}</span>
        `;
        statusContainer.appendChild(label);
    });

    departmentContainer.innerHTML = '';
    departments.forEach(department => {
        const label = document.createElement('label');
        label.className = 'filter-option';
        label.innerHTML = `
            <input type="checkbox" value="${department}" ${selectedDepartments.includes(department) ? 'checked' : ''}>
            <span>${department}</span>
        `;
        departmentContainer.appendChild(label);
    });
}

function openFilterModal() {
    renderFilterOptions();
    document.getElementById('filterModal').style.display = 'block';
}

function closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
}

function applyFilterSelections() {
    const statusInputs = document.querySelectorAll('#filter-status-options input[type="checkbox"]:checked');
    const departmentInputs = document.querySelectorAll('#filter-department-options input[type="checkbox"]:checked');

    selectedStatuses = Array.from(statusInputs).map(input => input.value);
    selectedDepartments = Array.from(departmentInputs).map(input => input.value);

    renderFilterChips();
    closeFilterModal();
    filterActivities();
}

function renderFilterChips() {
    const chipContainer = document.getElementById('filter-chip-container');
    if (!chipContainer) return;

    chipContainer.innerHTML = '';
    const chips = [];

    selectedStatuses.forEach(status => {
        chips.push(`<span class="filter-chip">${status}</span>`);
    });

    selectedDepartments.forEach(department => {
        chips.push(`<span class="filter-chip">${department}</span>`);
    });

    if (!chips.length) {
        chips.push('<span class="filter-chip empty"></span>');
    }

    chipContainer.innerHTML = chips.join('');
}

function filterActivities() {
    const searchTerm = (document.getElementById('search-employee').value || '').trim().toLowerCase();

    const filtered = allActivities.filter(activity => {
        const employeeName = (activity.user_name || '').toLowerCase();
        const activityTitle = (activity.title || '').toLowerCase();
        const activityDescription = (activity.description || '').toLowerCase();
        const activityStatus = (activity.status_name || '').toLowerCase();
        const activityDepartment = (activity.department_name || '').toLowerCase();

        const matchesSearch = employeeName.includes(searchTerm) || activityTitle.includes(searchTerm) || activityDescription.includes(searchTerm);
        const matchesStatus = !selectedStatuses.length || selectedStatuses.some(status => status.toLowerCase() === activityStatus);
        const matchesDepartment = !selectedDepartments.length || selectedDepartments.some(department => department.toLowerCase() === activityDepartment);

        return matchesSearch && matchesStatus && matchesDepartment;
    });

    renderTable('table-activities', filtered,
        ['status_name', 'user_name', 'title', 'description', 'department_name'],
        (item) => openEdit(item)
    );
}

function renderTable(tableId, data, fields, onClick) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.onclick = () => onClick(item);
        fields.forEach(f => {
            const td = document.createElement('td');
            
            if (f === 'status_name') {
                const badge = document.createElement('span');
                badge.className = `status-badge status-${item.status_id}`;
                badge.textContent = item[f] || 'Sem Status';
                td.appendChild(badge);
            } else {
                td.textContent = item[f] || '-';
            }
            
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

async function openEdit(item) {
    currentId = item.id;
    const body = document.getElementById('modalBody');
    body.innerHTML = '<div style="text-align:center; padding: 20px;">Carregando dados...</div>';
    
    try {
        const [users, statuses] = await Promise.all([
            fetchData('/users'),
            fetchData('/statuses')
        ]);
        
        let userOpts = users.map(u => `<option value="${u.id}" ${u.id === item.user_id ? 'selected' : ''}>${u.name}</option>`).join('');
        let statusOpts = statuses.map(s => `<option value="${s.id}" ${s.id === item.status_id ? 'selected' : ''}>${s.name}</option>`).join('');
        
        body.innerHTML = `
            <div class="form-group">
                <label>Título da Atividade:</label>
                <input id="edit-title" value="${item.title}">
                
                <label>Descrição:</label>
                <textarea id="edit-desc" rows="3">${item.description || ''}</textarea>
                
                <label>Responsável:</label>
                <select id="edit-user"><option value="">Sem Responsável</option>${userOpts}</select>
                
                <label>Status da Atividade:</label>
                <select id="edit-status"><option value="">Selecione...</option>${statusOpts}</select>
            </div>
        `;
        
        document.getElementById('editModal').style.display = 'block';
        document.getElementById('btnSave').onclick = saveEdit;
    } catch (err) {
        showToast('Erro ao carregar opções', 'error');
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function saveEdit() {
    const title = document.getElementById('edit-title').value.trim();
    if (!title) return showToast('Título é obrigatório', 'error');

    const data = { 
        title,
        description: document.getElementById('edit-desc').value,
        user_id: document.getElementById('edit-user').value || null,
        status_id: document.getElementById('edit-status').value || null
    };

    try {
        const res = await putData(`/tasks/${currentId}`, data);
        if (res.ok) {
            closeModal();
            loadActivities();
            showToast('Relatório atualizado!');
        } else {
            showToast('Erro ao salvar.', 'error');
        }
    } catch (err) {
        showToast('Erro de conexão.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
});
