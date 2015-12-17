'use strict';


var HomepageLink = {
    

    controller: function(args){

        if(!args) return null

        var MediaTemplate = null;

        if(args.embed){
            MediaTemplate = m('div.homepage-link-media-embed-wrapper', [
                m('iframe', {src: args.embed, frameborder: "0", allowfullscreen: true})
            ])
        }

        else if(args.media){
            MediaTemplate = m('div.homepage-link-media-embed-wrapper', [
                m.trust(args.media)
            ])
        }

        else if(args.image){
            MediaTemplate = m('a.homepage-link-media-image-container', {href:args.url, target: '_blank', style:{'background': 'url(' + args.image + ') 50% 50% / cover no-repeat'}}, [
                m('img.homepage-link-media-image', {src: args.image})
            ])
        }

        return {
            MediaTemplate:MediaTemplate,
        }


    },

    view: function(ctrl, args) {
        if(!ctrl || !args) return m('span')

        return m('div.homepage-link-container', [
            ctrl.MediaTemplate ? m('div.homepage-link-media-container', [
                ctrl.MediaTemplate,
            ]) : null,
            m('div.homepage-link-text-container', [
                args.title ? m('h4.homepage-link-title', args.title) : null,
                m('p.homepage-link-details', [
                    args.display_url ? m('a.homepage-link-url', {href:args.url, target: '_blank'}, args.display_url) : null,
                    ' | ' ,
                    (args.authors && args.authors[0] && args.authors[0].name ?
                        (args.authors[0].url ?
                            m('a.homepage-link-url', {href:args.authors[0].url, target: '_blank'}, args.authors[0].name)
                            : args.authors[0].name)
                        : m('a.homepage-link-url', {href:args.url, target: '_blank'}, 'See more >')),
                ]),
                args.description ? m('p.homepage-link-description', args.description) : null
            ]),



            m('div.homepage-link-frame', [
                m('div.homepage-link-frame-border')
            ])
        ])
    }
};


