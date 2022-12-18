let form = document.getElementById('inputForm');

let i1Output = document.getElementById('i1Output')
let i2Output = document.getElementById('i2Output')
let e1Output = document.getElementById('e1Output')
let e2Output = document.getElementById('e2Output')
let poOutput = document.getElementById('poOutput')
let piOutput = document.getElementById('piOutput')
let z1Output = document.getElementById('z1Output')
let z2Output = document.getElementById('z2Output')
let v1Output = document.getElementById('v1Output')
let effiencyOutput = document.getElementById('effiencyOutput')


const outputs = {
  i1: {},
  i2: {},
  e1: {},
  e2: {},
  po: {},
  pin: {},
  z1: {},
  z2: {},
  v1: {},
  effiency: {}
}

// let inputs = {
//   kva: 23000,
//   load: 75,
//   powerFactorLoad: 0.866,
//   v1: 2300,
//   v2: 230,
//   frequency: 60,
//   r1: 4,
//   r2: 0.04,
//   rc: 20000,
//   l1: 12,
//   l2: 0.12,
//   xm: 15000,
// }

// Radyani Dereceye cevirme
const radToDeg = (rad) => {
  return rad * 180 / Math.PI;
}

// Dereceyi Radyana cevirme
const degToRad = (deg) => {
  return deg * Math.PI / 180;
}

// Rectengular Forma cevirme
const toRect = (reel, radyan) => {
  const reelKisim = reel * Math.cos(radyan)
  const sanalKisim = reel * Math.sin(radyan) 
  return math.complex(reelKisim, sanalKisim)
}



inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let inputs = {
    kva: +form.elements['kva'].value,
    load: +form.elements['load'].value,
    powerFactorLoad: +form.elements['powerFactorLoad'].value,
    v1: +form.elements['v1'].value,
    v2: +form.elements['v2'].value,
    frequency: +form.elements['frequency'].value,
    r1: +form.elements['r1'].value,
    r2: +form.elements['r2'].value,
    rc: +form.elements['rc'].value,
    l1: +form.elements['l1'].value,
    l2: +form.elements['l2'].value,
    xm: +form.elements['xm'].value
  }



  outputs.i2 = i2Hesapla(inputs.kva, inputs.v2, inputs.load, inputs.powerFactorLoad);
  outputs.z2 = z2Hesapla(inputs.r2, inputs.l2);
  outputs.e2 = e2Hesapla(inputs.v2)
  const transformationRatio = inputs.v1 / inputs.v2
  outputs.e1 = e1Hesapla(transformationRatio)
  const ip = ipHesapla(transformationRatio)
  outputs.po = powerOutputHesapla(inputs.v2)
  const ic = icHesapla(inputs.rc)
  const im = imHesapla(inputs.xm)
  const tp = tpHesapla(ic, im)
  outputs.i1 = i1Hesapla(tp, ip)
  outputs.z1 = z1Hesapla(inputs.r1, inputs.l1)
  outputs.v1 = v1Hesapla(outputs.z1, outputs.i1, outputs.e1)
  outputs.pin = pinHesapla(outputs.v1, outputs.i1)
  outputs.effiency = effiencyHesapla(outputs.po, outputs.pin)

  console.log(outputs)
  printOutputs()
})


// I2 Degerlerini Hesaplama
const i2Hesapla = (kva, v2, load, powerFactorLoad) => {
  const i2_reel = (kva / v2) * (load / 100)
  const i2_aci_radyan = Math.acos(powerFactorLoad)
  const i2_aci_derece = radToDeg(i2_aci_radyan)
  const i2_rect = toRect(i2_reel, i2_aci_radyan)
  const i2_rect_text = i2_rect.toString()
  
  return {
    i2_reel,
    i2_aci_radyan,
    i2_aci_derece,
    i2_rect,
    i2_rect_text
  }
}

// Z2 Degerini Hesaplama
const z2Hesapla = (r2, l2) => {
  const z2_complex = math.complex(r2, l2);
  const z2_complex_text = z2_complex.toString()
  return {
    z2_complex,
    z2_complex_text
  }
}

// E2 Degerlerini Hesaplama
const e2Hesapla = (v2) => {
  const e2_rect = math.add(math.multiply(outputs.i2.i2_rect, outputs.z2.z2_complex), math.complex(v2))
  const e2_polar = e2_rect.toPolar()
  const thetaDegree = radToDeg(e2_polar.phi)
  const e2_text = e2_rect.toString()

  return {
    e2_rect,
    e2_text,
    e2_polar,
    thetaDegree
  }
}

// E1 Degerlerini Hesaplama
const e1Hesapla = (transformationRatio) => {
  const e1_polar_reel = outputs.e2.e2_polar.r * transformationRatio
  const e1_polar_aci_derece = outputs.e2.thetaDegree
  const e1_polar_aci_radyan = degToRad(e1_polar_aci_derece)
  const e1_rect = toRect(e1_polar_reel, e1_polar_aci_radyan)
  const e1_rect_text = e1_rect.toString()

  return {
    e1_polar_reel,
    e1_polar_aci_derece,
    e1_polar_aci_radyan,
    e1_rect,
    e1_rect_text
  }
}

// Ip Degerlerini Hesaplama
const ipHesapla = (transformationRatio) => {
  const ip_polar_reel = outputs.i2.i2_reel / transformationRatio
  const ip_aci_derece = outputs.i2.i2_aci_derece
  const ip_aci_radyan = degToRad(ip_aci_derece)
  const ip_rect = toRect(ip_polar_reel, ip_aci_radyan)
  const ip_rect_text = ip_rect.toString()

  return {
    ip_polar_reel,
    ip_aci_derece,
    ip_aci_radyan,
    ip_rect,
    ip_rect_text
  }
}

// Power Output Hesaplama
const powerOutputHesapla = (v2) => {
  const powerOutput_polar_reel = v2 * outputs.i2.i2_reel
  const powerOutput_polar_aci_derece = outputs.i2.i2_aci_derece * (-1)
  const powerOutput_polar_aci_radyan = degToRad(powerOutput_polar_aci_derece)
  const powerOutput_rect = toRect(powerOutput_polar_reel, powerOutput_polar_aci_radyan)
  const powerOutput_rect_text = powerOutput_rect.toString()

  return {
    powerOutput_polar_reel,
    powerOutput_polar_aci_derece,
    powerOutput_polar_aci_radyan,
    powerOutput_rect,
    powerOutput_rect_text
  }
}

// IC Hesaplama
const icHesapla = (rc) => {
  const ic_polar_reel = outputs.e1.e1_polar_reel / rc
  const ic_polar_aci_derece = outputs.e1.e1_polar_aci_derece
  const ic_polar_aci_radyan = outputs.e1.e1_polar_aci_radyan
  const ic_rect = toRect(ic_polar_reel, ic_polar_aci_radyan)
  const ic_rect_text = ic_rect.toString()

  return {
    ic_polar_reel,
    ic_polar_aci_derece,
    ic_polar_aci_radyan,
    ic_rect,
    ic_rect_text
  }
}

// Im Hesaplama
const imHesapla = (xm) => {
  const im_polar_reel = outputs.e1.e1_polar_reel / xm
  const im_polar_aci_derece = (outputs.e2.thetaDegree - 90)
  const im_polar_aci_radyan = degToRad(im_polar_aci_derece)
  const im_rect = toRect(im_polar_reel, im_polar_aci_radyan)
  const im_rect_text = im_rect.toString()
  
  return {
    im_polar_reel,
    im_polar_aci_derece,
    im_polar_aci_radyan,
    im_rect,
    im_rect_text
  }
}

// Tp Degerlerini Hesaplama
const tpHesapla = (ic, im) => {
  const tp_rect = math.add(ic.ic_rect, im.im_rect)
  const tp_rect_text = tp_rect.toString()
  const tp_polar = tp_rect.toPolar()
  const tp_polar_reel = tp_polar.r
  const tp_polar_aci_radyan = tp_polar.phi
  const tp_polar_aci_derece = radToDeg(tp_polar_aci_radyan)
  
  return {
    tp_rect,
    tp_rect_text,
    tp_polar,
    tp_polar_reel,
    tp_polar_aci_radyan,
    tp_polar_aci_derece
  }
}

// I1 Degerlerini Hesaplama
const i1Hesapla = (tp, ip) => {
  const i1_rect = math.add(tp.tp_rect, ip.ip_rect)
  const i1_rect_text = i1_rect.toString()
  const i1_polar = i1_rect.toPolar()
  const i1_polar_aci_radyan = i1_polar.phi
  const i1_polar_aci_derece = radToDeg(i1_polar_aci_radyan)

  return {
    i1_rect,
    i1_rect_text,
    i1_polar,
    i1_polar_aci_radyan,
    i1_polar_aci_derece
  }
}

// Z1 Hesaplama
const z1Hesapla = (r1, l1) => {
  const z1_rect = math.complex(r1, l1)
  const z1_rect_text = z1_rect.toString()

  return {
    z1_rect,
    z1_rect_text
  }
}

// V1 Hesaplama
const v1Hesapla = (z1, i1, e1) => {
  const v1_rect = math.add(math.multiply(z1.z1_rect, i1.i1_rect), e1.e1_rect)
  const v1_rect_text = v1_rect.toString()
  const v1_polar = v1_rect.toPolar()
  const v1_polar_aci_radyan = v1_polar.phi
  const v1_polar_aci_derece = radToDeg(v1_polar_aci_radyan)

  return {
    v1_rect,
    v1_rect_text,
    v1_polar,
    v1_polar_aci_radyan,
    v1_polar_aci_derece
  }
}

// Pin Hesaplama
const pinHesapla = (v1, i1) => {
  const pin_polar_reel = v1.v1_polar.r * i1.i1_polar.r
  const pin_polar_aci_radyan = v1.v1_polar.phi - i1.i1_polar.phi
  const pin_rect = toRect(pin_polar_reel, pin_polar_aci_radyan)
  const pin_rect_text = pin_rect.toString()

  return {
    pin_polar_reel,
    pin_polar_aci_radyan,
    pin_rect,
    pin_rect_text
  }
}


// Efficieny Hesaplama
const effiencyHesapla = (po, pin) => {
  return (po.powerOutput_rect.re / pin.pin_rect.re) * 100
}


const printOutputs = () => {
  i1Output.innerHTML = `<p class="mt-2">${outputs.i1.i1_polar.r.toFixed(2)}, ${outputs.i1.i1_polar_aci_derece.toFixed(2)} Amper</p>`
  i2Output.innerHTML = `<p class="mt-2">${outputs.i2.i2_reel.toFixed(2)}, ${outputs.i2.i2_aci_derece.toFixed(2)} Amper</p>`
  e1Output.innerHTML = `<p class="mt-2">${outputs.e1.e1_polar_reel.toFixed(2)}, ${outputs.e1.e1_polar_aci_derece.toFixed(2)} Volt</p>`
  e2Output.innerHTML = `<p class="mt-2">${outputs.e2.e2_polar.r.toFixed(2)}, ${outputs.e2.thetaDegree.toFixed(2)} Volt</p>`
  poOutput.innerHTML = `<p class="mt-2">${outputs.po.powerOutput_rect.re.toFixed(2)} Watt</p>`
  piOutput.innerHTML = `<p class="mt-2">${outputs.pin.pin_rect.re.toFixed(2)} Watt</p>`
  z1Output.innerHTML = `<p class="mt-2">${outputs.z1.z1_rect_text} Ohm</p>`
  z2Output.innerHTML = `<p class="mt-2">${outputs.z2.z2_complex_text} Ohm</p>`
  v1Output.innerHTML = `<p class="mt-2">${outputs.v1.v1_polar.r.toFixed(2)}, ${outputs.v1.v1_polar_aci_derece.toFixed(2)} Volt</p>`
  effiencyOutput.innerHTML = `<p class="mt-2">%${outputs.effiency.toFixed(2)}</p>`
  alert('Verileriniz Hesaplanmistir')
}