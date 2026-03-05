let tasks = []; // mảng lưu công việc
let editingId = null; // id đang sửa (nếu có)

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");

// Render toàn bộ danh sách
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">
          Chưa có công việc nào. Hãy thêm công việc mới!
        </div>
      </div>
    `;
  } else {
    tasks.forEach((task) => {
      const item = document.createElement("div");
      item.className = "task-item";
      item.dataset.id = task.id;

      if (task.completed) {
        item.classList.add("completed");
      }

      if (editingId === task.id) {
        // Chế độ sửa
        item.innerHTML = `
          <input type="text" class="edit-input" value="${task.text}">
          <div class="task-actions">
            <button class="btn-save">Lưu</button>
            <button class="btn-cancel">Hủy</button>
          </div>
        `;
      } else {
        // Chế độ bình thường
        item.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
          <span class="task-text">${task.text}</span>
          <div class="task-actions">
            <button class="btn-edit">✏️ Sửa</button>
            <button class="btn-delete">🗑️ Xóa</button>
          </div>
        `;
      }

      taskList.appendChild(item);
    });
  }

  updateFooter();

  // Focus lại input sau khi render
  if (editingId === null) {
    taskInput.focus();
  }
}

// Cập nhật footer + badge hoàn thành tất cả
function updateFooter() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  totalCount.textContent = total;
  completedCount.textContent = completed;

  // Xóa badge cũ nếu có
  const oldBadge = taskList.querySelector(".all-done-badge");
  if (oldBadge) oldBadge.remove();

  if (total > 0 && completed === total) {
    const badge = document.createElement("div");
    badge.className = "all-done-badge";
    badge.innerHTML = "✅ Hoàn thành tất cả!";
    taskList.prepend(badge); // hoặc append vào footer nếu muốn
  }
}

// Thêm task mới
function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Vui lòng nhập nội dung công việc!");
    taskInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  renderTasks();
}

// Thêm bằng nút
addBtn.addEventListener("click", addTask);

// Thêm bằng Enter
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (editingId !== null) {
      // Nếu đang edit → Enter = Lưu
      const editInput = taskList.querySelector(".edit-input");
      if (editInput) saveEdit(editInput.value);
    } else {
      // Bình thường → Enter = Thêm mới
      addTask();
    }
  }
});

// Xử lý tất cả click/change trong danh sách
taskList.addEventListener("click", (e) => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  const id = Number(item.dataset.id);

  if (e.target.classList.contains("task-checkbox")) {
    // Toggle hoàn thành
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      renderTasks();
    }
  } else if (e.target.classList.contains("btn-edit")) {
    editingId = id;
    renderTasks();
    // Focus input edit ngay lập tức
    setTimeout(() => {
      const editInput = item.querySelector(".edit-input");
      if (editInput) {
        editInput.focus();
        editInput.select();
      }
    }, 10);
  } else if (e.target.classList.contains("btn-delete")) {
    if (confirm("Xác nhận xóa công việc này?")) {
      tasks = tasks.filter((t) => t.id !== id);
      if (editingId === id) editingId = null;
      renderTasks();
    }
  } else if (e.target.classList.contains("btn-save")) {
    const editInput = item.querySelector(".edit-input");
    if (editInput) saveEdit(editInput.value);
  } else if (e.target.classList.contains("btn-cancel")) {
    editingId = null;
    renderTasks();
  }
});

// Lưu khi sửa
function saveEdit(newText) {
  newText = newText.trim();
  if (newText === "") {
    alert("Không được để trống!");
    return;
  }

  const task = tasks.find((t) => t.id === editingId);
  if (task) {
    task.text = newText;
  }
  editingId = null;
  renderTasks();
}

// Esc để hủy edit
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editingId !== null) {
    editingId = null;
    renderTasks();
  }
});

renderTasks(); // lần đầu
taskInput.focus();
