'use strict';

var New = {}
    
New.parseLinks = function(text){

    var links = []

    var autolinker = new Autolinker({
        replaceFn : function( autolinker, match ){
            links.push(match.getAnchorHref())
            return false
        }
    });

    autolinker.link(text);

    return links;

}

New.controller = function(args){

    var link = m.prop('')


    var bindLink = function(e){
        // m.redraw.strategy('none')
        var links = New.parseLinks(e.target.value)
        if(links.length > 0){
            HomepageLinkParser.get(links[0], function(data){
                console.log(data)
                link(data)
                m.redraw()
            })

        }
    }

    var removeLink = function(e){
        if(!post.link()) return
        oldLink().push(post.link().url)
        post.link(null)
        m.redraw(); console.log("Redraw")
        updateText(post.text(), null, true)
        m.redraw.strategy('none')
        // m.redraw(); console.log("Redraw")
    }

    var submit = function(e){ 
        m.request({method: "POST", url: "http://duck:4001/tiles", data: link(), background: true}).then(function(response){    
            console.log(response)
            m.redraw(); console.log('Redraw');
        }, function(error){
            console.log(error)
            m.redraw(); console.log('Redraw');
        })

    }


    return {

        link: link,

        removeLink: removeLink,

        submit: submit,

        bindLink: bindLink,

    }

}

New.view = function(ctrl, args) {
    return m('div.homepage-post', [
        ctrl.link() ? m('div', {style:{'position':'relative'}}, [
            m.component(HomepageLink, ctrl.link()),
            m('button', {onclick: ctrl.removeLink})
        ]) : null,
        m.component(HomepageLinkParser),
        m('input', {type: 'text', oninput: ctrl.bindLink, onpaste:ctrl.bindlink}),
        m('button', {onclick: ctrl.submit},'Submit')
    ])
}
