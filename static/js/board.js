/* 
Name                 : VidManage – Bootstrap CRM & Project Management Admin Template
Author               : TemplateRise
Url                  : https://www.templaterise.com/template/VidManage-bootstrap-crm-project-management-admin-template
*/

let draggedElement = null;
let createIssueModal;
let issueCounter = 113;

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  createIssueModal = new bootstrap.Modal(
    document.getElementById("createIssueModal")
  );
  initializeDragAndDrop();
  updateColumnCounts();
  initializeSearch();
});

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const issueCards = document.querySelectorAll(".issue-card");

    issueCards.forEach((card) => {
      const title = card
        .querySelector(".issue-title")
        .textContent.toLowerCase();
      const issueKey = card
        .querySelector(".issue-key")
        .textContent.toLowerCase();
      const labels = Array.from(card.querySelectorAll(".issue-label")).map(
        (label) => label.textContent.toLowerCase()
      );

      const matches =
        title.includes(searchTerm) ||
        issueKey.includes(searchTerm) ||
        labels.some((label) => label.includes(searchTerm));

      card.style.display = matches ? "block" : "none";
    });
  });
}

// Drag and Drop functionality
function initializeDragAndDrop() {
  const cards = document.querySelectorAll('.issue-card[draggable="true"]');
  const dropZones = document.querySelectorAll(".drop-zone");

  cards.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
  });

  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
    zone.addEventListener("dragenter", handleDragEnter);
    zone.addEventListener("dragleave", handleDragLeave);
  });
}

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd(e) {
  this.classList.remove("dragging");
  draggedElement = null;
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter(e) {
  this.classList.add("drag-over");
}

function handleDragLeave(e) {
  if (!this.contains(e.relatedTarget)) {
    this.classList.remove("drag-over");
  }
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  this.classList.remove("drag-over");

  if (draggedElement !== null) {
    const addButton = this.querySelector(".add-issue-btn");
    this.insertBefore(draggedElement, addButton);
    updateColumnCounts();
  }

  return false;
}

function updateColumnCounts() {
  const columns = ["backlog", "todo", "progress", "review", "done"];
  columns.forEach((column) => {
    const count = document.querySelectorAll(
      `[data-column="${column}"] .issue-card[draggable="true"]`
    ).length;
    const countElement = document.getElementById(`${column}-count`);
    if (countElement) {
      countElement.textContent = count;
    }
  });
}

function showCreateIssueModal(column = "backlog") {
  document.getElementById("targetColumn").value = column;
  document.getElementById("createIssueForm").reset();
  createIssueModal.show();
}

function createNewIssue() {
  const issueType = document.getElementById("issueType").value;
  const priority = document.getElementById("issuePriority").value;
  const title = document.getElementById("issueTitle").value.trim();
  const description = document.getElementById("issueDescription").value.trim();
  const assignee = document.getElementById("issueAssignee").value.trim();
  const storyPoints = document.getElementById("storyPoints").value;
  const labels = document.getElementById("issueLabels").value.trim();
  const column = document.getElementById("targetColumn").value || "backlog";

  if (!issueType || !priority || !title || !assignee) {
    alert("Please fill in all required fields");
    return;
  }

  // Generate issue key
  const issueKey = `ECOM-${issueCounter++}`;

  // Create assignee initials
  const initials = assignee
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  // Get issue type icon
  const typeIcons = {
    story: "fas fa-bookmark",
    task: "fas fa-check-square",
    bug: "fas fa-bug",
    epic: "fas fa-bolt",
  };

  // Get priority icon
  const priorityIcons = {
    lowest: "fas fa-angle-double-down",
    low: "fas fa-arrow-down",
    medium: "fas fa-minus",
    high: "fas fa-arrow-up",
    highest: "fas fa-angle-double-up",
  };

  // Create labels HTML
  let labelsHtml = "";
  if (labels) {
    const labelArray = labels.split(",").map((label) => label.trim());
    labelsHtml = labelArray
      .map((label) => {
        const labelClass =
          label.toLowerCase() === "frontend"
            ? "frontend"
            : label.toLowerCase() === "backend"
            ? "backend"
            : label.toLowerCase() === "urgent"
            ? "urgent"
            : "";
        return `<span class="issue-label ${labelClass}">${label}</span>`;
      })
      .join("");
  }

  const newIssue = document.createElement("div");
  newIssue.className = `issue-card issue-type-${issueType}`;
  newIssue.draggable = true;
  newIssue.setAttribute("data-issue-id", issueKey);
  newIssue.innerHTML = `
                <div class="issue-header">
                    <div class="issue-type">
                        <div class="issue-type-icon">
                            <i class="${typeIcons[issueType]}"></i>
                        </div>
                        <span class="issue-key">${issueKey}</span>
                    </div>
                    <div class="priority-icon priority-${priority}">
                        <i class="${priorityIcons[priority]}"></i>
                    </div>
                </div>
                <div class="issue-title">${title}</div>
                ${
                  labelsHtml
                    ? `<div class="issue-labels">${labelsHtml}</div>`
                    : ""
                }
                <div class="issue-footer">
                    <div class="issue-assignee">
                        <div class="assignee-avatar">${initials}</div>
                    </div>
                    ${
                      storyPoints
                        ? `<div class="story-points">${storyPoints}</div>`
                        : ""
                    }
                </div>
            `;

  const columnBody = document.querySelector(`[data-column="${column}"]`);
  const addButton = columnBody.querySelector(".add-issue-btn");
  columnBody.insertBefore(newIssue, addButton);

  // Add drag and drop functionality to the new issue
  newIssue.addEventListener("dragstart", handleDragStart);
  newIssue.addEventListener("dragend", handleDragEnd);

  updateColumnCounts();
  createIssueModal.hide();
}
