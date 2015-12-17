'use strict';

var HomepageLinkParser = {
    
    links: {},

    renderObject: {},

    callbacks: {},

    get: function(url, func, params){
        if(!params) params = {}

        if(HomepageLinkParser.links[url]) return func(HomepageLinkParser.links[url])
        // console.log(url + ': Preparing to Fetch')
        HomepageLinkParser.renderObject[url] = true
        
        HomepageLinkParser.callbacks[url] = {
            
            timeout: setTimeout(function(){
                // console.log(url + ': Timed Out')

                HomepageLinkParser.callbacks[url].func(null)
                
                delete HomepageLinkParser.callbacks[url]
                delete HomepageLinkParser.renderObject[url]
            }, params.timeout || 10000),

            func: func,
        }
        m.redraw(); console.log('Redraw')
    },

    normalizeData: function(data){
        var cleanData = {
            url: '',
            display_url: '',
            provider: '',
            title: '',
            description: '',
            image: null,
            media: '',
            authors: [],
            embed: '',
            embedSource: '',
        }

        if(!data) return cleanData

        if(data.original_url) cleanData.url = data.original_url;
        if(data.provider_display) cleanData.display_url = data.provider_display;
        if(data.provider_name) cleanData.provider = data.provider_name;
        if(data.title) cleanData.title = data.title;
        if(data.description) cleanData.description = data.description;
        if(data.images && data.images[0] && data.images[0].url) cleanData.image = data.images[0].url
        if(data.media && data.media.html){
            cleanData.media = data.media.html
            var attributes = parseAttributes(cleanData.media)
            var params = null
            if(attributes.src){
                params = parseQueryParams(attributes.src)
            }
            if(params){
                cleanData.embed = params.src
                cleanData.embedSource = params.url
            }
        }
        if(data.authors && data.authors.length > 0){
            
            data.authors.forEach(function(author){
                var authorObject = {}
                if(author.url) authorObject.url = author.url
                if(author.name){
                    authorObject.name = author.name
                    cleanData.authors.push(authorObject)
                }
            })
        }

        return cleanData

        function parseQueryParams(url){
            try{
                var searchParams = url.substring(url.indexOf('?')+1)

                var urlParams = {}
                var match
                var pl     = /\+/g  // Regex for replacing addition symbol with a space
                var search = /([^&=]+)=?([^&]*)/g
                var decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); }

                while (match = search.exec(searchParams)){ 
                   urlParams[decode(match[1])] = decode(match[2]);
                }
                return urlParams
            } catch(e){
                return null
            }
        }
        function parseAttributes(elementString){
            try{
                var test_element = document.createElement('div');
                test_element.innerHTML = elementString;

                var element = test_element.childNodes[0];
                var attributes = element.attributes;

                var attributeObject = {}
                for (var i = 0; i < attributes.length; i++) {
                    var attribute = attributes[i];
                    attributeObject[attribute.name] = attribute.value
                }
                return attributeObject
            } catch(e){
                return null
            }
        }
    },

    controller: function(args){

        embedly('on', 'card.rendered', function(iframe, data){
            var url = data.extract.original_url
            var data = HomepageLinkParser.normalizeData(data.extract)
            // console.log(url + ': Returning Data')
            HomepageLinkParser.links[url] = data

            if(!HomepageLinkParser.callbacks[url]) return

            HomepageLinkParser.callbacks[url].func(data)

            clearTimeout(HomepageLinkParser.callbacks[url].timeout)

            delete HomepageLinkParser.callbacks[url]
            delete HomepageLinkParser.renderObject[url]

        });

        var embed = function(element, isInstantiated){
            if(isInstantiated) return
            // console.log(element.href + ': Rendered Preview')
            embedly('card', element)
        }

        return {
            embed: embed,

            renderObject: HomepageLinkParser.renderObject,
        }

    },

    view: function(ctrl, args) {
        return m('div', {style:{'display':'none'}}, [
            Object.keys(ctrl.renderObject).map(function(link){
                return m('a', {config: ctrl.embed, href: link, key:link})
            })
        ])
    }
};