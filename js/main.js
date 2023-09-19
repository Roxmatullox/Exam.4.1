let form = document.querySelector("form")
let loading = document.getElementById("loading");


form.password.value = "cityslicka"
form.username.value = "eve.holt@reqres.in"


form.addEventListener("submit" , async function(e) {
  e.preventDefault()
  

  try {
    let user = {
    username:this.username.value,
    password:this.password.value
    }
    let { data } = await axios.post(`https://reqres.in/api/login` , user)
    if (data) {
      location ="./teachers.html"
    }
  } catch (err) {
    console.log(err);
  }
  
} )


let loadingDuration = 1000;

setTimeout(() => {
  loading.classList.add('loading-none')
}, loadingDuration);
