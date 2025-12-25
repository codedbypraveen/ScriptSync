// API Base URL
const API_URL = 'http://localhost:8080/api';

// Global State
let modules = [];
let subModules = [];
let priorities = [];
let statuses = [];
let users = [];
let tags = [];
let testCases = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadAllData();
});

// Tab Navigation
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Load All Data
async function loadAllData() {
    try {
        await Promise.all([
            loadModules(),
            loadSubModules(),
            loadPriorities(),
            loadStatuses(),
            loadUsers(),
            loadTags(),
            loadTestCases()
        ]);
        // Render dashboard after all data is loaded
        renderDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('Error loading data. Please refresh the page.', 'error');
    }
}

// API Calls - Modules
async function loadModules() {
    try {
        const response = await fetch(`${API_URL}/modules`);
        modules = await response.json();
        renderModules();
        updateModuleFilters();
    } catch (error) {
        console.error('Error loading modules:', error);
    }
}

function renderModules() {
    const grid = document.getElementById('modulesGrid');
    if (modules.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p class="empty-state-text">No modules found. Create your first module!</p></div>';
        return;
    }
    grid.innerHTML = modules.map(module => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${module.name}</h3>
            </div>
            <p class="card-description">${module.description || 'No description'}</p>
            <div class="card-actions">
                <button class="btn btn-sm btn-secondary" onclick="editModule(${module.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteModule(${module.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function saveModule(moduleData) {
    const method = moduleData.id ? 'PUT' : 'POST';
    const url = moduleData.id ? `${API_URL}/modules/${moduleData.id}` : `${API_URL}/modules`;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
    });

    if (response.ok) {
        await loadModules();
        closeModal();
        showAlert('Module saved successfully!', 'success');
    } else {
        const error = await response.json();
        showAlert(error.message || 'Error saving module', 'error');
    }
}

async function deleteModule(id) {
    if (!confirm('Are you sure you want to delete this module?')) return;

    const response = await fetch(`${API_URL}/modules/${id}`, { method: 'DELETE' });
    if (response.ok) {
        await loadModules();
        showAlert('Module deleted successfully!', 'success');
    } else {
        showAlert('Error deleting module', 'error');
    }
}

// API Calls - SubModules
async function loadSubModules() {
    try {
        const response = await fetch(`${API_URL}/submodules`);
        subModules = await response.json();
        renderSubModules();
    } catch (error) {
        console.error('Error loading sub-modules:', error);
    }
}

function renderSubModules() {
    const grid = document.getElementById('subModulesGrid');
    if (subModules.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📂</div><p class="empty-state-text">No sub-modules found. Create your first sub-module!</p></div>';
        return;
    }
    grid.innerHTML = subModules.map(subModule => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${subModule.name}</h3>
            </div>
            <span class="tag tag-primary">${subModule.moduleName}</span>
            <p class="card-description">${subModule.description || 'No description'}</p>
            <div class="card-actions">
                <button class="btn btn-sm btn-secondary" onclick="editSubModule(${subModule.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSubModule(${subModule.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function saveSubModule(subModuleData) {
    const method = subModuleData.id ? 'PUT' : 'POST';
    const url = subModuleData.id ? `${API_URL}/submodules/${subModuleData.id}` : `${API_URL}/submodules`;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subModuleData)
    });

    if (response.ok) {
        await loadSubModules();
        closeModal();
        showAlert('Sub-module saved successfully!', 'success');
    } else {
        const error = await response.json();
        showAlert(error.message || 'Error saving sub-module', 'error');
    }
}

async function deleteSubModule(id) {
    if (!confirm('Are you sure you want to delete this sub-module?')) return;

    const response = await fetch(`${API_URL}/submodules/${id}`, { method: 'DELETE' });
    if (response.ok) {
        await loadSubModules();
        showAlert('Sub-module deleted successfully!', 'success');
    } else {
        showAlert('Error deleting sub-module', 'error');
    }
}

// API Calls - Priorities
async function loadPriorities() {
    try {
        const response = await fetch(`${API_URL}/priorities`);
        priorities = await response.json();
        renderPriorities();
    } catch (error) {
        console.error('Error loading priorities:', error);
    }
}

function renderPriorities() {
    const grid = document.getElementById('prioritiesGrid');
    if (priorities.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⭐</div><p class="empty-state-text">No priorities found. Create your first priority!</p></div>';
        return;
    }
    grid.innerHTML = priorities.map(priority => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${priority.name}</h3>
                ${priority.level ? `<span class="tag tag-warning">Level ${priority.level}</span>` : ''}
            </div>
            <p class="card-description">${priority.description || 'No description'}</p>
            <div class="card-actions">
                <button class="btn btn-sm btn-secondary" onclick="editPriority(${priority.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deletePriority(${priority.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function savePriority(priorityData) {
    const method = priorityData.id ? 'PUT' : 'POST';
    const url = priorityData.id ? `${API_URL}/priorities/${priorityData.id}` : `${API_URL}/priorities`;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priorityData)
    });

    if (response.ok) {
        await loadPriorities();
        closeModal();
        showAlert('Priority saved successfully!', 'success');
    } else {
        const error = await response.json();
        showAlert(error.message || 'Error saving priority', 'error');
    }
}

async function deletePriority(id) {
    if (!confirm('Are you sure you want to delete this priority?')) return;

    const response = await fetch(`${API_URL}/priorities/${id}`, { method: 'DELETE' });
    if (response.ok) {
        await loadPriorities();
        showAlert('Priority deleted successfully!', 'success');
    } else {
        showAlert('Error deleting priority', 'error');
    }
}

// API Calls - Automation Statuses
async function loadStatuses() {
    try {
        const response = await fetch(`${API_URL}/automation-statuses`);
        statuses = await response.json();
        renderStatuses();
        updateStatusFilters();
    } catch (error) {
        console.error('Error loading statuses:', error);
    }
}

function renderStatuses() {
    const grid = document.getElementById('statusesGrid');
    if (statuses.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔄</div><p class="empty-state-text">No statuses found. Create your first status!</p></div>';
        return;
    }
    grid.innerHTML = statuses.map(status => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${status.name}</h3>
            </div>
            <p class="card-description">${status.description || 'No description'}</p>
            <div class="card-actions">
                <button class="btn btn-sm btn-secondary" onclick="editStatus(${status.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStatus(${status.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function saveStatus(statusData) {
    const method = statusData.id ? 'PUT' : 'POST';
    const url = statusData.id ? `${API_URL}/automation-statuses/${statusData.id}` : `${API_URL}/automation-statuses`;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData)
    });

    if (response.ok) {
        await loadStatuses();
        closeModal();
        showAlert('Status saved successfully!', 'success');
    } else {
        const error = await response.json();
        showAlert(error.message || 'Error saving status', 'error');
    }
}

async function deleteStatus(id) {
    if (!confirm('Are you sure you want to delete this status?')) return;

    const response = await fetch(`${API_URL}/automation-statuses/${id}`, { method: 'DELETE' });
    if (response.ok) {
        await loadStatuses();
        showAlert('Status deleted successfully!', 'success');
    } else {
        showAlert('Error deleting status', 'error');
    }
}

// API Calls - Users (Automated By)
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/automated-by`);
        users = await response.json();
        renderUsers();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsers() {
    const grid = document.getElementById('usersGrid');
    if (users.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👤</div><p class="empty-state-text">No users found. Add your first user!</p></div>';
        return;
    }
    grid.innerHTML = users.map(user => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${user.name}</h3>
            </div>
            ${user.email ? `<p><strong>Email:</strong> ${user.email}</p>` : ''}
            ${user.team ? `<span class="tag tag-primary">${user.team}</span>` : ''}
            <div class="card-actions">
                <button class="btn btn-sm btn-secondary" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function saveUser(userData) {
    const method = userData.id ? 'PUT' : 'POST';
    const url = userData.id ? `${API_URL}/automated-by/${userData.id}` : `${API_URL}/automated-by`;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    if (response.ok) {
        await loadUsers();
        closeModal();
        showAlert('User saved successfully!', 'success');
    } else {
        const error = await response.json();
        showAlert(error.message || 'Error saving user', 'error');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const response = await fetch(`${API_URL}/automated-by/${id}`, { method: 'DELETE' });
    if (response.ok) {
        await loadUsers();
        showAlert('User deleted successfully!', 'success');
    } else {
        showAlert('Error deleting user', 'error');
    }
}

// API Calls - Tags
async function loadTags() {
    try {
        const response = await fetch(`${API_URL}/tags`);
        tags = await response.json();
        renderTags();
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

function renderTags() {
    const grid = document.getElementById('tagsGrid');
    if (tags.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏷️</div><p class="empty-state-text">No tags found. Create your first tag!</p></div>';
        return;
    }
    grid.innerHTML = tags.map(tag => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${tag.name}</h3>
                ${tag.color ? `<div style="width: 24px; height: 24px; background: ${tag.color}; border-radius: 50%;"></div>` : ''}
            </div>
            <p class="card-description">${tag.description || 'No description'}</p>
            <div class="card-actions">
                <button class="btn btn-sm btn-secondary" onclick="editTag(${tag.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTag(${tag.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function saveTag(tagData) {
    const method = tagData.id ? 'PUT' : 'POST';
    const url = tagData.id ? `${API_URL}/tags/${tagData.id}` : `${API_URL}/tags`;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData)
    });

    if (response.ok) {
        await loadTags();
        closeModal();
        showAlert('Tag saved successfully!', 'success');
    } else {
        const error = await response.json();
        showAlert(error.message || 'Error saving tag', 'error');
    }
}

async function deleteTag(id) {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    const response = await fetch(`${API_URL}/tags/${id}`, { method: 'DELETE' });
    if (response.ok) {
        await loadTags();
        showAlert('Tag deleted successfully!', 'success');
    } else {
        showAlert('Error deleting tag', 'error');
    }
}

// API Calls - Test Cases
async function loadTestCases() {
    try {
        const response = await fetch(`${API_URL}/testcases`);
        testCases = await response.json();
        renderTestCases();
    } catch (error) {
        console.error('Error loading test cases:', error);
    }
}

function renderTestCases() {
    const tbody = document.getElementById('testCaseTableBody');
    if (testCases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="14" class="empty-state"><div class="empty-state-icon">📝</div><p class="empty-state-text">No test cases found. Create your first test case!</p></td></tr>';
        return;
    }
    tbody.innerHTML = testCases.map(tc => `
        <tr>
            <td>${tc.testcaseId}</td>
            <td>${tc.moduleName}</td>
            <td>${tc.subModuleName || '-'}</td>
            <td title="${tc.testCaseDescription}">${tc.testCaseDescription.substring(0, 50)}${tc.testCaseDescription.length > 50 ? '...' : ''}</td>
            <td title="${tc.preConditions || ''}">${tc.preConditions ? (tc.preConditions.substring(0, 30) + (tc.preConditions.length > 30 ? '...' : '')) : '-'}</td>
            <td title="${tc.testScript}">${tc.testScript.substring(0, 50)}${tc.testScript.length > 50 ? '...' : ''}</td>
            <td title="${tc.expectedResult}">${tc.expectedResult.substring(0, 50)}${tc.expectedResult.length > 50 ? '...' : ''}</td>
            <td><span class="tag tag-warning">${tc.priorityName}</span></td>
            <td><span class="tag tag-primary">${tc.automationStatusName}</span></td>
            <td>${tc.automatedByName || '-'}</td>
            <td title="${tc.automationComments || ''}">${tc.automationComments ? (tc.automationComments.substring(0, 30) + (tc.automationComments.length > 30 ? '...' : '')) : '-'}</td>
            <td>${tc.clubbedTcId || '-'}</td>
            <td>${tc.tagNames ? tc.tagNames.map(t => `<span class="tag tag-success">${t}</span>`).join(' ') : '-'}</td>
            <td style="white-space: nowrap;">
                <button class="btn btn-sm btn-secondary" onclick="viewTestCase(${tc.id})">View</button>
                <button class="btn btn-sm btn-secondary" onclick="editTestCase(${tc.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTestCase(${tc.id})">Delete</button>
            </td>
        </tr>
    `).join('');

    // Initialize column search after rendering
    initializeColumnSearch();
}

async function saveTestCase(testCaseData) {
    const method = testCaseData.id ? 'PUT' : 'POST';
    const url = testCaseData.id ? `${API_URL}/testcases/${testCaseData.id}` : `${API_URL}/testcases`;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCaseData)
    });

    if (response.ok) {
        await loadTestCases();
        closeModal();
        showAlert('Test case saved successfully!', 'success');
    } else {
        const error = await response.json();
        showAlert(error.message || 'Error saving test case', 'error');
    }
}

async function deleteTestCase(id) {
    if (!confirm('Are you sure you want to delete this test case?')) return;

    const response = await fetch(`${API_URL}/testcases/${id}`, { method: 'DELETE' });
    if (response.ok) {
        await loadTestCases();
        showAlert('Test case deleted successfully!', 'success');
    } else {
        showAlert('Error deleting test case', 'error');
    }
}

// Modal Functions
function openModal(title, content) {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="close-btn" onclick="closeModal()">×</button>
            </div>
            ${content}
        </div>
    `;
    modalContainer.classList.add('active');
}

function closeModal() {
    document.getElementById('modalContainer').classList.remove('active');
    setTimeout(() => {
        document.getElementById('modalContainer').innerHTML = '';
    }, 300);
}

// Module Modal
function openModuleModal(module = null) {
    const content = `
        <form onsubmit="handleModuleSubmit(event)" id="moduleForm">
            <input type="hidden" id="moduleId" value="${module ? module.id : ''}">
            <div class="form-group">
                <label class="form-label">Module Name *</label>
                <input type="text" class="form-input" id="moduleName" value="${module ? module.name : ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="moduleDescription">${module ? module.description || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `;
    openModal(module ? 'Edit Module' : 'New Module', content);
}

function handleModuleSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('moduleId').value;
    const moduleData = {
        name: document.getElementById('moduleName').value,
        description: document.getElementById('moduleDescription').value
    };
    if (id) moduleData.id = parseInt(id);
    saveModule(moduleData);
}

function editModule(id) {
    const module = modules.find(m => m.id === id);
    if (module) openModuleModal(module);
}

// SubModule Modal
function openSubModuleModal(subModule = null) {
    const content = `
        <form onsubmit="handleSubModuleSubmit(event)" id="subModuleForm">
            <input type="hidden" id="subModuleId" value="${subModule ? subModule.id : ''}">
            <div class="form-group">
                <label class="form-label">Module *</label>
                <select class="form-select" id="subModuleModuleId" required>
                    <option value="">Select Module</option>
                    ${modules.map(m => `<option value="${m.id}" ${subModule && subModule.moduleId === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Sub-Module Name *</label>
                <input type="text" class="form-input" id="subModuleName" value="${subModule ? subModule.name : ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="subModuleDescription">${subModule ? subModule.description || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `;
    openModal(subModule ? 'Edit Sub-Module' : 'New Sub-Module', content);
}

function handleSubModuleSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('subModuleId').value;
    const subModuleData = {
        name: document.getElementById('subModuleName').value,
        description: document.getElementById('subModuleDescription').value,
        moduleId: parseInt(document.getElementById('subModuleModuleId').value)
    };
    if (id) subModuleData.id = parseInt(id);
    saveSubModule(subModuleData);
}

function editSubModule(id) {
    const subModule = subModules.find(sm => sm.id === id);
    if (subModule) openSubModuleModal(subModule);
}

// Priority Modal
function openPriorityModal(priority = null) {
    const content = `
        <form onsubmit="handlePrioritySubmit(event)" id="priorityForm">
            <input type="hidden" id="priorityId" value="${priority ? priority.id : ''}">
            <div class="form-group">
                <label class="form-label">Priority Name *</label>
                <input type="text" class="form-input" id="priorityName" value="${priority ? priority.name : ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Level</label>
                <input type="number" class="form-input" id="priorityLevel" value="${priority ? priority.level || '' : ''}" min="1">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="priorityDescription">${priority ? priority.description || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `;
    openModal(priority ? 'Edit Priority' : 'New Priority', content);
}

function handlePrioritySubmit(event) {
    event.preventDefault();
    const id = document.getElementById('priorityId').value;
    const priorityData = {
        name: document.getElementById('priorityName').value,
        description: document.getElementById('priorityDescription').value,
        level: document.getElementById('priorityLevel').value ? parseInt(document.getElementById('priorityLevel').value) : null
    };
    if (id) priorityData.id = parseInt(id);
    savePriority(priorityData);
}

function editPriority(id) {
    const priority = priorities.find(p => p.id === id);
    if (priority) openPriorityModal(priority);
}

// Status Modal
function openStatusModal(status = null) {
    const content = `
        <form onsubmit="handleStatusSubmit(event)" id="statusForm">
            <input type="hidden" id="statusId" value="${status ? status.id : ''}">
            <div class="form-group">
                <label class="form-label">Status Name *</label>
                <input type="text" class="form-input" id="statusName" value="${status ? status.name : ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="statusDescription">${status ? status.description || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `;
    openModal(status ? 'Edit Status' : 'New Status', content);
}

function handleStatusSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('statusId').value;
    const statusData = {
        name: document.getElementById('statusName').value,
        description: document.getElementById('statusDescription').value
    };
    if (id) statusData.id = parseInt(id);
    saveStatus(statusData);
}

function editStatus(id) {
    const status = statuses.find(s => s.id === id);
    if (status) openStatusModal(status);
}

// User Modal
function openUserModal(user = null) {
    const content = `
        <form onsubmit="handleUserSubmit(event)" id="userForm">
            <input type="hidden" id="userId" value="${user ? user.id : ''}">
            <div class="form-group">
                <label class="form-label">Name *</label>
                <input type="text" class="form-input" id="userName" value="${user ? user.name : ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="userEmail" value="${user ? user.email || '' : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Team</label>
                <input type="text" class="form-input" id="userTeam" value="${user ? user.team || '' : ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `;
    openModal(user ? 'Edit User' : 'New User', content);
}

function handleUserSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        team: document.getElementById('userTeam').value
    };
    if (id) userData.id = parseInt(id);
    saveUser(userData);
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (user) openUserModal(user);
}

// Tag Modal
function openTagModal(tag = null) {
    const content = `
        <form onsubmit="handleTagSubmit(event)" id="tagForm">
            <input type="hidden" id="tagId" value="${tag ? tag.id : ''}">
            <div class="form-group">
                <label class="form-label">Tag Name *</label>
                <input type="text" class="form-input" id="tagName" value="${tag ? tag.name : ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Color</label>
                <input type="color" class="form-input" id="tagColor" value="${tag ? tag.color || '#6366f1' : '#6366f1'}">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="tagDescription">${tag ? tag.description || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `;
    openModal(tag ? 'Edit Tag' : 'New Tag', content);
}

function handleTagSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('tagId').value;
    const tagData = {
        name: document.getElementById('tagName').value,
        color: document.getElementById('tagColor').value,
        description: document.getElementById('tagDescription').value
    };
    if (id) tagData.id = parseInt(id);
    saveTag(tagData);
}

function editTag(id) {
    const tag = tags.find(t => t.id === id);
    if (tag) openTagModal(tag);
}

// Test Case Modal
function openTestCaseModal(testCase = null) {
    const content = `
        <form onsubmit="handleTestCaseSubmit(event)" id="testCaseForm" style="max-height: 70vh; overflow-y: auto;">
            <input type="hidden" id="testCaseDbId" value="${testCase ? testCase.id : ''}">
            <div class="form-group">
                <label class="form-label">Test Case ID *</label>
                <input type="text" class="form-input" id="testCaseId" value="${testCase ? testCase.testcaseId : ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Module *</label>
                <select class="form-select" id="testCaseModule" required>
                    <option value="">Select Module</option>
                    ${modules.map(m => `<option value="${m.id}" ${testCase && testCase.moduleId === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Sub-Module</label>
                <select class="form-select" id="testCaseSubModule">
                    <option value="">Select Sub-Module</option>
                    ${subModules.map(sm => `<option value="${sm.id}" ${testCase && testCase.subModuleId === sm.id ? 'selected' : ''}>${sm.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Test Case Description *</label>
                <textarea class="form-textarea" id="testCaseDescription" required>${testCase ? testCase.testCaseDescription : ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Pre-Conditions / Test Data</label>
                <textarea class="form-textarea" id="testCasePreConditions">${testCase ? testCase.preConditions || '' : ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Test Script / Actions *</label>
                <textarea class="form-textarea" id="testCaseScript" required>${testCase ? testCase.testScript : ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Expected Result *</label>
                <textarea class="form-textarea" id="testCaseExpectedResult" required>${testCase ? testCase.expectedResult : ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Priority *</label>
                <select class="form-select" id="testCasePriority" required>
                    <option value="">Select Priority</option>
                    ${priorities.map(p => `<option value="${p.id}" ${testCase && testCase.priorityId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Automation Status *</label>
                <select class="form-select" id="testCaseStatus" required>
                    <option value="">Select Status</option>
                    ${statuses.map(s => `<option value="${s.id}" ${testCase && testCase.automationStatusId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Automated By</label>
                <select class="form-select" id="testCaseAutomatedBy">
                    <option value="">Select User</option>
                    ${users.map(u => `<option value="${u.id}" ${testCase && testCase.automatedById === u.id ? 'selected' : ''}>${u.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Automation Comments</label>
                <textarea class="form-textarea" id="testCaseComments">${testCase ? testCase.automationComments || '' : ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Clubbed TC ID</label>
                <input type="text" class="form-input" id="testCaseClubbedId" value="${testCase ? testCase.clubbedTcId || '' : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Tags</label>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${tags.map(t => `
                        <label style="display: flex; align-items: center; gap: 0.25rem;">
                            <input type="checkbox" name="testCaseTags" value="${t.id}" ${testCase && testCase.tagIds && testCase.tagIds.includes(t.id) ? 'checked' : ''}>
                            ${t.name}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    `;
    openModal(testCase ? 'Edit Test Case' : 'New Test Case', content);
}

function handleTestCaseSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('testCaseDbId').value;
    const selectedTags = Array.from(document.querySelectorAll('input[name="testCaseTags"]:checked')).map(cb => parseInt(cb.value));

    const testCaseData = {
        testcaseId: document.getElementById('testCaseId').value,
        moduleId: parseInt(document.getElementById('testCaseModule').value),
        subModuleId: document.getElementById('testCaseSubModule').value ? parseInt(document.getElementById('testCaseSubModule').value) : null,
        testCaseDescription: document.getElementById('testCaseDescription').value,
        preConditions: document.getElementById('testCasePreConditions').value,
        testScript: document.getElementById('testCaseScript').value,
        expectedResult: document.getElementById('testCaseExpectedResult').value,
        priorityId: parseInt(document.getElementById('testCasePriority').value),
        automationStatusId: parseInt(document.getElementById('testCaseStatus').value),
        automatedById: document.getElementById('testCaseAutomatedBy').value ? parseInt(document.getElementById('testCaseAutomatedBy').value) : null,
        automationComments: document.getElementById('testCaseComments').value,
        clubbedTcId: document.getElementById('testCaseClubbedId').value,
        tagIds: selectedTags
    };

    if (id) testCaseData.id = parseInt(id);
    saveTestCase(testCaseData);
}

function editTestCase(id) {
    const testCase = testCases.find(tc => tc.id === id);
    if (testCase) openTestCaseModal(testCase);
}

function viewTestCase(id) {
    const tc = testCases.find(t => t.id === id);
    if (!tc) return;

    const content = `
        <div style="max-height: 70vh; overflow-y: auto;">
            <div class="form-group">
                <strong>Test Case ID:</strong> ${tc.testcaseId}
            </div>
            <div class="form-group">
                <strong>Module:</strong> ${tc.moduleName}
            </div>
            ${tc.subModuleName ? `<div class="form-group"><strong>Sub-Module:</strong> ${tc.subModuleName}</div>` : ''}
            <div class="form-group">
                <strong>Description:</strong><br>${tc.testCaseDescription}
            </div>
            ${tc.preConditions ? `<div class="form-group"><strong>Pre-Conditions:</strong><br>${tc.preConditions}</div>` : ''}
            <div class="form-group">
                <strong>Test Script:</strong><br>${tc.testScript}
            </div>
            <div class="form-group">
                <strong>Expected Result:</strong><br>${tc.expectedResult}
            </div>
            <div class="form-group">
                <strong>Priority:</strong> <span class="tag tag-warning">${tc.priorityName}</span>
            </div>
            <div class="form-group">
                <strong>Automation Status:</strong> <span class="tag tag-primary">${tc.automationStatusName}</span>
            </div>
            ${tc.automatedByName ? `<div class="form-group"><strong>Automated By:</strong> ${tc.automatedByName}</div>` : ''}
            ${tc.automationComments ? `<div class="form-group"><strong>Automation Comments:</strong><br>${tc.automationComments}</div>` : ''}
            ${tc.clubbedTcId ? `<div class="form-group"><strong>Clubbed TC ID:</strong> ${tc.clubbedTcId}</div>` : ''}
            ${tc.tagNames && tc.tagNames.length > 0 ? `<div class="form-group"><strong>Tags:</strong><br>${tc.tagNames.map(t => `<span class="tag tag-success">${t}</span>`).join('')}</div>` : ''}
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;
    openModal('Test Case Details', content);
}

// Filters
function updateModuleFilters() {
    const select = document.getElementById('filterModule');
    select.innerHTML = '<option value="">All Modules</option>' +
        modules.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
}

function updateStatusFilters() {
    const select = document.getElementById('filterStatus');
    select.innerHTML = '<option value="">All Statuses</option>' +
        statuses.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

// Alert Messages
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '10000';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.animation = 'slideInRight 0.3s ease';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Dashboard Functions
let dashboardCharts = {}; // Store chart instances

function renderDashboard() {
    if (testCases.length === 0) {
        renderEmptyDashboard();
        return;
    }

    // Update summary cards
    updateSummaryCards();

    // Render all charts
    renderStatusOverviewChart();
    renderPriorityOverviewChart();
    renderSubModuleStatusChart();
    renderSubModulePriorityChart();
}

function renderEmptyDashboard() {
    document.getElementById('totalTestCases').textContent = '0';
    document.getElementById('totalModules').textContent = '0';
    document.getElementById('totalSubModules').textContent = '0';
    document.getElementById('automationRate').textContent = '0%';
}

function refreshDashboard() {
    // Destroy existing charts
    Object.values(dashboardCharts).forEach(chart => {
        if (chart) chart.destroy();
    });
    dashboardCharts = {};

    renderDashboard();
    showAlert('Dashboard refreshed!', 'success');
}

function updateSummaryCards() {
    document.getElementById('totalTestCases').textContent = testCases.length;
    document.getElementById('totalModules').textContent = modules.length;
    document.getElementById('totalSubModules').textContent = subModules.length;

    // Calculate automation rate
    const automatedStatuses = ['Automated', 'Completed'];
    const automatedCount = testCases.filter(tc =>
        automatedStatuses.some(status => tc.automationStatusName.toLowerCase().includes(status.toLowerCase()))
    ).length;
    const rate = testCases.length > 0 ? ((automatedCount / testCases.length) * 100).toFixed(1) : 0;
    document.getElementById('automationRate').textContent = rate + '%';
}

// Color palettes - Unique colors for each value
const statusColors = {
    'Automated': '#10b981',      // Green
    'Completed': '#059669',      // Dark Green
    'Not Automated': '#ef4444',  // Red
    'Not Started': '#dc2626',    // Dark Red
    'Yet to Start': '#f97316',   // Orange-Red
    'In Progress': '#f59e0b',    // Orange
    'Blocked': '#7c2d12',        // Brown-Red
    'On Hold': '#78716c',        // Gray
    'default': '#6366f1'         // Blue
};

const priorityColors = {
    'P1': '#dc2626',             // Red
    'Critical': '#991b1b',       // Dark Red
    'P2': '#f59e0b',             // Orange
    'High': '#ea580c',           // Dark Orange
    'P3': '#3b82f6',             // Blue
    'Medium': '#2563eb',         // Dark Blue
    'P4': '#10b981',             // Green
    'Low': '#059669',            // Dark Green
    'default': '#6366f1'         // Light Blue
};

// Color cache for dynamic values
const dynamicColors = {};

function getColor(name, colorMap) {
    // Check if exact match exists in color map
    if (colorMap[name]) {
        return colorMap[name];
    }

    // Check if partial match exists
    for (const key in colorMap) {
        if (key !== 'default' && name.toLowerCase().includes(key.toLowerCase())) {
            return colorMap[key];
        }
    }

    // Generate unique color for unknown values
    const cacheKey = colorMap === statusColors ? 'status_' + name : 'priority_' + name;
    if (dynamicColors[cacheKey]) {
        return dynamicColors[cacheKey];
    }

    // Generate a unique color based on string hash
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Create distinct hue values
    const hue = Math.abs(hash % 360);
    const saturation = 65 + (Math.abs(hash >> 8) % 20); // 65-85%
    const lightness = 45 + (Math.abs(hash >> 16) % 15); // 45-60%

    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    dynamicColors[cacheKey] = color;

    return color;
}

// Automation Status Overview - Donut Chart
function renderStatusOverviewChart() {
    const ctx = document.getElementById('statusOverviewChart');
    if (!ctx) return;

    const statusCounts = {};
    testCases.forEach(tc => {
        const status = tc.automationStatusName;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const colors = labels.map(label => getColor(label, statusColors));

    if (dashboardCharts.statusOverview) dashboardCharts.statusOverview.destroy();

    dashboardCharts.statusOverview = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Priority Overview - Donut Chart
function renderPriorityOverviewChart() {
    const ctx = document.getElementById('priorityOverviewChart');
    if (!ctx) return;

    const priorityCounts = {};
    testCases.forEach(tc => {
        const priority = tc.priorityName;
        priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    });

    const labels = Object.keys(priorityCounts);
    const data = Object.values(priorityCounts);
    const colors = labels.map(label => getColor(label, priorityColors));

    if (dashboardCharts.priorityOverview) dashboardCharts.priorityOverview.destroy();

    dashboardCharts.priorityOverview = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}


// Sub-Module by Automation Status - Horizontal Bar Chart
function renderSubModuleStatusChart() {
    const ctx = document.getElementById('subModuleStatusChart');
    if (!ctx) return;

    const subModuleStats = {};
    const allStatuses = new Set();

    testCases.forEach(tc => {
        const subModuleName = tc.subModuleName || 'No Sub-Module';
        const statusName = tc.automationStatusName;

        if (!subModuleStats[subModuleName]) subModuleStats[subModuleName] = {};
        subModuleStats[subModuleName][statusName] = (subModuleStats[subModuleName][statusName] || 0) + 1;
        allStatuses.add(statusName);
    });

    const subModules = Object.keys(subModuleStats).sort();
    const statuses = Array.from(allStatuses);

    const datasets = statuses.map(status => ({
        label: status,
        data: subModules.map(sm => subModuleStats[sm][status] || 0),
        backgroundColor: getColor(status, statusColors),
        borderWidth: 1,
        borderColor: '#ffffff'
    }));

    if (dashboardCharts.subModuleStatus) dashboardCharts.subModuleStatus.destroy();

    dashboardCharts.subModuleStatus = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subModules,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Sub-Module by Priority - Horizontal Bar Chart
function renderSubModulePriorityChart() {
    const ctx = document.getElementById('subModulePriorityChart');
    if (!ctx) return;

    const subModuleStats = {};
    const allPriorities = new Set();

    testCases.forEach(tc => {
        const subModuleName = tc.subModuleName || 'No Sub-Module';
        const priorityName = tc.priorityName;

        if (!subModuleStats[subModuleName]) subModuleStats[subModuleName] = {};
        subModuleStats[subModuleName][priorityName] = (subModuleStats[subModuleName][priorityName] || 0) + 1;
        allPriorities.add(priorityName);
    });

    const subModules = Object.keys(subModuleStats).sort();
    const priorities = Array.from(allPriorities);

    const datasets = priorities.map(priority => ({
        label: priority,
        data: subModules.map(sm => subModuleStats[sm][priority] || 0),
        backgroundColor: getColor(priority, priorityColors),
        borderWidth: 1,
        borderColor: '#ffffff'
    }));

    if (dashboardCharts.subModulePriority) dashboardCharts.subModulePriority.destroy();

    dashboardCharts.subModulePriority = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subModules,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Column Search Functionality
function initializeColumnSearch() {
    const searchInputs = document.querySelectorAll('.column-search');
    searchInputs.forEach(input => {
        input.addEventListener('input', filterTable);
    });
}

function filterTable() {
    const tbody = document.getElementById('testCaseTableBody');
    const rows = tbody.getElementsByTagName('tr');
    const searchInputs = document.querySelectorAll('.column-search');

    // Get all search values
    const searchValues = Array.from(searchInputs).map(input =>
        input.value.toLowerCase().trim()
    );

    // Filter rows
    Array.from(rows).forEach(row => {
        if (row.classList.contains('empty-state')) return;

        const cells = row.getElementsByTagName('td');
        let showRow = true;

        searchValues.forEach((searchValue, index) => {
            if (searchValue && index < cells.length) {
                const cellText = cells[index].textContent.toLowerCase();
                if (!cellText.includes(searchValue)) {
                    showRow = false;
                }
            }
        });

        row.classList.toggle('hidden', !showRow);
    });
}

// Import Modal and Functionality
function openImportModal() {
    const content = `
        <form onsubmit="handleImportSubmit(event)" id="importForm">
            <div class="form-group">
                <label class="form-label">Upload CSV or Excel File</label>
                <input type="file" class="form-input" id="importFile" accept=".csv,.xlsx,.xls" required>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    📋 The file should contain these columns in order:<br>
                    <strong>Testcase ID, Module, Sub Module/ Functionality, Test Case Description,
                    Pre-Conditions/Test Data, Test Script / Actions, Expected Result,
                    Test Case Priority, Automation Status, Automated By, Automation Comments,
                    Clubbed TC ID, Tags</strong>
                </p>
                <button type="button" class="btn btn-secondary btn-sm" onclick="downloadTemplate()" style="margin-top: 0.5rem;">
                    📥 Download CSV Template
                </button>
            </div>
            <div class="form-group">
                <label class="form-label">
                    <input type="checkbox" id="skipFirstRow" checked>
                    Skip first row (header)
                </label>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Import</button>
            </div>
        </form>
        <div id="importProgress" style="display: none; margin-top: 1rem;">
            <div style="background: var(--bg-color); padding: 1rem; border-radius: var(--radius-sm);">
                <p id="importStatus">Processing...</p>
                <div style="background: var(--border-color); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div id="importProgressBar" style="background: var(--primary-color); height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
            </div>
        </div>
    `;
    openModal('Import Test Cases', content);
}

function downloadTemplate() {
    const headers = [
        'Testcase ID',
        'Module',
        'Sub Module/ Functionality',
        'Test Case Description',
        'Pre-Conditions/Test Data',
        'Test Script / Actions',
        'Expected Result',
        'Test Case Priority',
        'Automation Status',
        'Automated By',
        'Automation Comments',
        'Clubbed TC ID',
        'Tags'
    ];

    const sampleRow = [
        'TC001',
        'Login Module',
        'User Authentication',
        'Verify user can login with valid credentials',
        'User account exists with username and password',
        '1. Navigate to login page\n2. Enter valid username\n3. Enter valid password\n4. Click Login button',
        'User is successfully logged in and redirected to dashboard',
        'High',
        'Not Automated',
        'John Doe',
        'Requires database setup',
        '',
        'Smoke, Regression'
    ];

    const csvContent = [
        headers.join(','),
        sampleRow.map(cell => `"${cell}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testcase_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showAlert('Template downloaded successfully!', 'success');
}

function exportTestCases() {
    if (testCases.length === 0) {
        showAlert('No test cases to export', 'error');
        return;
    }

    const headers = [
        'Testcase ID',
        'Module',
        'Sub Module/ Functionality',
        'Test Case Description',
        'Pre-Conditions/Test Data',
        'Test Script / Actions',
        'Expected Result',
        'Test Case Priority',
        'Automation Status',
        'Automated By',
        'Automation Comments',
        'Clubbed TC ID',
        'Tags'
    ];

    const rows = testCases.map(tc => [
        tc.testcaseId,
        tc.moduleName,
        tc.subModuleName || '',
        tc.testCaseDescription,
        tc.preConditions || '',
        tc.testScript,
        tc.expectedResult,
        tc.priorityName,
        tc.automationStatusName,
        tc.automatedByName || '',
        tc.automationComments || '',
        tc.clubbedTcId || '',
        tc.tagNames ? tc.tagNames.join(', ') : ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    a.download = `testcases_export_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showAlert(`Successfully exported ${testCases.length} test cases!`, 'success');
}

async function handleImportSubmit(event) {
    event.preventDefault();
    const fileInput = document.getElementById('importFile');
    const skipFirstRow = document.getElementById('skipFirstRow').checked;
    const file = fileInput.files[0];

    if (!file) {
        showAlert('Please select a file', 'error');
        return;
    }

    const progressDiv = document.getElementById('importProgress');
    const statusText = document.getElementById('importStatus');
    const progressBar = document.getElementById('importProgressBar');

    progressDiv.style.display = 'block';
    statusText.textContent = 'Reading file...';
    progressBar.style.width = '10%';

    try {
        let data;
        const fileName = file.name.toLowerCase();

        statusText.textContent = `Parsing ${file.name}...`;

        if (fileName.endsWith('.csv')) {
            data = await parseCSV(file, skipFirstRow);
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            data = await parseExcel(file, skipFirstRow);
        } else {
            throw new Error('Unsupported file format. Please use CSV or Excel files.');
        }

        if (!data || data.length === 0) {
            throw new Error('No data found in file. Please check the file format.');
        }

        statusText.textContent = `Found ${data.length} rows. Processing...`;
        progressBar.style.width = '20%';

        // Validate that we have enough columns
        const validRows = data.filter(row => row && row.length >= 7);
        if (validRows.length === 0) {
            throw new Error('No valid rows found. Each row must have at least 7 columns (Testcase ID through Expected Result).');
        }

        if (validRows.length < data.length) {
            statusText.textContent = `Warning: ${data.length - validRows.length} rows skipped (insufficient columns). Processing ${validRows.length} rows...`;
        }

        progressBar.style.width = '30%';

        // Import test cases
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < validRows.length; i++) {
            try {
                statusText.textContent = `Importing ${i + 1} of ${validRows.length}... (${successCount} successful, ${errorCount} failed)`;
                await importTestCase(validRows[i]);
                successCount++;
            } catch (error) {
                console.error(`Error importing row ${i + 1}:`, error);
                errorCount++;
                errors.push({ row: i + 1, testcaseId: validRows[i][0], error: error.message });
            }
            progressBar.style.width = `${30 + (i + 1) / validRows.length * 60}%`;
        }

        progressBar.style.width = '95%';
        statusText.textContent = 'Refreshing data...';

        await loadAllData();

        progressBar.style.width = '100%';

        // Show detailed results
        let resultMessage = `Import complete! ${successCount} successful, ${errorCount} failed.`;
        if (errors.length > 0 && errors.length <= 5) {
            resultMessage += '\n\nErrors:\n' + errors.map(e => `Row ${e.row} (${e.testcaseId}): ${e.error}`).join('\n');
        } else if (errors.length > 5) {
            resultMessage += `\n\nShowing first 5 errors:\n` +
                errors.slice(0, 5).map(e => `Row ${e.row} (${e.testcaseId}): ${e.error}`).join('\n') +
                `\n... and ${errors.length - 5} more errors. Check console for details.`;
        }

        statusText.textContent = resultMessage;

        setTimeout(() => {
            closeModal();
            if (successCount > 0) {
                showAlert(`Successfully imported ${successCount} test cases!${errorCount > 0 ? ` (${errorCount} failed)` : ''}`, 'success');
            } else {
                showAlert('Import failed. Please check the file format.', 'error');
            }
        }, 3000);

    } catch (error) {
        console.error('Import error:', error);
        statusText.textContent = 'Error: ' + error.message;
        progressBar.style.width = '100%';
        progressBar.style.background = 'var(--danger-color)';
        showAlert('Error importing file: ' + error.message, 'error');
    }
}

async function parseCSV(file, skipFirstRow) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const rows = [];
                let currentRow = [];
                let currentCell = '';
                let insideQuotes = false;
                let i = 0;

                while (i < text.length) {
                    const char = text[i];
                    const nextChar = text[i + 1];

                    if (char === '"') {
                        if (insideQuotes && nextChar === '"') {
                            // Escaped quote - add single quote to cell
                            currentCell += '"';
                            i += 2;
                            continue;
                        } else {
                            // Toggle quote state
                            insideQuotes = !insideQuotes;
                            i++;
                            continue;
                        }
                    }

                    if (!insideQuotes && char === ',') {
                        // End of cell
                        currentRow.push(currentCell.trim());
                        currentCell = '';
                        i++;
                        continue;
                    }

                    if (!insideQuotes && (char === '\n' || (char === '\r' && nextChar === '\n'))) {
                        // End of row
                        if (currentCell || currentRow.length > 0) {
                            currentRow.push(currentCell.trim());
                            if (currentRow.some(cell => cell !== '')) {
                                rows.push(currentRow);
                            }
                            currentRow = [];
                            currentCell = '';
                        }
                        i += (char === '\r' && nextChar === '\n') ? 2 : 1;
                        continue;
                    }

                    // Add character to current cell
                    currentCell += char;
                    i++;
                }

                // Handle last cell/row if exists
                if (currentCell || currentRow.length > 0) {
                    currentRow.push(currentCell.trim());
                    if (currentRow.some(cell => cell !== '')) {
                        rows.push(currentRow);
                    }
                }

                // Remove header row if requested
                const startIndex = skipFirstRow ? 1 : 0;
                const dataRows = rows.slice(startIndex).filter(row =>
                    row && row.length > 0 && row.some(cell => cell)
                );

                console.log(`Parsed ${dataRows.length} rows from CSV`);
                resolve(dataRows);
            } catch (error) {
                console.error('CSV parsing error:', error);
                reject(new Error('Failed to parse CSV: ' + error.message));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read CSV file'));
        reader.readAsText(file, 'UTF-8');
    });
}

async function parseExcel(file, skipFirstRow) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to array of arrays
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const startIndex = skipFirstRow ? 1 : 0;
                const rows = jsonData.slice(startIndex).filter(row =>
                    row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== '')
                );

                resolve(rows);
            } catch (error) {
                reject(new Error('Failed to parse Excel file: ' + error.message));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read Excel file'));
        reader.readAsArrayBuffer(file);
    });
}

async function importTestCase(rowData) {
    // Map CSV/Excel columns to test case object
    // Expected order: Testcase ID, Module, Sub Module, Description, Pre-Conditions,
    // Test Script, Expected Result, Priority, Status, Automated By, Comments, Clubbed TC ID, Tags

    if (!rowData || rowData.length < 7) {
        throw new Error('Invalid row format - minimum required: Testcase ID, Module, Sub Module, Description, Pre-Conditions, Test Script, Expected Result');
    }

    // Ensure all values are strings and handle null/undefined
    const cleanData = rowData.map(cell => {
        if (cell === null || cell === undefined) return '';
        return String(cell).trim();
    });

    // Pad array to ensure we have all 13 columns
    while (cleanData.length < 13) {
        cleanData.push('');
    }

    // Required fields validation with better error messages
    if (!cleanData[0]) throw new Error('Testcase ID is required (Column 1)');
    if (!cleanData[1]) throw new Error('Module is required (Column 2)');
    if (!cleanData[3]) throw new Error('Test Case Description is required (Column 4)');
    if (!cleanData[5]) throw new Error('Test Script is required (Column 6)');

    // Set default value for Expected Result if blank
    if (!cleanData[6]) {
        cleanData[6] = 'To be defined';
    }

    // Extract module name (handle "Module >> SubModule" format or just "Module")
    let moduleName = cleanData[1];
    let extractedSubModule = '';

    // Check if module contains ">>" separator
    if (moduleName.includes('>>')) {
        const parts = moduleName.split('>>').map(p => p.trim());
        moduleName = parts[0];
        if (parts.length > 1 && !cleanData[2]) {
            extractedSubModule = parts[1]; // Use extracted sub-module if column 3 is empty
        }
    }

    // Use extracted or provided sub-module
    const subModuleName = cleanData[2] || extractedSubModule;

    // Find or create module
    let module = null;
    if (moduleName) {
        module = modules.find(m => m.name.toLowerCase() === moduleName.toLowerCase());
        if (!module) {
            console.log(`Creating module: ${moduleName}`);
            const moduleDTO = { name: moduleName, description: 'Auto-created during import' };
            const response = await fetch(`${API_URL}/modules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moduleDTO)
            });
            if (response.ok) {
                module = await response.json();
                modules.push(module);
            } else {
                const error = await response.json().catch(() => ({ message: 'Failed to create module' }));
                throw new Error(`Failed to create module "${moduleName}": ${error.message}`);
            }
        }
    }

    if (!module) {
        throw new Error('Module is required. Could not create module.');
    }

    // Find or create sub-module
    let subModule = null;
    if (subModuleName) {
        subModule = subModules.find(sm =>
            sm.name.toLowerCase() === subModuleName.toLowerCase() &&
            sm.moduleId === module.id
        );
        if (!subModule) {
            console.log(`Creating sub-module: ${subModuleName} under ${moduleName}`);
            const subModuleDTO = {
                name: subModuleName,
                description: 'Auto-created during import',
                moduleId: module.id
            };
            const response = await fetch(`${API_URL}/submodules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subModuleDTO)
            });
            if (response.ok) {
                subModule = await response.json();
                subModules.push(subModule);
            }
        }
    }

    // Find or create priority
    let priority = null;
    if (cleanData[7]) {
        priority = priorities.find(p => p.name.toLowerCase() === cleanData[7].toLowerCase());
        if (!priority) {
            console.log(`Creating priority: ${cleanData[7]}`);
            const priorityDTO = {
                name: cleanData[7],
                description: 'Auto-created during import',
                level: null
            };
            const response = await fetch(`${API_URL}/priorities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(priorityDTO)
            });
            if (response.ok) {
                priority = await response.json();
                priorities.push(priority);
            }
        }
    }
    if (!priority && priorities.length > 0) {
        priority = priorities[0];
    }
    if (!priority) {
        throw new Error('No priority available. Please create at least one priority first.');
    }

    // Find or create status
    let status = null;
    const statusName = cleanData[8] || 'Yet to Start'; // Default to "Yet to Start" if blank

    status = statuses.find(s => s.name.toLowerCase() === statusName.toLowerCase());
    if (!status) {
        console.log(`Creating automation status: ${statusName}`);
        const statusDTO = {
            name: statusName,
            description: statusName === 'Yet to Start' ? 'Default status for test cases without automation status' : 'Auto-created during import'
        };
        const response = await fetch(`${API_URL}/automation-statuses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusDTO)
        });
        if (response.ok) {
            status = await response.json();
            statuses.push(status);
        } else {
            // If creation fails, try to use first available status
            if (statuses.length > 0) {
                status = statuses[0];
            }
        }
    }

    if (!status) {
        throw new Error('No automation status available. Please create at least one status first.');
    }

    // Find or create automated by
    let automatedBy = null;
    if (cleanData[9]) {
        automatedBy = users.find(u => u.name.toLowerCase() === cleanData[9].toLowerCase());
        if (!automatedBy) {
            console.log(`Creating user: ${cleanData[9]}`);
            const userDTO = {
                name: cleanData[9],
                email: '',
                team: ''
            };
            const response = await fetch(`${API_URL}/automated-by`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userDTO)
            });
            if (response.ok) {
                automatedBy = await response.json();
                users.push(automatedBy);
            }
        }
    }

    // Parse tags
    const tagIds = [];
    if (cleanData[12]) {
        const tagNames = cleanData[12].split(',').map(t => t.trim()).filter(t => t);
        for (const tagName of tagNames) {
            let tag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
            if (!tag) {
                console.log(`Creating tag: ${tagName}`);
                const tagDTO = {
                    name: tagName,
                    description: 'Auto-created during import',
                    color: '#6366f1'
                };
                const response = await fetch(`${API_URL}/tags`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tagDTO)
                });
                if (response.ok) {
                    tag = await response.json();
                    tags.push(tag);
                }
            }
            if (tag) {
                tagIds.push(tag.id);
            }
        }
    }

    // Create test case DTO
    const testCaseDTO = {
        testcaseId: cleanData[0],
        moduleId: module.id,
        subModuleId: subModule ? subModule.id : null,
        testCaseDescription: cleanData[3],
        preConditions: cleanData[4] || null,
        testScript: cleanData[5],
        expectedResult: cleanData[6],
        priorityId: priority.id,
        automationStatusId: status.id,
        automatedById: automatedBy ? automatedBy.id : null,
        automationComments: cleanData[10] || null,
        clubbedTcId: cleanData[11] || null,
        tagIds: tagIds
    };

    // Check if test case already exists
    const existingTC = testCases.find(tc => tc.testcaseId === testCaseDTO.testcaseId);
    if (existingTC) {
        // Update existing
        console.log(`Updating test case: ${testCaseDTO.testcaseId}`);
        const response = await fetch(`${API_URL}/testcases/${existingTC.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...testCaseDTO, id: existingTC.id })
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to update test case' }));
            throw new Error(`Update failed: ${error.message}`);
        }
    } else {
        // Create new
        console.log(`Creating test case: ${testCaseDTO.testcaseId}`);
        const response = await fetch(`${API_URL}/testcases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCaseDTO)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to create test case' }));
            throw new Error(`Create failed: ${error.message}`);
        }
    }
}

