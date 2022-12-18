const kayitOlForm = document.getElementById('kayitFormu');

const kayitOl = (user) => {
  let data = JSON.stringify(user)
  localStorage.setItem(user.email, data);
  alert('Kayit Basarili!')
  window.location.href = '/login.html'
}

kayitOlForm.addEventListener('submit', (e) => {
  e.preventDefault()
  user = {
    isim: kayitOlForm.elements['isimKayit'].value,
    email: kayitOlForm.elements['emailKayit'].value,
    sifre: kayitOlForm.elements['sifreKayit'].value
  }
  kayitOl(user)
})