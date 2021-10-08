$('#btn-editar').on('click', () => {
    location.href = '/src/edit-products.html';
});

$('#btn-agregar').on('click', () => {
    location.href = '/src/load-products.html';
});

$('#boton-volver').on('click', () => {
    firebase.auth().signOut()
    .then( () => {
        console.log('signed out successfuly.');
    });
    location.href = '../index.html';
});