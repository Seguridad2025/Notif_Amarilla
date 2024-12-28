document.addEventListener("DOMContentLoaded", function () {
    const signaturePads = [];
  
    // Inicializar los canvas para la firma
    const canvasIds = ["signature-canvas1", "signature-canvas2", "signature-canvas3"];
    canvasIds.forEach((id) => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const signaturePad = new SignaturePad(canvas);
        signaturePads.push(signaturePad);
      } else {
        console.error(`Canvas con ID "${id}" no encontrado.`);
      }
    });
  
    // Botones para limpiar las firmas
    const clearButtons = [
      document.getElementById("clear-signature1"),
      document.getElementById("clear-signature2"),
      document.getElementById("clear-signature3"),
    ];
  
    clearButtons.forEach((button, index) => {
      if (button) {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          if (signaturePads[index]) {
            signaturePads[index].clear();
          } else {
            console.error(`SignaturePad no inicializado para el botón en índice ${index}`);
          }
        });
      } else {
        console.error(`Botón de limpiar firma no encontrado en índice ${index}`);
      }
    });
  
    // Reducir calidad de imágenes Base64
    function reduceImageQuality(base64Image, quality = 0.7) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", quality)); // Reduce calidad a JPEG
        };
        img.src = base64Image;
      });
    }
  
    // Procesar el formulario
    const form = document.getElementById("form");
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
  
        // Validación de campos obligatorios
        const formData = {
          Fecha: document.getElementById("Fecha")?.value || "",
          Hora: document.getElementById("Hora")?.value || "",
          Nombre: document.getElementById("Nombre del amonestado")?.value || "",
          Empresa: document.getElementById("Empresa")?.value || "",
          AreaLugar: document.getElementById("Area/Lugar")?.value || "",
          Estado1: document.querySelector("input[name='Estado1']:checked")?.value || "",
          Estado2: document.querySelector("input[name='Estado2']:checked")?.value || "",
          Estado3: document.querySelector("input[name='Estado3']:checked")?.value || "",
          Estado4: document.querySelector("input[name='Estado4']:checked")?.value || "",
          Estado5: document.querySelector("input[name='Estado5']:checked")?.value || "",
          Estado6: document.querySelector("input[name='Estado6']:checked")?.value || "",
          Estado7: document.querySelector("input[name='Estado7']:checked")?.value || "",
          Otros: document.getElementById("otros")?.value || "",
          Descripcion: document.getElementById("descripcion")?.value || "",
          AccionTomada: document.getElementById("Accion tomada")?.value || "",
        };
  
        if (!formData.Fecha || !formData.Hora || !formData.Nombre || !formData.Empresa) {
          alert("Por favor completa todos los campos obligatorios.");
          return;
        }
  
        // Confirmación antes de enviar
        if (!confirm("¿Estás seguro de que deseas enviar este formulario?")) {
          return;
        }
  
        // Indicador de carga
        const submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
  
        try {
          // Procesar las firmas
          const firmas = [];
          for (const pad of signaturePads) {
            if (!pad.isEmpty()) {
              const base64Signature = await reduceImageQuality(pad.toDataURL());
              firmas.push(base64Signature);
            } else {
              firmas.push(null);
            }
          }
  
          // Agregar firmas al formData
          formData.Firmas = firmas;
  
          // URL del Apps Script
          const endpointURL = "https://script.google.com/macros/s/AKfycbzGTuhOk_M8-JtGdzIJuhZrbMLMk7FzXlSMoWDvFlB57vi13sVek2_EAe_ATayo9lLR/exec";
  
          const response = await fetch(endpointURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error del servidor:", errorText);
            alert(`Error al enviar los datos: ${response.status} - ${response.statusText}`);
            return;
          }
  
          const result = await response.json();
          console.log("Respuesta del servidor:", result);
  
          if (result.success) {
            alert("Datos enviados con éxito.");
            form.reset();
            signaturePads.forEach((pad) => pad.clear());
          } else {
            alert("Error al enviar los datos: " + (result.error || "Error desconocido."));
          }
        } catch (error) {
          console.error("Error al enviar los datos:", error);
          alert("Hubo un problema al enviar el formulario. Por favor intenta de nuevo.");
        } finally {
          // Restaurar botón de enviar
          submitButton.disabled = false;
          submitButton.textContent = "ENVIAR FORMULARIO";
        }
      });
    } else {
      console.error('Formulario con ID "form" no encontrado.');
    }
  });
