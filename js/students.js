let studentsRow = document.querySelector(".students-row")
let searchInput = document.querySelector(".search-input")
let totalStudents = document.querySelector(".total-students")
let modalOpenBtn = document.querySelector(".modal-open-btn")
let modalCloseBtn = document.querySelector(".modal-close")
let modal = document.querySelector(".modal")
let modalForm = document.querySelector("form")
let loading = document.getElementById("loading")
let sortbyBirthday = document.querySelector("#sort-by-birthday")


let search = ""
let selected = null
let sort = "normal"

let query = new URLSearchParams(location.search)
let teacherId = query.get("teacherId")

function getStudent(student) {
  console.log(student);
  return`
  <div class="card">
    <img src="${student.avatar}" alt="Avatar" style="width:100%">
    <div class="card-container">
      <h4><b>${student.id}. ${student.firstName} ${student.lastName}</b></h4>
      <p>Emasil : ${student.email}</p>
      <p>IsWork : ${student.isWork}</p>
      <p>Birthday : ${student.birthday}</p>
      <div class="delete-btn-div"><button delete="${student.id}" class="delete-btn">Delete</button> <button edit="${student.id}" class="delete-btn">Edit</button></div>
    </div>
  </div>
  `
}

async function getStudents() {
  try{
    let params = {
      firstName : search ,
    }

    console.log(sort);

    if (sort == "asc") {
      params = {
        firstName : search ,
        sortby : "birthday",
      }
    }

    if (sort == "desc") {
      params = {
        firstName : search ,
        sortby : "birthday",
        order:"desc",
      }
    }

    

    let studentObj = await request.get(`teachers/${teacherId}/students` , {params})
    let students = await studentObj.data
    totalStudents.innerHTML = `Students: ${students.length}`
    studentsRow.innerHTML = ""
    students.map((el)=>{
      studentsRow.innerHTML += getStudent(el)
    })
  } catch(err){
    console.log(err);
  }
}

getStudents()


searchInput.addEventListener("keyup", function(){
  search = this.value
  console.log(search);
  getStudents()
})



modalOpenBtn.addEventListener("click" , ()=>{
  modal.classList.add("modal-open")

  selected = null


  this.firstname1.value = "" 
  this.lastname.value = "" 
  this.image.value = "" 
  this.field.value = "" 
  this.checkbox.checked = false 
  this.number.value = ""
  this.email.value= ""
})

modalCloseBtn.addEventListener("click" , ()=>{
  modal.classList.remove("modal-open")
})



modalForm.addEventListener("submit" , async function (e) {
  e.preventDefault()
  
  if (this.checkValidity()) {
    let student1 = {
      firstName : this.firstname1.value , 
      lastName : this.lastname.value , 
      avatar : this.image.value , 
      phoneNumber : this.number.value , 
      email : this.email.value,
      field : this.field.value , 
      isWork : this.checkbox.checked,
    }

    if (selected == null) {
      await request.post(`/teachers/${teacherId}/students`,student1)
      modal.classList.remove("modal-open")
      getStudents()
    } else{
      await request.put(`/teachers/${teacherId}/students/${selected}`,student1)
      modal.classList.remove("modal-open")
      getStudents()
    }
    
  }
})



studentsRow.addEventListener("click" , async function(e) {
  let delet = e.target.getAttribute("delete")
  let editCard = e.target.getAttribute("edit")

  if (delet) {
    let deletConfirm = confirm(`siz ${delet} sonli "studentni" rostdanham ochrmoqchimisiz?`)
    if (deletConfirm) {
      await request.delete(`/teachers/${teacherId}/students/${delet}`)
      getStudents()
    }
  }

  if (editCard) {
    modal.classList.add("modal-open")
    selected = editCard
    let { data } = await request.get(`/teachers/${teacherId}/students/${editCard}`)

      modalForm.firstname1.value = data.firstName 
      modalForm.lastname.value = data.lastName
      modalForm.image.value = data.avatar
      modalForm.field.value = data.field
      modalForm.checkbox.checked = data.isWork
      modalForm.number.value = data.phoneNumber
      modalForm.email.value= data.email
  }
})


let loadingDuration = 1000;

setTimeout(() => {
  loading.classList.add('loading-none')
}, loadingDuration);

sortbyBirthday.addEventListener("click" , function(e){
  sort = e.target.value.toString()
  getStudents()
})