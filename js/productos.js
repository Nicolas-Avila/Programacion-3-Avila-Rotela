// Función para cargar las tarjetas desde el archivo JSON
function loadCards() {
    // Leer el archivo JSON
    fetch('tp/json/data.json') // Usa '/' en lugar de '\'
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Seleccionar el contenedor de tarjetas en el DOM
            const cardsContainer = document.getElementById('cards-container');
            
            // Recorrer los datos del JSON y crear una tarjeta para cada objeto
            data.forEach(cardData => {
                // Crear el elemento tarjeta
                const card = document.createElement('div');
                card.classList.add('card', 'col-sm', 'm-4', 'ave');
                card.style.width = '18rem';

                // Crear el contenido de la tarjeta
                card.innerHTML = `
                    <img src="${cardData.image}" class="card-img-top" alt="${cardData.title}">
                    <div class="card-body">
                        <h5 class="card-title">${cardData.title}</h5>
                        <p class="card-text">${cardData.text}</p>
                        <a href="${cardData.link}" class="btn btn-primary">Go somewhere</a>
                    </div>
                `;

                // Añadir la tarjeta al contenedor
                cardsContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
}

// Llamar a la función para cargar las tarjetas cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadCards);
