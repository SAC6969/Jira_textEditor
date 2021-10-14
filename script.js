var uid = new ShortUniqueId();

let defaultColor = "black";
let colors = ["pink", "blue", "green", "black"];
let cFilter = "";
let deleteMode = false;

let input = document.querySelector(".input_container_text");
let mainContainer = document.querySelector(".main-container");
let colorContainer = document.querySelector(".color-group_conatiner");
let lockContainer = document.querySelector(".lock-container");
let unlockContainer = document.querySelector(".unlock-container");
let addContainer = document.querySelector(".plus-container");
let deleteContainer = document.querySelector(".multiply-container");
let colorChooser = document.querySelector(".color_container");
let allColorElement = document.querySelectorAll(".color_picker");
let modal = document.querySelector(".modal");

// *********** Event Listener ***************
//input
input.addEventListener("keydown", function(e) {
    if (e.code == "Enter" && input.value) {
        let id = uid();
        modal.style.display = "none";
        createTask(id, input.value,true);
        input.value = "";
    }
})

//filter
colorContainer.addEventListener("click", function(e) {
    if (e.currentTarget != e.target) {
        let filterColor = e.target.classList[1];
        // console.log(filterCard)
        filterCardColor(filterColor)
    }
})

//modal color chooser
colorChooser.addEventListener("click", function(e) {
    if (e.currentTarget != e.target) {
        let filterColor = e.target.classList[1];
        defaultColor = filterColor;
        for(let i=0; i<allColorElement.length; i++){
            allColorElement[i].classList.remove("selected");
        }
        e.target.classList.add("selected");
    }
})

//lock -> contentEditable for edit text
lockContainer.addEventListener("click",function(e){
    let noOfElement = document.querySelectorAll(".task_main-container>div");
    for(let i=0; i<noOfElement.length; i++){
        noOfElement[i].contentEditable = false;
    }
    lockContainer.classList.add("active");
    unlockContainer.classList.remove("active");
})

//Unlock
unlockContainer.addEventListener("click",function(e){
    let noOfElement = document.querySelectorAll(".task_main-container>div");
    for(let i=0; i<noOfElement.length; i++){
        noOfElement[i].contentEditable = true;
    }
    unlockContainer.classList.add("active");
    lockContainer.classList.remove("active");
})

//delete
deleteContainer.addEventListener("click",function(e){
    deleteMode = !deleteMode;
    if(deleteMode){
        deleteContainer.classList.add("active");
    }else{
        deleteContainer.classList.remove("active");
    }
})

// plus container
addContainer.addEventListener("click",function(e){
    modal.style.display = "flex";
})

// *********** All functions ***************

//create task
function createTask(id, value,flag,color) {
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    mainContainer.appendChild(taskContainer);
    taskContainer.innerHTML = `<div class="task_header ${color?color:defaultColor}"></div>
    <div class="task_main-container">
        <h3 class="task_id">#${id}</h3>
        <div class="text" contentEditable="true">${value}</div>
    </div>`;

    //addEventListner for header color changer
    let taskHeader = taskContainer.querySelector(".task_header");
    let mainTask = taskContainer.querySelector(".task_main-container>div")
    let nextColor;
    taskHeader.addEventListener("click", function(e) {
        let cColor = taskHeader.classList[1];
        // console.log("color", cColor);
        let idx = colors.indexOf(cColor);
        let nextIdx = (idx + 1) % 4;
        nextColor = colors[nextIdx];
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(nextColor);
        // get id for update color in Local Storage
        let idwalaelement = taskHeader.parentNode.children[1].children[0];
        let id = idwalaelement.textContent;
        id = id.split("#")[1];
        let taskString = localStorage.getItem("tasks");
        let taskArr = JSON.parse(taskString);
        for(let i=0; i<taskArr.length; i++){
            if(taskArr[i].id == id){
                taskArr[i].color = nextColor;
                break;
            }
        }
        localStorage.setItem("tasks",JSON.stringify(taskArr));
    })

    // deleting task conatiner
    taskContainer.addEventListener("click", function (e) {
        if (deleteMode == true) {
            // delete ->ui , storage
            // local storage -> remove;
            taskContainer.remove();
            let taskString = localStorage.getItem("tasks");
            let taskArr = JSON.parse(taskString);
            let newtaskArr = [];
            for(let i=0; i<taskArr.length; i++){
                if(taskArr[i].id != id){
                    newtaskArr.push(taskArr[i]);
                }
            }
            localStorage.setItem("tasks",JSON.stringify(newtaskArr));
        }
    })

    //changing text in localStorage
    mainTask.addEventListener("blur",function(e){
        let content = mainTask.textContent;
        let taskString = localStorage.getItem("tasks");
        let taskArr = JSON.parse(taskString);
        for(let i=0; i<taskArr.length; i++){
            if(taskArr[i].id == id){
                taskArr[i].task = content;
                break;
            }
        }
        localStorage.setItem("tasks",JSON.stringify(taskArr));
    })

    //add local Storage
    if(flag == true){
        let taskString = localStorage.getItem("tasks");
        let taskArr = JSON.parse(taskString) || [];
        let taskObj = {
            id:id,
            task:value,
            color:defaultColor
        }
        taskArr.push(taskObj);
        localStorage.setItem("tasks",JSON.stringify(taskArr));
    }

    defaultColor = "black";
}

//filtering using color
function filterCardColor(filterColor) {
    let allTaskCard = document.querySelectorAll(".task_container");
    if (cFilter != filterColor) {
        for (let i = 0; i < allTaskCard.length; i++) {
            let taskHeaderColor = allTaskCard[i].querySelector(".task_header");
            if (taskHeaderColor.classList[1] == filterColor) {
                allTaskCard[i].style.display = "block";
            } else {
                allTaskCard[i].style.display = "none";
            }
        }
        cFilter = filterColor;
    } else {
        cFilter = "";
        for (let i = 0; i < allTaskCard.length; i++) {
            allTaskCard[i].style.display = "block";
        }
    }
}

(function init(){
    let AllCard = JSON.parse(localStorage.getItem("tasks"));
    for(let i=0; i<AllCard.length; i++){
        let {id,task,color} = AllCard[i];
        createTask(id,task,false,color);
    }
    modal.style.display = "none";
})();









// localStorage
//********* setItem() *********
// localStorage.setItem("todo","Hello");
// localStorage.setItem("todo tomorrow","Hello a");
// localStorage.setItem("todo y","Hello a");

//********* getItem() *********
// localStorage.getItem("todo");

//********* localStorage.length *********

//********* removeItem() *********
// localStorage.removeItem("todo");

//********* clear() *********
// localStorage.clear();

