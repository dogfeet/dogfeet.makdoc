(function(){
    'use strict';

    var _ = require('lodash');
    var Handlebars = require('handlebars');
    var makdoc = require('gulp-makdoc');
    var pkg = require('../package.json');

    makdoc.templateData({package:pkg});

    var initAuthors = function(pkg){
        var authors = pkg.contributors? pkg.contributors.slice():[];
        if( pkg.author) {
            authors.push( pkg.author );
        }

        return authors.reduce(function(r, el){
            r[ el.name ] = el;

            return r;
        }, {});
    }

    var authors = initAuthors(pkg);

    var arrayfy = function(value) {
        //value is string or array
        return !value? []:
            Array.isArray(value)? value:value.split(',');
    }

    Handlebars.registerHelper('_gen-authors', function(name) {
        return _(arrayfy(name))
            .map(function(it){
                it = it.trim();
                var author = authors[it];
                return '<a href="' + author.url + '">' + author.name + '</a>';
            })
            .value()
                .join(', ');
    });

    Handlebars.registerHelper('_keyword-links', function(keywords) {
        return _(arrayfy(keywords))
            .map(function(it){
                it = it.trim();
                return '<a href="/site/keyword-map.html#' +
                    it.toLowerCase() + '" class="keyword">' +
                    it + '</a>';
            })
            .value()
                .join(' ');
    });

    Handlebars.registerHelper('_gen-twitter', function(names) {
        return _(arrayfy(names))
            .map(function(it){ return it.trim(); })
            .filter(function(it){ return !!authors[it]; })
            .map(function(it){ return '@' + authors[it].twitter; })
            .value()
                .join(' ');
    });

    Handlebars.registerHelper('_group-doc', function(models){
        return models.reduce(function(g, m){
            var keywords = m['keywords'];
            if( keywords ) {
                var keywords = _.isString(keywords)? keywords.split(','): keywords;

                keywords.forEach(function(keyword){
                    if( (g[keyword]) ) {
                        g[keyword].push(m);
                    }else{
                        g[keyword] = [m];
                    }
                });
            }

            return g;
        }, {});
    });

    Handlebars.registerHelper('_summary', function(html) {
        if(html){
            var matched = (/<h[123456].*?>.*<\/h[123456].*?>([\s\S*]*?)<h[123456].*?>.*<\/h[123456].*?>/i).exec(html)

            if( matched ) {
                return matched[1];
            }
        }

        return "empty-summary";
    });

})()
