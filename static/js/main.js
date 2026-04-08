/* 
Name                 : VidManage – Bootstrap CRM & Project Management Admin Template
Author               : TemplateRise
Url                  : https://www.templaterise.com/template/VidManage-bootstrap-crm-project-management-admin-template
*/

/**
 * Main Application Module
 *
 */
class AdminDashboard {
  constructor() {
    this.state = {
      isCollapsedManually: false,
      collapseClickCount: 0,
      mobileOverlayVisible: false,
      variants: [
        {
          size: "Choose Size",
          color: "Choose Color",
          price: "210.10",
          quantity: 2,
          image: "./assets/icons/image-icon.svg",
        },
      ],
    };

    this.elements = this.cacheElements();
    this.overlay = this.createOverlay();

    this.init();
  }

  // Cache DOM elements to avoid repeated queries
  cacheElements() {
    return {
      preloader: document.getElementById("preloader"),
      mainWrapper: document.getElementById("main-wrapper"),
      collapseSidebar: document.querySelector(".collapse-sidebar"),
      collapseMainContent: document.querySelector(".content-wrapper"),
      sidebar: document.querySelector(".sidebar"),
      submenuParents: document.querySelectorAll(".submenu-parent"),
      icon: document.querySelector(".collapse-sidebar i"),
      menuToggle: document.querySelector(".menu-toggle"),
      selectAllCheckbox: document.getElementById("select-all"),
      rowCheckboxes: document.querySelectorAll(".row-checkbox"),
      editors: document.querySelectorAll(".editor"),
      dropzone: document.getElementById("dropzone"),
      fileInput: document.getElementById("fileInput"),
      preview: document.getElementById("preview"),
      browseButton: document.getElementById("browseButton"),
      variantsTable: document.getElementById("variants-table"),
      addVariantButton: document.getElementById("add-variant"),
      printInvoiceButton: document.getElementById("printInvoice"),
      browsedatatable: document.getElementById("datatable"),
      header: document.querySelector(".header"),
      ckeditor: document.querySelector("#ckeditor"),
      inputTags: document.querySelector(".input-tagify"),
      toggleButtons: document.querySelectorAll(".toggle-password"),
      modals: document.querySelectorAll(".modal"),
      calendarEl: document.getElementById("calendar"),
      eventModalEl: document.getElementById("eventModal"),
      themeToggle: document.getElementById("themeToggle"),
      passwordInput: document.getElementById("password"),
      passwordIcon: document.getElementById("passwordIcon"),
      loginCard: document.querySelector(".login-card"),
      formControls: document.querySelectorAll(".form-control"),
    };
  }

  createOverlay() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay-hidden");
    document.body.appendChild(overlay);
    return overlay;
  }

  init() {
    this.initPreloader();
    this.initSidebar();
    this.initCheckboxes();
    this.initFileUpload();
    this.initVariants();
    this.initThirdPartyLibraries();
    this.initPasswordToggles();
    this.initModals();
    this.initEmailFeatures();
    this.initCalendar();
    this.initEventListeners();
    this.DarkAndLight();
    this.entranceAnimation();
    this.initPasswordToggle();
    this.initFloatingLabels();
    this.initLoginCardAnimation();
  }

  DarkAndLight() {
    if (this.elements.themeToggle) {
      const root = document.documentElement;
      const sunIcon = this.elements.themeToggle.querySelector(".sun-icon");
      const moonIcon = this.elements.themeToggle.querySelector(".moon-icon");
      function updateIcons(isDark) {
        if (isDark) {
          sunIcon.classList.add("d-none");
          moonIcon.classList.remove("d-none");
        } else {
          sunIcon.classList.remove("d-none");
          moonIcon.classList.add("d-none");
        }
      }

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        root.setAttribute("data-bs-theme", savedTheme);
        updateIcons(savedTheme === "dark");
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.setAttribute("data-bs-theme", prefersDark ? "dark" : "light");
        updateIcons(prefersDark);
      }

      themeToggle.addEventListener("click", () => {
        const isDark = root.getAttribute("data-bs-theme") === "dark";
        const newTheme = isDark ? "light" : "dark";
        root.setAttribute("data-bs-theme", newTheme);
        updateIcons(newTheme === "dark");
        localStorage.setItem("theme", newTheme);
      });
    }
  }

  entranceAnimation() {
    const errorContent = document.querySelector(".error-content");
    if (errorContent) {
      errorContent.style.opacity = "0";
      errorContent.style.transform = "translateY(50px)";

      setTimeout(() => {
        errorContent.style.transition = "all 0.8s ease";
        errorContent.style.opacity = "1";
        errorContent.style.transform = "translateY(0)";
      }, 200);
    }
  }

  // Preloader initialization
  initPreloader() {
    if (this.elements.preloader) {
      setTimeout(() => {
        this.elements.preloader.style.display = "none";
        this.elements.mainWrapper.style.display = "block";
      }, 100);
    }
  }

  // Sidebar functionality
  initSidebar() {
    this.initSubmenuToggle();
    this.initSidebarCollapse();
    this.initMobileMenu();
    this.initResizeHandler();
  }

  initSubmenuToggle() {
    this.elements.submenuParents.forEach((parent) => {
      parent.addEventListener("click", this.handleSubmenuToggle.bind(this));
    });
  }

  handleSubmenuToggle(e) {
    e.preventDefault();
    const parent = e.currentTarget;
    const submenu = parent.nextElementSibling;
    const rightIcon = parent.querySelector(".right-icon");

    parent.classList.toggle("active");
    submenu?.classList.toggle("open");
    rightIcon?.classList.toggle("rotate");
  }

  initSidebarCollapse() {
    if (!this.elements.collapseSidebar) return;

    this.elements.collapseSidebar.addEventListener("click", () => {
      this.state.collapseClickCount++;
      const isDoubleClick = this.state.collapseClickCount === 2;

      if (isDoubleClick) {
        this.expandSidebar();
        this.state.collapseClickCount = 0;
        this.state.isCollapsedManually = false;
      } else {
        this.collapseSidebar();
        this.state.isCollapsedManually = true;
      }
    });

    // Hover effects
    if (this.elements.sidebar) {
      this.elements.sidebar.addEventListener(
        "mouseenter",
        this.handleSidebarHover.bind(this)
      );
      this.elements.sidebar.addEventListener(
        "mouseleave",
        this.handleSidebarLeave.bind(this)
      );
    }
  }

  collapseSidebar() {
    const classActions = [
      {
        element: this.elements.sidebar,
        add: ["sidebar-collapsed"],
        remove: [],
      },
      {
        element: this.elements.icon,
        add: ["icon-rotated", "fa-arrow-right"],
        remove: ["fa-bars"],
      },
      {
        element: this.elements.collapseMainContent,
        add: ["collapse-main-collapsed"],
        remove: ["collapse-main-expanded"],
      },
      {
        element: this.elements.header,
        add: ["header-collapsed"],
        remove: ["header-expanded"],
      },
    ];

    this.applyClassActions(classActions);
  }

  expandSidebar() {
    const classActions = [
      {
        element: this.elements.sidebar,
        remove: ["sidebar-collapsed"],
        add: [],
      },
      {
        element: this.elements.icon,
        remove: ["icon-rotated", "fa-arrow-right"],
        add: ["fa-bars"],
      },
      {
        element: this.elements.collapseMainContent,
        remove: ["collapse-main-collapsed"],
        add: ["collapse-main-expanded"],
      },
      {
        element: this.elements.header,
        remove: ["header-collapsed"],
        add: ["header-expanded"],
      },
    ];

    this.applyClassActions(classActions);
  }

  applyClassActions(actions) {
    actions.forEach(({ element, add = [], remove = [] }) => {
      if (element) {
        element.classList.remove(...remove);
        element.classList.add(...add);
      }
    });
  }

  handleSidebarHover() {
    if (this.elements.sidebar.classList.contains("sidebar-collapsed")) {
      this.expandSidebar();
    }
  }

  handleSidebarLeave() {
    if (
      !this.elements.sidebar.classList.contains("sidebar-collapsed") &&
      this.state.isCollapsedManually
    ) {
      this.collapseSidebar();
    }
  }

  initMobileMenu() {
    if (this.elements.menuToggle) {
      this.elements.menuToggle.addEventListener(
        "click",
        this.toggleMobileMenu.bind(this)
      );
    }

    this.overlay.addEventListener("click", () => {
      if (this.state.mobileOverlayVisible) {
        this.closeMobileSidebar();
      }
    });
  }

  toggleMobileMenu() {
    if (!this.state.mobileOverlayVisible) {
      this.openMobileSidebar();
    } else {
      this.closeMobileSidebar();
    }
  }

  openMobileSidebar() {
    this.elements.sidebar.classList.add("sidebar-visible");
    this.overlay.classList.remove("overlay-hidden");
    this.overlay.classList.add("overlay-visible");
    this.state.mobileOverlayVisible = true;
  }

  closeMobileSidebar() {
    if(this.elements.sidebar){
      this.elements.sidebar.classList.remove("sidebar-visible");
    }
    if(this.overlay.classList){
      this.overlay.classList.remove("overlay-visible");
      this.overlay.classList.add("overlay-hidden");
    }
    this.state.mobileOverlayVisible = false;
  }

  initResizeHandler() {
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(this.handleResize.bind(this), 250);
    });
  }

  handleResize() {
    const isDesktop = window.innerWidth >= 993;

    if (isDesktop) {
      this.resetSidebarToDefault();
    } else {
      this.resetSidebarToMobile();
    }

    this.closeMobileSidebar();
    this.state.isCollapsedManually = false;
  }

  resetSidebarToDefault() {
    const classActions = [
      {
        element: this.elements.collapseMainContent,
        remove: ["collapse-main-expanded", "collapse-main-collapsed"],
      },
      {
        element: this.elements.header,
        remove: ["header-expanded", "header-collapsed"],
      },
      { element: this.elements.sidebar, remove: ["sidebar-collapsed"] },
      {
        element: this.elements.icon,
        add: ["fa-bars"],
        remove: ["fa-arrow-right"],
      },
    ];

    this.applyClassActions(classActions);
  }

  resetSidebarToMobile() {
    this.resetSidebarToDefault();
  }

  // Checkbox functionality
  initCheckboxes() {
    if (this.elements.selectAllCheckbox && this.elements.rowCheckboxes.length) {
      this.elements.selectAllCheckbox.addEventListener(
        "change",
        this.handleSelectAll.bind(this)
      );

      this.elements.rowCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener(
          "change",
          this.handleRowCheckboxChange.bind(this)
        );
      });
    }
  }

  handleSelectAll() {
    const isChecked = this.elements.selectAllCheckbox.checked;
    this.elements.rowCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  }

  handleRowCheckboxChange() {
    const allChecked = Array.from(this.elements.rowCheckboxes).every(
      (checkbox) => checkbox.checked
    );
    this.elements.selectAllCheckbox.checked = allChecked;
  }

  // File upload functionality
  initFileUpload() {
    if (!this.elements.dropzone) return;

    const dropzoneEvents = [
      { event: "dragover", handler: this.handleDragOver.bind(this) },
      { event: "dragleave", handler: this.handleDragLeave.bind(this) },
      { event: "drop", handler: this.handleDrop.bind(this) },
    ];

    dropzoneEvents.forEach(({ event, handler }) => {
      this.elements.dropzone.addEventListener(event, handler);
    });

    this.elements.browseButton?.addEventListener("click", () =>
      this.elements.fileInput.click()
    );
    this.elements.fileInput?.addEventListener(
      "change",
      this.handleFileInputChange.bind(this)
    );
  }

  handleDragOver(e) {
    e.preventDefault();
    this.elements.dropzone.style.borderColor = "#6c63ff";
  }

  handleDragLeave() {
    this.elements.dropzone.style.borderColor = "#d3d3d3";
  }

  handleDrop(e) {
    e.preventDefault();
    this.elements.dropzone.style.borderColor = "#d3d3d3";
    const files = Array.from(e.dataTransfer.files);
    this.handleFiles(files);
  }

  handleFileInputChange() {
    const files = Array.from(this.elements.fileInput.files);
    this.handleFiles(files);
  }

  handleFiles(files) {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => this.createImagePreview(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  createImagePreview(imageSrc) {
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";

    previewItem.innerHTML = `
      <img src="${imageSrc}" alt="Preview">
      <div class="actions">
        <button onclick="this.closest('.preview-item').remove()">
          <i class='fa-solid fa-trash'></i>
        </button>
      </div>
    `;

    this.elements.preview.appendChild(previewItem);
  }

  // Variants table functionality
  initVariants() {
    if (!this.elements.variantsTable) return;

    this.renderVariants();

    this.elements.addVariantButton?.addEventListener(
      "click",
      this.addVariant.bind(this)
    );
    this.elements.variantsTable.addEventListener(
      "click",
      this.handleVariantTableClick.bind(this)
    );
    this.elements.variantsTable.addEventListener(
      "input",
      this.handleVariantInputChange.bind(this)
    );
    this.elements.variantsTable.addEventListener(
      "change",
      this.handleVariantFileUpload.bind(this)
    );
  }

  addVariant() {
    this.state.variants.push({
      size: "Choose Size",
      color: "Choose Color",
      price: "0.00",
      quantity: 0,
      image: "./assets/icons/image-icon.svg",
    });
    this.renderVariants();
  }

  renderVariants() {
    this.elements.variantsTable.innerHTML = "";

    this.state.variants.forEach((variant, index) => {
      const row = this.createVariantRow(variant, index);
      this.elements.variantsTable.appendChild(row);
    });
  }

  createVariantRow(variant, index) {
    const row = document.createElement("tr");
    row.innerHTML = this.getVariantRowHTML(variant, index);
    return row;
  }

  getVariantRowHTML(variant, index) {
    return `
      <td>
        <label>
          <img src="${
            variant.image
          }" class="image-preview" style="width: 50px; height: 50px; object-fit: cover;" alt="Preview">
          <input type="file" class="file-input" multiple data-index="${index}" accept="image/*" style="display: none;">
        </label>
      </td>
      <td>
        <select class="form-select" data-index="${index}" data-field="size">
          ${this.createSelectOptions(
            ["Choose Size", "S", "M", "L"],
            variant.size
          )}
        </select>
      </td>
      <td>
        <select class="form-select" data-index="${index}" data-field="color">
          ${this.createSelectOptions(
            ["Choose Color", "Red", "Blue", "Green"],
            variant.color
          )}
        </select>
      </td>
      <td width="200px">
        <input type="text" class="form-control" value="${
          variant.price
        }" data-index="${index}" data-field="price">
      </td>
      <td>
        <div class="d-flex">
          <div class="counter-container">
            <input type="number" class="counter-input" value="${
              variant.quantity
            }" readonly>
            <div>
              <a href="javascript:void(0)" class="counter-btn" data-action="decrease" data-index="${index}">-</a>
              <a href="javascript:void(0)" class="counter-btn" data-action="increase" data-index="${index}">+</a>
            </div>
          </div>
          <a href="javascript:void(0)" class="btn btn-sm text-danger" data-index="${index}">
            <i class="fa-solid fa-trash"></i>
          </a>
        </div>
      </td>
    `;
  }

  createSelectOptions(options, selectedValue) {
    return options
      .map(
        (option) =>
          `<option ${
            option === selectedValue ? "selected" : ""
          }>${option}</option>`
      )
      .join("");
  }

  handleVariantTableClick(e) {
    const target = e.target;
    const index = parseInt(target.dataset.index);

    if (target.matches("[data-action='increase']")) {
      this.state.variants[index].quantity++;
      this.renderVariants();
    } else if (
      target.matches("[data-action='decrease']") &&
      this.state.variants[index].quantity > 0
    ) {
      this.state.variants[index].quantity--;
      this.renderVariants();
    } else if (target.closest("[data-index]")?.querySelector("i.fa-trash")) {
      this.state.variants.splice(index, 1);
      this.renderVariants();
    }
  }

  handleVariantInputChange(e) {
    const { index, field } = e.target.dataset;
    if (index !== undefined && field) {
      this.state.variants[parseInt(index)][field] = e.target.value;
    }
  }

  handleVariantFileUpload(e) {
    if (e.target.matches(".file-input")) {
      const index = parseInt(e.target.dataset.index);
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.state.variants[index].image = reader.result;
          this.renderVariants();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // Third-party library initialization
  initThirdPartyLibraries() {
    this.initTagify();
    this.initPrintInvoice();
    this.initDataTable();
    this.initQuillEditors();
    this.initCKEditor();
    this.initSelect2();
    this.initProfileUpload();
    this.initFAQ();
  }

  initTagify() {
    if (this.elements.inputTags) {
      const tagify = new Tagify(this.elements.inputTags);
      tagify.DOM.input.blur();
    }
  }

  initPrintInvoice() {
    this.elements.printInvoiceButton?.addEventListener(
      "click",
      this.handlePrintInvoice.bind(this)
    );
  }

  handlePrintInvoice() {
    const printContent = document.getElementById("invoice-section");
    if (!printContent) return;

    const printDiv = document.createElement("div");
    printDiv.id = "printDiv";
    printDiv.innerHTML = printContent.innerHTML;
    document.body.appendChild(printDiv);

    const style = document.createElement("style");
    style.innerHTML = this.getPrintStyles();
    document.head.appendChild(style);

    window.print();

    document.body.removeChild(printDiv);
    document.head.removeChild(style);
  }

  getPrintStyles() {
    return `
      @media print {
        body * { visibility: hidden; }
        #printDiv, #printDiv * { visibility: visible; }
        #printDiv {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          max-width: 100%;
          height: auto;
          margin: 0;
          padding: 0;
        }
        .container, .card, .card-body { page-break-inside: avoid; }
        table { width: 100%; page-break-inside: auto; }
        .table th, .table td { white-space: nowrap; }
      }
    `;
  }

  initDataTable() {
    if (this.elements.browsedatatable) {
      new DataTable(this.elements.browsedatatable);
    }
  }

  initQuillEditors() {
    this.elements.editors.forEach((editor) => {
      new Quill(editor, { theme: "snow" });
    });
  }

  initCKEditor() {
    if (this.elements.ckeditor) {
      ClassicEditor.create(this.elements.ckeditor).catch((error) =>
        console.error("Error initializing CKEditor 5", error)
      );
    }
  }

  initSelect2() {
    const select2Elements = [
      ...document.querySelectorAll(".select2-single"),
      ...document.querySelectorAll(".select2-multiple"),
    ];

    select2Elements.forEach((element) => {
      if (typeof $ !== "undefined" && $.fn.select2) {
        $(element).select2();
      }
    });
  }

  // Password toggle functionality
  initPasswordToggles() {
    this.elements.toggleButtons.forEach((button) => {
      button.addEventListener("click", this.handlePasswordToggle.bind(this));
    });
  }

  handlePasswordToggle(e) {
    const button = e.currentTarget;
    const input = button.parentElement.querySelector(".input-password");
    const isPassword = input.getAttribute("type") === "password";

    input.setAttribute("type", isPassword ? "text" : "password");
    button.innerHTML = this.getPasswordToggleIcon(isPassword);
  }

  getPasswordToggleIcon(isPassword) {
    const eyeIcon = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;

    const eyeOffIcon = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>`;

    return isPassword ? eyeIcon : eyeOffIcon;
  }

  // Profile upload functionality
  initProfileUpload() {
    document.addEventListener("change", this.handleProfileUpload.bind(this));
  }

  handleProfileUpload(event) {
    if (!event.target.classList.contains("uploadProfileInput")) return;

    const triggerInput = event.target;
    const holder = triggerInput.closest(".pic-holder");
    const wrapper = triggerInput.closest(".profile-pic-wrapper");
    const currentImg = holder.querySelector(".pic").src;

    // Clear existing alerts
    wrapper
      .querySelectorAll('[role="alert"]')
      .forEach((alert) => alert.remove());
    triggerInput.blur();

    const files = triggerInput.files || [];
    if (!files.length || !window.FileReader) return;

    const file = files[0];
    if (!/^image/.test(file.type)) {
      this.showAlert(wrapper, "Please choose a valid image.", "alert-danger");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () =>
      this.processProfileImageUpload(
        holder,
        wrapper,
        triggerInput,
        reader.result,
        currentImg
      );
    reader.readAsDataURL(file);
  }

  processProfileImageUpload(
    holder,
    wrapper,
    triggerInput,
    newImageSrc,
    currentImg
  ) {
    holder.classList.add("uploadInProgress");
    holder.querySelector(".pic").src = newImageSrc;

    const loader = this.createLoader();
    holder.appendChild(loader);

    setTimeout(() => {
      holder.classList.remove("uploadInProgress");
      loader.remove();

      const isSuccess = Math.random() < 0.9; // Simulate success rate
      if (isSuccess) {
        this.showAlert(
          wrapper,
          '<i class="fa fa-check-circle text-success"></i> Profile image updated successfully',
          "snackbar"
        );
      } else {
        holder.querySelector(".pic").src = currentImg;
        this.showAlert(
          wrapper,
          '<i class="fa fa-times-circle text-danger"></i> There was an error while uploading! Please try again later.',
          "snackbar"
        );
      }
      triggerInput.value = "";
    }, 1500);
  }

  showAlert(wrapper, message, alertClass) {
    const alert = document.createElement("div");
    alert.className = `${alertClass} show`;
    alert.setAttribute("role", "alert");
    alert.innerHTML = message;
    wrapper.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
  }

  createLoader() {
    const loader = document.createElement("div");
    loader.className = "upload-loader";
    loader.innerHTML =
      '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>';
    return loader;
  }

  // FAQ functionality
  initFAQ() {
    document.querySelectorAll(".faq-question").forEach((question) => {
      question.addEventListener("click", this.handleFAQClick.bind(this));
    });
  }

  handleFAQClick(e) {
    const question = e.currentTarget;
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains("active");

    // Close all FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add("active");
    }
  }

  // Modal functionality
  initModals() {
    this.elements.modals.forEach((modal) => {
      const dismissButtons = modal.querySelectorAll(
        '[data-modal-dismiss="modal"]'
      );
      const targetButtons = document.querySelectorAll(
        `[data-modal-target="#${modal.id}"]`
      );

      dismissButtons.forEach((btn) => {
        btn.addEventListener("click", () => modal.classList.remove("show"));
      });

      targetButtons.forEach((btn) => {
        btn.addEventListener("click", () => modal.classList.add("show"));
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("show");
      });
    });
  }

  // Email functionality
  initEmailFeatures() {
    this.initEmailSidebar();
    this.initEmailActions();
  }

  initEmailSidebar() {
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const sidebarEmail = document.getElementById("Emailsidebar");
    const sidebarOverlay = document.getElementById("EmailsidebarOverlay");

    if (!hamburgerMenu || !sidebarEmail || !sidebarOverlay) return;

    hamburgerMenu.addEventListener("click", () =>
      this.openEmailSidebar(sidebarEmail, sidebarOverlay)
    );
    sidebarOverlay.addEventListener("click", () =>
      this.closeEmailSidebar(sidebarEmail, sidebarOverlay)
    );

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        sidebarEmail.classList.contains("show") &&
        !sidebarEmail.contains(e.target) &&
        !hamburgerMenu.contains(e.target)
      ) {
        this.closeEmailSidebar(sidebarEmail, sidebarOverlay);
      }
    });
  }

  openEmailSidebar(sidebar, overlay) {
    sidebar.classList.add("show");
    overlay.classList.remove("d-none");
    document.body.classList.add("sidebar-open");
  }

  closeEmailSidebar(sidebar, overlay) {
    sidebar.classList.remove("show");
    overlay.classList.add("d-none");
    document.body.classList.remove("sidebar-open");
  }

  initEmailActions() {
    const emailElements = {
      replyBtn: document.getElementById("replyBtn"),
      replyAllBtn: document.getElementById("replyAllBtn"),
      forwardBtn: document.getElementById("forwardBtn"),
      cancelReplyBtn: document.getElementById("cancelReplyBtn"),
      sendReplyBtn: document.getElementById("sendReplyBtn"),
      sendBtn: document.getElementById("sendBtn"),
      replyForm: document.getElementById("replyForm"),
      replySubject: document.getElementById("replySubject"),
      emailSubject: document.getElementById("emailSubject"),
      replyMessage: document.getElementById("replyMessage"),
      toField: document.getElementById("toField"),
      subjectField: document.getElementById("subjectField"),
      messageBody: document.getElementById("messageBody"),
      composeModal: document.getElementById("composeModal"),
      composeForm: document.getElementById("composeForm"),
    };

    this.setupEmailEventListeners(emailElements);
  }

  setupEmailEventListeners(elements) {
    const emailActions = [
      {
        element: elements.replyBtn,
        handler: () => this.handleEmailAction(elements, "Re: "),
      },
      {
        element: elements.replyAllBtn,
        handler: () => this.handleEmailAction(elements, "Re: "),
      },
      {
        element: elements.forwardBtn,
        handler: () => this.handleEmailAction(elements, "Fwd: "),
      },
      {
        element: elements.cancelReplyBtn,
        handler: () => this.handleCancelReply(elements),
      },
      {
        element: elements.sendReplyBtn,
        handler: () => this.handleSendReply(elements),
      },
      {
        element: elements.sendBtn,
        handler: () => this.handleSendEmail(elements),
      },
    ];

    emailActions.forEach(({ element, handler }) => {
      element?.addEventListener("click", handler);
    });
  }

  handleEmailAction(elements, prefix) {
    this.toggleDisplay(elements.replyForm, true);
    elements.replySubject.value = prefix + elements.emailSubject.textContent;
  }

  handleCancelReply(elements) {
    this.toggleDisplay(elements.replyForm, false);
    elements.replyMessage.value = "";
  }

  handleSendReply(elements) {
    const message = elements.replyMessage.value;
    if (message.trim()) {
      alert("Reply sent successfully!");
      this.toggleDisplay(elements.replyForm, false);
      elements.replyMessage.value = "";
    } else {
      alert("Please enter a message before sending.");
    }
  }

  handleSendEmail(elements) {
    const { toField, subjectField, messageBody, composeModal, composeForm } =
      elements;

    if (toField.value && subjectField.value && messageBody.value) {
      alert("Email sent successfully!");
      composeModal.classList.remove("show");
      composeForm.reset();
    } else {
      alert("Please fill in all required fields.");
    }
  }

  toggleDisplay(element, show) {
    if (element) {
      element.classList.toggle("d-none", !show);
    }
  }

  // Calendar functionality
  initCalendar() {
    if (!this.elements.calendarEl || !this.elements.eventModalEl) return;

    this.eventModal = new bootstrap.Modal(this.elements.eventModalEl);
    this.calendar = new FullCalendar.Calendar(this.elements.calendarEl, {
      timeZone: "UTC",
      headerToolbar: this.getResponsiveHeaderToolbar(),
      selectable: true,
      editable: true,
      dayMaxEvents: true,
      dateClick: (info) =>
        this.openEventModal({
          id: "",
          title: "",
          start: info.dateStr + "T00:00",
          end: info.dateStr + "T23:59",
          description: "",
          isNew: true,
        }),
      eventClick: (info) => {
        const event = info.event;
        this.openEventModal({
          id: event.id,
          title: event.title,
          start: event.startStr,
          end: event.endStr,
          description: event.extendedProps.description || "",
          isNew: false,
        });
      },
    });

    this.calendar.render();
    this.initCalendarEventListeners();
  }

  getResponsiveHeaderToolbar() {
    return window.innerWidth < 768
      ? { left: "prev,next", center: "title", right: "" }
      : {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        };
  }

  initCalendarEventListeners() {
    const saveEventBtn = document.getElementById("saveEventBtn");
    const deleteEventBtn = document.getElementById("deleteEventBtn");
    const addEventBtn = document.getElementById("addEventBtn");

    saveEventBtn?.addEventListener("click", this.handleSaveEvent.bind(this));
    deleteEventBtn?.addEventListener(
      "click",
      this.handleDeleteEvent.bind(this)
    );
    addEventBtn?.addEventListener("click", this.handleAddEvent.bind(this));
  }

  openEventModal(eventData) {
    const elements = {
      eventId: document.getElementById("eventId"),
      eventTitle: document.getElementById("eventTitle"),
      eventStart: document.getElementById("eventStart"),
      eventEnd: document.getElementById("eventEnd"),
      eventDescription: document.getElementById("eventDescription"),
      eventModalLabel: document.getElementById("eventModalLabel"),
      saveEventBtn: document.getElementById("saveEventBtn"),
      deleteEventBtn: document.getElementById("deleteEventBtn"),
    };

    // Populate form fields
    elements.eventId.value = eventData.id;
    elements.eventTitle.value = eventData.title;
    elements.eventStart.value = eventData.start
      ? this.formatDateTime(eventData.start)
      : "";
    elements.eventEnd.value = eventData.end
      ? this.formatDateTime(eventData.end)
      : "";
    elements.eventDescription.value = eventData.description;

    // Update modal title and button text
    elements.eventModalLabel.textContent = eventData.isNew
      ? "Add Event"
      : "Edit Event";
    elements.saveEventBtn.textContent = eventData.isNew
      ? "Add Event"
      : "Update Event";

    // Show/hide delete button
    elements.deleteEventBtn.classList.toggle("d-none", eventData.isNew);

    this.eventModal.show();
  }

  formatDateTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().slice(0, 16);
  }

  handleSaveEvent() {
    const eventData = {
      id: document.getElementById("eventId").value,
      title: document.getElementById("eventTitle").value,
      start: document.getElementById("eventStart").value,
      end: document.getElementById("eventEnd").value,
      description: document.getElementById("eventDescription").value,
    };

    if (!eventData.title || !eventData.start || !eventData.end) {
      alert("Please fill in all fields.");
      return;
    }

    if (eventData.id) {
      this.updateCalendarEvent(eventData);
    } else {
      this.addCalendarEvent(eventData);
    }

    this.eventModal.hide();
  }

  updateCalendarEvent(eventData) {
    const event = this.calendar.getEventById(eventData.id);
    if (event) {
      event.setProp("title", eventData.title);
      event.setExtendedProp("description", eventData.description);
      event.setStart(eventData.start);
      event.setEnd(eventData.end);
    }
  }

  addCalendarEvent(eventData) {
    this.calendar.addEvent({
      id: String(Date.now()),
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      extendedProps: { description: eventData.description },
    });
  }

  handleDeleteEvent() {
    const eventId = document.getElementById("eventId").value;
    if (eventId) {
      const event = this.calendar.getEventById(eventId);
      event?.remove();
      this.eventModal.hide();
    }
  }

  handleAddEvent() {
    this.openEventModal({
      id: "",
      title: "",
      start: "",
      end: "",
      description: "",
      isNew: true,
    });
  }

  // Global event listeners
  initEventListeners() {
    // Add any additional global event listeners here
    document.addEventListener("keydown", this.handleGlobalKeydown.bind(this));
  }

  handleGlobalKeydown(e) {
    // Handle global keyboard shortcuts
    if (e.key === "Escape") {
      // Close modals, dropdowns, etc.
      this.elements.modals.forEach((modal) => {
        if (modal.classList.contains("show")) {
          modal.classList.remove("show");
        }
      });
    }
  }

  // Toggle password visibility
  initPasswordToggle() {
    if (this.elements.passwordInput && this.elements.passwordIcon) {
      this.elements.passwordIcon.addEventListener("click", () => {
        const isPassword = this.elements.passwordInput.type === "password";
        this.elements.passwordInput.type = isPassword ? "text" : "password";
        this.elements.passwordIcon.classList.toggle("fa-eye", !isPassword);
        this.elements.passwordIcon.classList.toggle("fa-eye-slash", isPassword);
      });
    }
  }

  // Floating label animation
  initFloatingLabels() {
    if (this.elements.formControls.length) {
      this.elements.formControls.forEach((input) => {
        input.addEventListener("focus", function () {
          this.parentElement.classList.add("focused");
        });
        input.addEventListener("blur", function () {
          if (!this.value) {
            this.parentElement.classList.remove("focused");
          }
        });
      });
    }
  }

  // Smooth login card animation on page load
  initLoginCardAnimation() {
    if (this.elements.loginCard) {
      window.addEventListener("load", () => {
        this.elements.loginCard.style.opacity = "0";
        this.elements.loginCard.style.transform = "translateY(30px)";
        setTimeout(() => {
          this.elements.loginCard.style.transition = "all 0.6s ease";
          this.elements.loginCard.style.opacity = "1";
          this.elements.loginCard.style.transform = "translateY(0)";
        }, 100);
      });
    }
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new AdminDashboard();
});
