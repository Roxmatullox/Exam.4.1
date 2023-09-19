let teachersRow = document.querySelector(".teachers-row")
let searchInput = document.querySelector(".search-input")
let totalTeachers = document.querySelector(".total-teachers")
let pagination = document.querySelector(".pagination-div")
let modalOpenBtn = document.querySelector(".modal-open-btn")
let modalCloseBtn = document.querySelector(".modal-close")
let modal = document.querySelector(".modal")
let modalForm = document.querySelector("form")
let loading = document.getElementById("loading");
let sortbyFirstName = document.querySelector("#sort-by-firstname")
let isMarriedFiletr = document.querySelector("#isMarriedFilter")

let search = ""
let active = 1
let selected = null
let sort = "normal"
let isYes = false

function getTeacher(teacher) {
  return`
  <div class="card">
    <img src="${teacher.avatar}" alt="Avatar" style="width:100%">
    <div class="card-container">
      <h4><b>${teacher.id}. ${teacher.firstName} ${teacher.lastName}</b></h4>
      <p>${teacher.email}</p>
      <div>
        <a>isMarried: ${teacher.isMarried}</a>
        <a>Phone number: ${teacher.phoneNumber}</a>
      </div>
      <a href="students.html?teacherId=${teacher.id}">Students ></a>
      <div class="delete-btn-div"><button delete="${teacher.id}" class="delete-btn">Delete</button> <button edit="${teacher.id}" class="delete-btn">Edit</button></div>
    </div>
  </div>
  `
}



async function allTeachers() {
  try{
    
    let params = { 
      "firstName" : search,
    }


    let resL = await request.get("teachers" , {params})

    params = { 
      "firstName" : search,
      "isMarried": isYes ,
      p:active,
      l:12, 
    }

    if (sort == "asc") {
      params = { 
        p:active,
        l:12, 
        "firstName" : search,
        sortby:"firstName",
        "isMarried": isYes ,
      }
    }

    if (sort == "desc") {
      params = { 
        p:active,
        l:12, 
        "firstName" : search,
        sortby:"lastName",
        order:"desc",
        "isMarried": isYes ,
      }
    }

    console.log(params);


    let res = await request.get("teachers" , {params})

    teachersRow.innerHTML = ""

    let teachers = await res.data
    let teachersL = await resL.data

    totalTeachers.innerHTML = `Teachers: ${teachersL.length}`
    teachers.map((el=>{
      teachersRow.innerHTML += getTeacher(el)
    }))


    let pages = Math.ceil(teachersL.length/12)

    pagination.innerHTML = `<button page="-" href="#" ${active == 1 ? "disabled":""} >&laquo;</button>`
    
    for (let i = 1; i <= pages; i++) {
      pagination.innerHTML += `<button page="${i}" href="#" class="${active == i ? "active" : ""}">${i}</button>`
    }
    
    pagination.innerHTML += `<button page="+" href="#" ${active == pages ? "disabled":""} >&raquo;</button>`

    if (pages == 1) {
      pagination.innerHTML = ""
    }
    
  } catch(err){
    console.log(err.name);
  }
}


allTeachers()

searchInput.addEventListener("keyup", function(){
  search = this.value
  active = 1
  allTeachers()
})


pagination.addEventListener("click" , (e)=>{
  let page = e.target.getAttribute("page")

  if (page == "-") {
    active--
  } else if (page == "+") {
    active++
  } else {
    active = page
  }

  allTeachers()
})






modalOpenBtn.addEventListener("click" , ()=>{
  modal.classList.add("modal-open")

  selected = null

  this.firstname1.value = "" 
  this.lastname.value = "" 
  this.image.value = "" 
  this.groups.value = "" 
  this.checkbox.checked = false 
  this.number.value = ""
  this.email.value= ""
})

modalCloseBtn.addEventListener("click" , ()=>{
  modal.classList.remove("modal-open")
})






modalForm.addEventListener("submit" ,async function(e) {
  e.preventDefault()
  if (this.checkValidity()) {
    let teacher = {
      firstName : this.firstname1.value , 
      lastName : this.lastname.value , 
      avatar : this.image.value , 
      groups : this.groups.value.split(",") , 
      isMarried : this.checkbox.checked , 
      phoneNumber : this.number.value , 
      email : this.email.value,
    }
    
    if (selected == null) {
      await request.post("teachers" , teacher)
    } else {
      await request.put(`/teachers/${selected}` , teacher)
    }

    allTeachers()
    modal.classList.remove("modal-open")
  } else{
    console.log("a");
  }

})


teachersRow.addEventListener("click" , async (e)=>{
  try {
    let deleteCard = e.target.getAttribute("delete")
    let editCard = e.target.getAttribute("edit")


    if (deleteCard) {
      active--
      let deletedConfirm = confirm(`Siz rostdan xam ${deleteCard} - id "teacher" ni ochirmoxchimisiz `)
      if (deletedConfirm) {
        await request.delete(`/teachers/${deleteCard}`)
        allTeachers()
      }
    }

    if (editCard) {
      modal.classList.add("modal-open")
      selected = editCard
      let { data } = await request.get(`/teachers/${editCard}`)

      modalForm.firstname1.value = data.firstName 
      modalForm.lastname.value = data.lastName
      modalForm.image.value = data.avatar
      modalForm.groups.value = data.groups
      modalForm.checkbox.checked = data.isMarried
      modalForm.number.value = data.phoneNumber
      modalForm.email.value= data.email
    }
  } catch (err) {
    console.log(err);
  }
})


let loadingDuration = 1000;

setTimeout(() => {
  loading.classList.add('loading-none')
}, loadingDuration);


sortbyFirstName.addEventListener("click" , function(e){
  sort = e.target.value.toString()
  allTeachers()
})


