import Controller from './Controller';
import Ui from './Ui';

const ui = new Ui();

ui.bindToDOM(document.getElementById('ticketsContainer'));

const ctr = new Controller(ui);

ctr.init();
