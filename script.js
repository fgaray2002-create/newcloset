const SHEET_ID = '1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${1-K--QwKKTzi5nQRQjKQyP88YfDpJBz4ShFMfz_gM0Fk}/export?format=csv&gid=0`;

async function loadInventory() {
    const response = await fetch(CSV_URL);
    const data = await response.text();
    
    // Convertir CSV a Objetos (omitimos la primera fila de cabecera)
    const rows = data.split('\n').slice(1);
    const gallery = document.getElementById('gallery');

    rows.forEach(row => {
        const columns = row.split(',');
        if(columns.length < 9) return;

        // Mapeo según tu Drive: E=Nombre, F=Precio, I=Imagen, J=Stock
        const product = {
            nombre: columns[4],
            precio: columns[5],
            colores: columns[6],
            talles: columns[7],
            img: columns[8].replace('/view?usp=drivesdk', '').replace('file/d/', 'uc?id='), // Convierte link de Drive a imagen directa
            stock: columns[9].trim()
        };

        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Lógica de "No hay stock"
        const stockStatus = product.stock === 'N' ? '<div class="out-of-stock">AGOTADO</div>' : '';
        
        card.innerHTML = `
            ${stockStatus}
            <img src="${product.img}" onclick="openDetail('${product.nombre}', '${product.precio}', '${product.img}', '${product.colores}', '${product.talles}')">
            <div class="product-info">
                <h3>${product.nombre}</h3>
                <p class="price">${product.precio}</p>
            </div>
        `;
        gallery.appendChild(card);
    });
}

function openDetail(name, price, img, colors, sizes) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalImg').src = img;
    document.getElementById('modalColors').innerText = colors;
    document.getElementById('modalSizes').innerText = sizes;
    document.getElementById('productModal').style.display = "block";
}

loadInventory();
