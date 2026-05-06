// Link directo al CSV de tu "Cerebro"
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk/export?format=csv&gid=0';

async function loadInventory() {
    try {
        const response = await fetch(CSV_URL);
        const data = await response.text();
        
        const rows = data.split('\n').slice(1);
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; 

        rows.forEach(row => {
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if(columns.length < 9) return;

            const clean = (text) => text ? text.replace(/['"]+/g, '').trim() : '';

            // Extracción robusta del ID de la imagen de Google Drive
            let rawImg = clean(columns[8]);
            let imgId = "";
            
            if (rawImg.includes('id=')) {
                imgId = rawImg.split('id=')[1].split('&')[0];
            } else if (rawImg.includes('/d/')) {
                imgId = rawImg.split('/d/')[1].split('/')[0];
            }

            const product = {
                nombre: clean(columns[4]), // Nombre de la prenda como "Vestido Ana"
                precio: clean(columns[5]), // Precios como "$25,000.00"
                colores: clean(columns[6]),
                talles: clean(columns[7]),
                img: imgId ? `https://lh3.googleusercontent.com/u/0/d/${imgId}` : '',
                stock: clean(columns[9]).toUpperCase()
            };

            if (product.nombre && product.img) {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                const isOutOfStock = product.stock === 'N';
                const stockStatus = isOutOfStock ? '<div class="out-of-stock">SIN STOCK</div>' : '';
                const imgStyle = isOutOfStock ? 'style="opacity: 0.4; filter: grayscale(1);"' : '';

                card.innerHTML = `
                    ${stockStatus}
                    <img src="${product.img}" ${imgStyle} 
                         onclick="openDetail('${product.nombre}', '${product.precio}', '${product.img}', '${product.colores}', '${product.talles}')"
                         onerror="this.src='https://via.placeholder.com/400x600?text=Cargando+Imagen...'">
                    <div class="product-info">
                        <h3>${product.nombre}</h3>
                        <p class="price">${product.precio}</p>
                    </div>
                `;
                gallery.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error cargando el catálogo:", error);
    }
}

// Esta función ahora manejará el cambio de imagen por color
function changeProductColor(imgUrl) {
    const mainImg = document.getElementById('modalImg');
    mainImg.style.opacity = '0'; // Efecto de transición suave
    setTimeout(() => {
        mainImg.src = imgUrl;
        mainImg.style.opacity = '1';
    }, 200);
}

function openDetail(name, price, img, colors, sizes, colorPhotosRaw) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = img;
    document.getElementById('modalSizes').innerText = sizes;
    
    const colorContainer = document.getElementById('modalColors');
    colorContainer.innerHTML = ''; // Limpiamos colores anteriores

    if (colorPhotosRaw && colorPhotosRaw.includes('|')) {
        // Separamos los colores y sus fotos: Rojo|link1, Azul|link2
        const colorPairs = colorPhotosRaw.split(',');
        
        colorPairs.forEach(pair => {
            const [colorName, driveUrl] = pair.split('|');
            const cleanId = extractDriveId(driveUrl); // Usamos la misma lógica de limpieza de IDs
            const directImg = `https://lh3.googleusercontent.com/u/0/d/${cleanId}`;

            // Creamos un botoncito para cada color
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.title = colorName;
            btn.style.backgroundColor = getColorHex(colorName); // Función opcional para poner el color real
            btn.onclick = () => changeProductColor(directImg);
            
            colorContainer.appendChild(btn);
        });
    } else {
        colorContainer.innerText = colors; // Si no hay fotos, muestra el texto normal
    }

    document.getElementById('productModal').style.display = "block";
}

// Esta función ahora manejará el cambio de imagen por color
function changeProductColor(imgUrl) {
    const mainImg = document.getElementById('modalImg');
    mainImg.style.opacity = '0'; // Efecto de transición suave
    setTimeout(() => {
        mainImg.src = imgUrl;
        mainImg.style.opacity = '1';
    }, 200);
}

function openDetail(name, price, img, colors, sizes, colorPhotosRaw) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = img;
    document.getElementById('modalSizes').innerText = sizes;
    
    const colorContainer = document.getElementById('modalColors');
    colorContainer.innerHTML = ''; // Limpiamos colores anteriores

    if (colorPhotosRaw && colorPhotosRaw.includes('|')) {
        // Separamos los colores y sus fotos: Rojo|link1, Azul|link2
        const colorPairs = colorPhotosRaw.split(',');
        
        colorPairs.forEach(pair => {
            const [colorName, driveUrl] = pair.split('|');
            const cleanId = extractDriveId(driveUrl); // Usamos la misma lógica de limpieza de IDs
            const directImg = `https://lh3.googleusercontent.com/u/0/d/${cleanId}`;

            // Creamos un botoncito para cada color
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.title = colorName;
            btn.style.backgroundColor = getColorHex(colorName); // Función opcional para poner el color real
            btn.onclick = () => changeProductColor(directImg);
            
            colorContainer.appendChild(btn);
        });
    } else {
        colorContainer.innerText = colors; // Si no hay fotos, muestra el texto normal
    }

    document.getElementById('productModal').style.display = "block";
}

// Función auxiliar para limpiar IDs de Drive (agrega esta arriba de todo)
function extractDriveId(url) {
    if (!url) return '';
    let id = "";
    if (url.includes('id=')) id = url.split('id=')[1].split('&')[0];
    else if (url.includes('/d/')) id = url.split('/d/')[1].split('/')[0];
    return id.replace(/['"]+/g, '').trim();
}
loadInventory();
