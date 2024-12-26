document.addEventListener("DOMContentLoaded", function () {
    const signaturePads = [];
    
    // Inicializar los canvas para la firma
    const canvasIds = ["signature-canvas1", "signature-canvas2", "signature-canvas3"];
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        const signaturePad = new SignaturePad(canvas);
        signaturePads.push(signaturePad);
    });

    // Botones para limpiar las firmas
    const clearButtons = [
        document.getElementById("clear-signature1"),
        document.getElementById("clear-signature2"),
        document.getElementById("clear-signature3")
    ];

    clearButtons.forEach((button, index) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            signaturePads[index].clear();
        });
    });

    // Procesar el formulario
    const form = document.getElementById("form");
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = {
            Fecha: document.getElementById("Fecha").value,
            Hora: document.getElementById("Hora").value,
            Nombre: document.getElementById("Nombre del amonestado").value,
            Empresa: document.getElementById("Empresa").value,
            AreaLugar: document.getElementById("Area/Lugar").value,
            Estado1: document.querySelector("input[name='Estado1']:checked").value,
            Estado2: document.querySelector("input[name='Estado2']:checked").value,
            Estado3: document.querySelector("input[name='Estado3']:checked").value,
            Estado4: document.querySelector("input[name='Estado4']:checked").value,
            Estado5: document.querySelector("input[name='Estado5']:checked").value,
            Estado6: document.querySelector("input[name='Estado6']:checked").value,
            Estado7: document.querySelector("input[name='Estado7']:checked").value,
            Otros: document.getElementById("otros").value,
            Descripcion: document.getElementById("descripcion").value,
            AccionTomada: document.getElementById("Accion tomada").value,
            Firmas: signaturePads.map(pad => pad.isEmpty() ? null : pad.toDataURL()) // Guardar las firmas como imágenes
        };

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbzGTuhOk_M8-JtGdzIJuhZrbMLMk7FzXlSMoWDvFlB57vi13sVek2_EAe_ATayo9lLR/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.success) {
                alert("Datos enviados con éxito.");
            } else {
                alert("Error al enviar los datos.");
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Hubo un problema al enviar el formulario.");
        }
    });
});
