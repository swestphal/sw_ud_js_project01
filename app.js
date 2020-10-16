/**
 * @description Dino Object
 * @param species
 * @param weight
 * @param height
 * @param diet
 * @param where
 * @param when
 * @param fact
 * @constructor
 */
function Dino(species, weight, height, diet, where, when, fact) {
    this.species = species;
    this.weight = {
        compare: true,
        fact: weight,
        message: 'The average ' + this.species + ' weighed ' + fact + ' lbs.',
    };
    this.height = {
        compare: true,
        fact: height,
        message: 'The average ' + this.species + ' was ' + fact +
            ' feets tall.',
    };
    this.diet = {
        compare: true,
        fact: diet,
        message: 'The ' + this.species + ' was a ' + fact + '!',
    };
    this.where = {
        compare: false,
        fact: where,
        message: 'The ' + this.species + ' lived in ' + fact + '!',
    };
    this.when = {
        compare: false,
        fact: when,
        message: 'The ' + this.species + ' lived during the ' + fact +
            ' period!',
    };
    this.fact = {
        compare: false,
        message: fact,
    };
    this.image = this.species.toLowerCase() + '.png';
}

/**
 * @description Compare dino weight with human and return phrase for output in grid
 * @param human
 * @returns {string}
 */
Dino.prototype.compareweight = function(human) {
    const diff = human.weight - this.weight.fact;
    if (diff > 0) {
        return 'You are ' + diff + 'lbs heavier than the dino';
    } else if (diff < 0) {
        return 'The dino is ' + -diff + ' lbs heavier than you';
    } else return 'You have the same weight of ' + human.weight;
};

/**
 * @description Compare dino height with human and return phrase for output in grid
 * @param human
 * @returns {string}
 */
Dino.prototype.compareheight = function(human) {
    const hheight = human.inches === '' ? human.feet : human.inches / 12;
    const diff = hheight - this.height.fact;
    if (diff > 0) {
        return 'You are ' + diff + ' feets greater than the dino';
    } else if (diff < 0) {
        return 'The dino is ' + -diff + ' feets greater than you';
    } else return 'You have the same height of ' + hheight + ' feet';
};

/**
 * @description Compare dino diet with human and return phrase for output in grid
 * @param human
 * @returns {string}
 */
Dino.prototype.comparediet = function(human) {
    const diets = ['herbavor', 'omnivor', 'carnivor'];
    const ddiet = diets.indexOf(this.diet.fact.toLowerCase());
    const hdiet = diets.lastIndexOf(human.diet.toLocaleLowerCase());
    if (ddiet < hdiet) {
        return (
            'You are a ' +
            human.diet +
            ' and you can eat the ' +
            this.diet.fact +
            ' dino'
        );
    } else if (ddiet > hdiet) {
        return 'As a ' + human.diet + ' you will become the meal of the dino.';
    } else {
        return 'You and the dino are ' + human.diet +
            's and can share the meal';
    }
};

/**
 * @description Fetch Dinodata from json file
 * @returns {Promise<*>}
 */
async function fetchDinoData() {
    try {
        const response = await fetch('dino.json'); // got response
        const data = await response.json(); // got data
        return data['Dinos']; // returns another promise
    } catch (e) {
        console.error('An error occured while fetching dino api: ${e}');
        throw e;
    }
}

/**
 * @description Factory where single dinos are instantiated from json file and output is generated
 * @type {{buildTiles: DinoFactory.buildTiles, getRandomDinoFact: (function(*=, *=): (*|undefined)), dinoObjectsArr: [], buildDinoObjects: DinoFactory.buildDinoObjects, removeForm: DinoFactory.removeForm}}
 */
let DinoFactory = {
    dinoObjectsArr: [],
    buildDinoObjects: function(response) {
        this.dinoObjectsArr = response.map(function(dino) {
            return new Dino(
                dino.species,
                dino.weight,
                dino.height,
                dino.diet,
                dino.where,
                dino.when,
                dino.fact,
            );
        });
    },
    getRandomDinoFact: function(dino, human) {
        const randNum = Math.floor(Math.random() * 6) + 1;
        let key = Object.keys(dino)[randNum];
        if (dino[key].hasOwnProperty('compare')) {
            // its a dino
            if (dino[key].compare) {
                let str = 'compare' + key;
                return dino[str](human);
            } else {
                return dino[key].message;
            }
        }
    },
    removeForm: function(form) {
        form.style.display = 'none';
    },
    showForm: function(form) {
        form.style.display = 'block';
    },
    cleanScreen: function(form, grid, navigation) {
        while (grid.firstChild) {
            grid.removeChild(grid.lastChild);
        }
        form.reset();
        document.getElementById('form-error').innerText = '';
        while (navigation.firstChild) {
            navigation.removeChild(navigation.lastChild);
        }
    },
    addNewButton: function(form, grid) {
        const navigation = document.getElementById('navigation');
        const button = document.createElement('button');
        button.setAttribute('id', 'new-input');
        button.innerText = 'Play again';
        navigation.appendChild(button);
        const newInput = document.getElementById('new-input');
        newInput.addEventListener('click', function(e) {
            DinoFactory.showForm(form);
            DinoFactory.cleanScreen(form, grid, navigation);
        });
    },
    buildTiles: function(form, grid) {
        const human = Human.getHuman();
        this.dinoObjectsArr.splice(4, 0, human); // insert human in the middle
        this.dinoObjectsArr.forEach(function(dino) {
            let div = document.createElement('div');
            div.className = 'grid-item ';
            let img = document.createElement('img');
            img.src = 'images/' + dino.image;
            let textdiv = document.createElement('div');
            textdiv.className = 'grid-item__text ';
            let ptext = document.createElement('p');
            let innerPText = '';

            if (dino.species === 'human') {
                innerPText = dino.name;
            } else {
                innerPText = dino.species;
                if (dino.species !== 'Pigeon') {
                    innerPText += '<br>' +
                        DinoFactory.getRandomDinoFact(dino, human);
                } else {
                    innerPText += '<br>All birds are Dinosaurs.';
                }
            }
            ptext.innerHTML = innerPText;
            textdiv.appendChild(ptext);
            div.appendChild(textdiv);
            div.appendChild(img);
            grid.appendChild(div);
        });

        this.addNewButton(form, grid);
    },
};

/**
 * @description Human
 * @type {{setHuman: Human.setHuman, getHuman: (function(): {feet: string, inches: string, image: string, species: string, name: string, weight: string, diet: string}), validateData: (function(*): boolean)}}
 */
let Human = (function() {
    let data = {
        species: 'human',
        name: '',
        weight: '',
        feet: '',
        inches: '',
        diet: '',
        image: '/human.png',
    };
    return {
        getHuman: function() {
            return data;
        },
        setHuman: function() {
            data.name = document.getElementById('name').value;
            data.feet = document.getElementById('feet').value;
            data.inches = document.getElementById('inches').value;
            data.weight = document.getElementById('weight').value;
            data.diet = document.getElementById('diet').value;
        },
        validateData: function(e) {
            const event = e ? e : windows.event;
            const form = event.target ? event.target : event.srcElement; // srcElement for IE

            let formIsValid = true;
            const formElements = form.querySelectorAll('input');

            for (let i = 0; i < formElements.length; i++) {
                if (
                    formElements[i].willValidate !== 'undefined' &&
                    !formElements[i].disabled
                ) {
                    if (formElements[i].value == '' || formElements[i].value <
                        0) {
                        formIsValid = false;
                        document.getElementById('form-error').innerHTML =
                            '<p style=\'color:#ff0000;\'>Please check your inputs!</p>';
                    }
                }
            }
            return formIsValid;
        },
    };
})();

/**
 * @description function that init the loading of json, build dinos, remove the form and build the tiles
 * @param form
 */
function startOutput(form, grid) {
    fetchDinoData().then(function(resp) {
        DinoFactory.buildDinoObjects(resp);
        DinoFactory.removeForm(form);
        DinoFactory.buildTiles(form, grid);
    });
}

/**
 * @description iife where input of the form is controlled
 */
(function() {
    const form = document.getElementById('dino-compare');
    const grid = document.getElementById('grid');
    const feet = document.getElementById('feet');
    const inches = document.getElementById('inches');
    const message = document.getElementById('form-error');
    form.noValidate = true; // deactivate the normal error behaviour of input fields - otherwise validation before submit event
    feet.oninput = function() {
        inches.disabled = this.value != '';
        if (feet.value.length > 0) {
            message.innerHTML =
                '<p style=\'color:#00aa00;\'>If you want to set inches delete the feet input</p>';
        } else message.innerHTML = '';
    };
    inches.oninput = function() {
        feet.disabled = this.value != '';
        if (inches.value.length > 0) {
            message.innerHTML =
                '<p style=\'color:#00aa00;\'>If you want to set feet delete the inches input</p>';
        } else message.innerHTML = '';
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (Human.validateData(e)) {
            Human.setHuman();
            startOutput(form, grid);
        }
        return false;
    });
})();
