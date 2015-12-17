'use strict';

var Modal = {}

Modal.list = []

Modal.isOpen = function(){
	return Modal.list.length > 0
}

Modal.push = function(key, component, params){
	if(!key || !component) return
	for(var i in Modal.list) if(Modal.list[i].key === key) return
	Modal.list.push({
		key: key,
		component: component,
		params, params,
	})
}

Modal.pull = function(key){
	for(var i = Modal.list.length - 1; i >= 0 ; i--){
		if(Modal.list[i].key === key) Modal.list.splice(i, 1)
	}
}

Modal.controller = function(){
}


Modal.view = function(ctrl){

	return m('div.modal-backdrop', [
		Modal.list.map(function(item){
			return m('div.modal-body', [
				m.component(item.component, item.params)
			])
		})
	])
}