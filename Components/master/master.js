'use strict';

var Master = {}

Master.controller = function(){
	return {
		addNew: function(e){
			m.route('?location=new')
		}
	}
}


Master.view = function(ctrl){

	if(m.route.param('location') === 'new'){
		Modal.push('new', New)
	} else{
		Modal.pull('new')
	}

	return m('div', [

		Modal.isOpen() ? m.component(Modal) : null,

		m('button', {onclick:ctrl.addNew}),
	])
}