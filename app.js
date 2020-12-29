const drinksList = document.querySelector('#drinks-list');
const form = document.querySelector('#add-drinks-form');

const renderDrink = (doc) => {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let ingredients = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    ingredients.textContent = doc.data().ingredients;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(ingredients);
    li.appendChild(cross);

    drinksList.appendChild(li);

    // delete a drink
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('drinks').doc(id).delete();
    });
}

// add a drink
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ingredients = form.ingredients.value;
    const name = form.name.value;
    const ingredientsArr = ingredients.split(',');

    if (name && ingredientsArr) {
        db.collection('drinks').add({
            name: name,
            ingredients: ingredientsArr
        });
    }
    form.name.value = '';
    form.ingredients.value = '';
})

// real-time listener
db.collection('drinks').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderDrink(change.doc);
        } else if (change.type == 'removed') {
            let li = drinksList.querySelector('[data-id=' + change.doc.id + ']');
            drinksList.removeChild(li);
        }
    });
});