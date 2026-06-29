function importarDesdeExcel(datosJSON) {
    // datosJSON debe ser un array de objetos: [{producto: "Acetaminofén", cantidad: 10, categoria: "Analgésicos"}, ...]
    let inventarioActual = JSON.parse(localStorage.getItem('inventarioAcopio')) || [];
    
    // Sumar los nuevos datos a los que ya existen
    datosJSON.forEach(nuevoItem => {
        inventarioActual.push({
            fecha: new Date().toISOString().split('T')[0],
            producto: nuevoItem.producto,
            categoria: nuevoItem.categoria,
            cantidad: parseInt(nuevoItem.cantidad),
            obs: nuevoItem.obs || ""
        });
    });

    localStorage.setItem('inventarioAcopio', JSON.stringify(inventarioActual));
    alert("¡Datos importados con éxito! Recarga la página para ver los cambios.");
}