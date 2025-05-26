console.log("DORI");

const API_URL = "https://68287be66b7628c529137b06.mockapi.io/Tasks/task";

const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");

todoInput.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    console.log(event);
    addTodos();
  }
});

document.addEventListener("DOMContentLoaded", getTodos);
addButton.addEventListener("click", addTodos);

// GET FUNCTION
async function getTodos() {
  try {
    const response = await axios.get(API_URL);
    // console.log(response.data);
    const ul = document.querySelector(".todo-list");
    ul.innerHTML = "";
    response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    response.data.forEach((item) => {
      // console.log(item.createdAt);
      const date = new Date(item.createdAt);
      const formatDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

      // tạo li
      const li = document.createElement("li");
      // gắn class todo-item
      li.className = "todo-item";
      // gắn thằng con và nội dung từ API cho thằng con
      li.innerHTML = ` <div class="todo-cont">
                        <input type="checkbox">
                        <div>
                            <span>${item.content}</span>
                            <p>Created: ${formatDate}</p> 
                        </div>
                    </div>
                    <div class="todo-act">
                        <button onclick="handleUpdate(${item.id}, '${item.content}')"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="handleDelete(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
                    </div> `;
      // gắn vào ul
      ul.appendChild(li);
    });
  } catch (error) {
    console.log("Failed" + error);
  }
}

// POST FUNCTION
async function addTodos() {
  const inputData = todoInput.value.trim();

  const newTodo = {
    createdAt: new Date().toISOString(),
    content: inputData,
    isCompleted: false,
  };

  try {
    const response = await axios.post(API_URL, newTodo);
    console.log(response);
    todoInput.value = "";
    getTodos();
    showNotification("Your file has been added !");
  } catch (error) {
    console.log("Failed" + error);
  }
}

// PUT FUNCTION
function handleUpdate(id, content) {
  Swal.fire({
    title: "Edit Tour Task",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    inputValue: content,
    showCancelButton: true,
    confirmButtonText: "Save",
    showLoaderOnConfirm: true,
    preConfirm: async (dataInput) => {
      await axios.put(`${API_URL}/${id}`, {
        content: dataInput,
      });
      getTodos();
      showNotification("Your file has been updated !");
    },
  });
}

// DELETE FUNCTION
function handleDelete(id) {
  console.log(id);
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-danger me-3",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/${id}`);
        getTodos();
        swalWithBootstrapButtons.fire({
           title: "Deleted!",
           text: "Your file has been deleted.",
           icon: "success",
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
}

function showNotification(message) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, add it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Succesed",
        text: message,
        icon: "success",
      });
    }
  });
}
