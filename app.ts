'use strict';

var doc = window.document,
    appContainer = doc.querySelector('#app'),

    mainView = require('./views/main/main'),
    Octopus = require('./octopus.ts');

/**
 * App init
 */
window.onload = function() {

    var octopus = new Octopus();

    octopus.init();

    appContainer.appendChild(mainView.render());
};
