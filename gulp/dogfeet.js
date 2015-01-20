(function(){
    'use strict';

    var _ = require('lodash');
    var hbs = require('handlebars');
    var makdoc = require('gulp-makdoc');

    var authors = {
        'Changwoo Park': {
            name: 'Changwoo Park',
            email: 'pismute@gmail.com',
            github: 'pismute',
            twitter: 'pismute',
            gravata: '2694a5501ec37eab0c6d4bf98c30303a'
        },
        'Sean Lee': {
            name: 'Sean Lee',
            email: 'sean@weaveus.com',
            github: 'lethee',
            twitter: 'lethee',
            page: "<a href=\"http://kr.linkedin.com/in/seanseonghwanlee\">Sean Lee</a>",
            gravata: '2699699e90ed281807fc0631ec89bbe2'
        },
        'Yongjae Choi': {
            name: 'Yongjae Choi',
            email: 'mage@weaveus.com',
            github: 'lnyarl',
            twitter: 'lnyarl',
            gravata: '8232d82f449689642bb4c1f6bbc929bd'
        }
    }

    var siteData = {
        url: "http://dogfeet.github.io/",
        title: "개발새발",
        description: "정통 개발 주간 블로그입니다. 주 관심사는 학습과 WEB입니다.",
        keywords: "학습,Learning,HTML5,Mobile,Web,iPhone,Android,Git,JavaScript,Scala,개발새발,dogfeet",
        author: 'Changwoo Park, Sean Lee, Yongjae Choi',
        date: new Date()
    }

    makdoc.templateData({site:siteData});

    var to = {
        array: function(value) {
            //value is string or array
            return _.isString(value) && value.split(',') || value;
        },
        value: function(obj, prop) {
            var val = obj[prop];

            return _.isFunction(val) && val() || val;
        }
    }

    hbs.registerHelper('_page-authors', function(author) {
        return _(to.array(author) || Object.keys(authors))
            .map(function(it){ return it.trim(); })
            .value()
                .join(', ');
    });

    hbs.registerHelper('_tag-links', function(tags) {
        return _(to.array(tags))
            .map(function(it){ return it.trim(); })
            .map(function(it){
                return '<a href="/site/tagmap.html#' +
                    it.toLowerCase() + '" class="tag">' +
                    it + '</a>';
            })
            .value()
                .join(' ');
    });

    hbs.registerHelper('_gen-authors', function(name) {
        return _(to.array(name))
            .map(function(it){ return it.trim(); })
            .map(function(it){
                var author = authors[it];

                if (author.page) {
                    return to.value(author, 'page');
                } else {
                    return "<a href=\"https://twitter.com/" + author.twitter + "/\">" + author.name + "</a>";
                }
            })
            .value()
                .join(', ');
    });

    hbs.registerHelper('_gen-twitter', function(names) {
        return _(names)
            .map(function(it){ return it.trim(); })
            .filter(function(it){ return !!authors[it]; })
            .map(function(it){ return '@' + authors[it].twitter; })
            .value()
                .join(' ');
    });

    hbs.registerHelper('_group-model', function(models){
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

    hbs.registerHelper('_summary', function(html) {
        return (html)?
            (/<h[123456].*?>.*<\/h[123456].*?>([\s\S*]*?)<h[123456].*?>.*<\/h[123456].*?>/i).exec(html)[1] :
            "empty-summary";
    });

})()
