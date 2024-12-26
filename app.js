
let signaturePad =null;

window.addEventListener('load', () => {

    const canvas = document.querySelector("canvas");
    canvas.heigth = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas,{});

});
