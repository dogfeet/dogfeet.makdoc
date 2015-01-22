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
        return Array.isArray(value)? value:value.split(',');
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

    Handlebars.registerHelper('_tag-links', function(tags) {
        return _(arrayfy(tags))
            .map(function(it){
                it = it.trim();
                return '<a href="/site/tagmap.html#' +
                    it.toLowerCase() + '" class="tag">' +
                    it + '</a>';
            })
            .value()
                .join(' ');
    });

    Handlebars.registerHelper('_gen-twitter', function(names) {
        return _(names)
            .map(function(it){ return it.trim(); })
            .filter(function(it){ return !!authors[it]; })
            .map(function(it){ return '@' + authors[it].twitter; })
            .value()
                .join(' ');
    });

    Handlebars.registerHelper('_group-model', function(models){
        return models.reduce(function(g, m){
            var tags = m['tags'];
            if( tags ) {
                var tags = _.isString(tags)? tags.split(','): tags;

                tags.forEach(function(tag){
                    if( (g[tag]) ) {
                        g[tag].push(m);
                    }else{
                        g[tag] = [m];
                    }
                });
            }

            return g;
        }, {});
    });

    Handlebars.registerHelper('_summary', function(html) {
        return (html)?
            (/<h[123456].*?>.*<\/h[123456].*?>([\s\S*]*?)<h[123456].*?>.*<\/h[123456].*?>/i).exec(html)[1] :
            "empty-summary";
    });

})()
