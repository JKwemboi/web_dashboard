// === Utility Functions ===
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

// === Poster Upload Functionality ===
(function posterUploadInit() {
    const posterUpload = $('#posterUpload');
    const posterFile = $('#posterFile');
    const posterPreview = $('#posterPreview');
    const previewImage = $('#previewImage');
    const previewInfo = $('#previewInfo');
    const removeImage = $('#removeImage');

    function handleFile(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                posterPreview.style.display = 'block';
                posterUpload.style.display = 'none';
                previewInfo.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) handleFile(file);
    }

    function removePosterImage() {
        posterFile.value = '';
        posterPreview.style.display = 'none';
        posterUpload.style.display = 'block';
        previewImage.src = '';
        previewInfo.textContent = '';
    }

    if (posterFile) posterFile.addEventListener('change', handleFileSelect);
    if (removeImage) removeImage.addEventListener('click', removePosterImage);

    // Drag and drop
    if (posterUpload) {
        posterUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            posterUpload.classList.add('dragover');
        });
        posterUpload.addEventListener('dragleave', () => {
            posterUpload.classList.remove('dragover');
        });
        posterUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            posterUpload.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFile(files[0]);
        });
    }
})();

// === Genre Selection ===
(function genreSelectInit() {
    $$('.genre-option').forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
})();

// === Cast Member Management ===
(function castMemberInit() {
    const addCastMemberBtn = $('#addCastMember');
    const addCastModalEl = $('#addCastModal');
    const addCastBtn = $('#addCastBtn');
    const castList = $('#castList');
    const castForm = $('#castForm');

    let castModal = null;
    if (addCastModalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        castModal = new bootstrap.Modal(addCastModalEl);
    }

    if (addCastMemberBtn && castModal) {
        addCastMemberBtn.addEventListener('click', () => castModal.show());
    }
    if (addCastBtn) {
        addCastBtn.addEventListener('click', () => {
            const actorName = $('#actorName').value;
            const characterName = $('#characterName').value;
            if (actorName && characterName && castList) {
                addCastMember(actorName, characterName);
                if (castForm) castForm.reset();
                if (castModal) castModal.hide();
            }
        });
    }

    function addCastMember(actorName, characterName) {
        const initials = actorName.split(' ').map(name => name[0]).join('').toUpperCase();
        const colors = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const castMember = document.createElement('div');
        castMember.className = 'cast-member';
        castMember.innerHTML = `
            <div class="member-avatar" style="background: ${randomColor}">${initials}</div>
            <div class="member-info">
                <div class="member-name">${actorName}</div>
                <div class="member-role">${characterName}</div>
            </div>
            <button type="button" class="remove-member" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        castList.appendChild(castMember);
        castMember.querySelector('.remove-member').addEventListener('click', () => castMember.remove());
    }

    // Remove member for any pre-existing members
    $$('.remove-member').forEach(btn => {
        btn.addEventListener('click', e => {
            e.target.closest('.cast-member').remove();
        });
    });
})();

// === FileUploader Class (for video/trailer) ===
class FileUploader {
    constructor(uploadAreaId, fileInputId, previewId, options = {}) {
        this.uploadArea = document.getElementById(uploadAreaId);
        this.fileInput = document.getElementById(fileInputId);
        this.preview = document.getElementById(previewId);
        this.options = {
            maxSize: options.maxSize || 10 * 1024 * 1024 * 1024,
            acceptedTypes: options.acceptedTypes || ['video/mp4', 'video/mov', 'video/avi'],
            ...options
        };
        this.init();
    }
    init() {
        if (this.fileInput) this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            this.uploadArea.addEventListener('click', (e) => {
                if (e.target !== this.fileInput) { // avoid triggering twice
                    this.fileInput.click();
                }
            });
        }
    }
    handleDragOver(e) { e.preventDefault(); this.uploadArea.classList.add('dragover'); }
    handleDragLeave(e) { e.preventDefault(); this.uploadArea.classList.remove('dragover'); }
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) this.processFile(files[0]);
    }
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) this.processFile(file);
    }
    processFile(file) {
        if (!this.options.acceptedTypes.includes(file.type)) {
            this.showError('Invalid file type. Please select a video file.');
            return;
        }
        if (file.size > this.options.maxSize) {
            const maxSizeMB = this.options.maxSize / (1024 * 1024);
            this.showError(`File too large. Maximum size is ${maxSizeMB}MB.`);
            return;
        }
        this.showPreview(file);
        this.uploadFile(file);
    }
    showPreview(file) {
        const fileName = this.preview.querySelector(`#${this.preview.id.replace('Preview', 'FileName')}`);
        const fileMeta = this.preview.querySelector(`#${this.preview.id.replace('Preview', 'FileMeta')}`);
        const removeBtn = this.preview.querySelector(`#${this.preview.id.replace('Preview', '').replace('trailer', 'removeTrailer').replace('video', 'removeVideo')}`);
        if (fileName) fileName.textContent = file.name;
        if (fileMeta) fileMeta.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • ${file.type}`;
        this.preview.style.display = 'block';
        this.uploadArea.style.display = 'none';
        if (removeBtn) removeBtn.addEventListener('click', () => this.removeFile());
    }
    uploadFile(file) {
        const progressContainer = this.preview.querySelector(`#${this.preview.id.replace('Preview', 'Progress')}`);
        const progressFill = this.preview.querySelector(`#${this.preview.id.replace('Preview', 'ProgressFill')}`);
        const progressText = this.preview.querySelector(`#${this.preview.id.replace('Preview', 'ProgressText')}`);
        if (progressContainer) progressContainer.style.display = 'block';
        this.uploadArea.classList.add('uploading');
        let progress = 0;
        const uploadInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(uploadInterval);
                this.uploadComplete(file);
            }
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressText) progressText.textContent = Math.round(progress) + '%';
        }, 300);
    }
    uploadComplete(file) {
        const progressContainer = this.preview.querySelector(`#${this.preview.id.replace('Preview', 'Progress')}`);
        const fileMeta = this.preview.querySelector(`#${this.preview.id.replace('Preview', 'FileMeta')}`);
        if (progressContainer) progressContainer.style.display = 'none';
        this.uploadArea.classList.remove('uploading');
        if (this.preview.id === 'videoPreview') {
            const estimatedSize = document.getElementById('estimatedSize');
            if (estimatedSize) estimatedSize.value = (file.size / (1024 * 1024 * 1024)).toFixed(2);
        }
        if (fileMeta) fileMeta.innerHTML += ' • <span class="status-success"><i class="fas fa-check"></i> Uploaded</span>';
    }
    removeFile() {
        this.fileInput.value = '';
        this.preview.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.uploadArea.classList.remove('uploading');
        if (this.preview.id === 'videoPreview') {
            const estimatedSize = document.getElementById('estimatedSize');
            if (estimatedSize) estimatedSize.value = '';
        }
    }
    showError(message) {
        const parent = this.uploadArea.parentNode;
        const existingError = parent.querySelector('.file-error');
        if (existingError) existingError.remove();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'file-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        parent.insertBefore(errorDiv, this.uploadArea.nextSibling);
        setTimeout(() => { errorDiv.remove(); }, 5000);
    }
}

// === Initialize File Uploaders on DOM Ready ===
document.addEventListener('DOMContentLoaded', function() {
    new FileUploader('videoUploadArea', 'videoFile', 'videoPreview', {
        maxSize: 10 * 1024 * 1024 * 1024,
        acceptedTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm']
    });
    new FileUploader('trailerUploadArea', 'trailerFile', 'trailerPreview', {
        maxSize: 500 * 1024 * 1024,
        acceptedTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm']
    });
});

// === Chart Colors ===
const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    light: '#f8fafc',
    dark: '#1f2937'
};

// === Chart Initializations (Chart.js) ===
(function chartInit() {
    function safeGetContext(id) {
        const el = document.getElementById(id);
        return el ? el.getContext('2d') : null;
    }
    const charts = [
        // Views Chart
        () => {
            const ctx = safeGetContext('viewsChart');
            if (!ctx) return;
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Views',
                        data: [8200, 12400, 15800, 18600, 21300, 19800, 16500],
                        borderColor: chartColors.primary,
                        backgroundColor: chartColors.primary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: chartColors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f3f4f6' },
                            ticks: { callback: v => (v/1000)+'K' }
                        },
                        x: { grid: { display: false } }
                    },
                    interaction: { intersect: false, mode: 'index' }
                }
            });
        },
        // Top Genres Chart
        () => {
            const ctx = safeGetContext('genresChart');
            if (!ctx) return;
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'],
                    datasets: [{
                        data: [30, 25, 20, 15, 10],
                        backgroundColor: [
                            chartColors.primary, chartColors.success, chartColors.warning, chartColors.danger, chartColors.info
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        },
        // Revenue Chart
        () => {
            const ctx = safeGetContext('revenueChart');
            if (!ctx) return;
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        backgroundColor: chartColors.success,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        },
        // User Growth Chart
        () => {
            const ctx = safeGetContext('userGrowthChart');
            if (!ctx) return;
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Premium Users',
                        data: [100, 150, 200, 280, 350, 420],
                        borderColor: chartColors.warning,
                        backgroundColor: chartColors.warning + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        },
        // Geographic Distribution
        () => {
            const ctx = safeGetContext('geoChart');
            if (!ctx) return;
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['USA', 'Canada', 'UK', 'Germany', 'France', 'Others'],
                    datasets: [{
                        label: 'Users',
                        data: [45, 15, 12, 8, 6, 14],
                        backgroundColor: [
                            chartColors.primary, chartColors.success, chartColors.warning,
                            chartColors.danger, chartColors.info, '#6b7280'
                        ],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                        y: { grid: { display: false } }
                    }
                }
            });
        },
        // Device Usage
        () => {
            const ctx = safeGetContext('deviceChart');
            if (!ctx) return;
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Mobile', 'Desktop', 'Tablet', 'Smart TV'],
                    datasets: [{
                        data: [45, 30, 15, 10],
                        backgroundColor: [
                            chartColors.primary,
                            chartColors.success,
                            chartColors.warning,
                            chartColors.danger
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        },
        // Sentiment Chart
        () => {
            const ctx = safeGetContext('sentimentChart');
            if (!ctx) return;
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        {
                            label: 'Positive',
                            data: [65, 70, 68, 75],
                            borderColor: chartColors.success,
                            backgroundColor: chartColors.success + '20',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: 'Neutral',
                            data: [25, 20, 22, 18],
                            borderColor: chartColors.warning,
                            backgroundColor: chartColors.warning + '20',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: 'Negative',
                            data: [10, 10, 10, 7],
                            borderColor: chartColors.danger,
                            backgroundColor: chartColors.danger + '20',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: '#f3f4f6' },
                            ticks: { callback: v => v + '%' }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    ];
    charts.forEach(init => init());
})();

// === Real-time Data Simulation ===
setInterval(() => {
    const viewers = $('#liveViewers');
    const streams = $('#liveStreams');
    const revenue = $('#liveRevenue');
    const signups = $('#liveSignups');
    if (!(viewers && streams && revenue && signups)) return;
    const viewersChange = Math.floor(Math.random() * 20) - 10;
    const streamsChange = Math.floor(Math.random() * 10) - 5;
    const revenueChange = Math.floor(Math.random() * 100) - 50;
    const signupsChange = Math.floor(Math.random() * 3) - 1;
    viewers.textContent = (parseInt(viewers.textContent.replace(',', '')) + viewersChange).toLocaleString();
    streams.textContent = Math.max(0, parseInt(streams.textContent) + streamsChange);
    revenue.textContent = '$' + (parseInt(revenue.textContent.replace('$', '').replace(',', '')) + revenueChange).toLocaleString();
    signups.textContent = Math.max(0, parseInt(signups.textContent) + signupsChange);
}, 5000);

// === Filter Button (Generic Handler) ===
$$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Optionally, update chart data
        console.log('Filter changed to:', this.textContent);
    });
});

// === Movie Grid/List Toggle ===
(function movieViewToggle() {
    const gridViewBtn = $('#gridView');
    const listViewBtn = $('#listView');
    const GridSystem = $('#GridSystem');
    const ListSystem = $('#ListSystem');
    if (!(gridViewBtn && listViewBtn && GridSystem && ListSystem)) return;
    gridViewBtn.addEventListener('click', () => {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        GridSystem.classList.remove('hidden');
        ListSystem.classList.remove('active');
    });
    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        GridSystem.classList.add('hidden');
        ListSystem.classList.add('active');
    });
})();

// === Load More Reviews Button ===
const loadMoreBtn = $('.load-more');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        setTimeout(() => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner me-2"></i>Load More Reviews';
            // Dynamically add more reviews here if needed
        }, 2000);
    });
}

// === Settings Navigation & UI ===
(function settingsNavAndUI() {
    $$('.settings-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            $$('.settings-nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    $$('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            $$('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    $$('.security-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    const changeLogoBtn = $("#changeLogoBtn");
    const logoInput = $("#logoInput");
    const logoPreview = $("#logoPreview");
    if (changeLogoBtn && logoInput && logoPreview) {
        changeLogoBtn.addEventListener("click", () => logoInput.click());
        logoInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file && file.type === "image/png") {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo" style="width:80px; height:60px; border-radius: var(--border-radius);">`;
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please upload a PNG image.");
            }
        });
    }
})();
