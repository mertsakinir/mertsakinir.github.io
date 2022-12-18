const girisYapForm = document.getElementById('girisFormu');

const girisYap = (girisData) => {
  let user = localStorage.getItem(girisData.email);
  let data = JSON.parse(user);

  if (user == null) {
    alert('Boyle bir kullanici yok!')
  } else if(girisData.email == data.email && girisData.sifre == data.sifre) {
    alert('Giris Basarili')
    document.location.href = '/calculator.html'
  } else {
    alert('Yanlis sifre girdiniz!')
  }
  girisYapForm.reset()
}

girisYapForm.addEventListener('submit', (e) => {
  e.preventDefault()
  girisData = {
    email: girisYapForm.elements['emailGiris'].value,
    sifre: girisYapForm.elements['sifreGiris'].value
  }
  girisYap(girisData);
})