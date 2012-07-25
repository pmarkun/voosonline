SETTINGS = {}
SETTINGS['base_url'] = "http://127.0.0.1:9200/esfera/diariasrs2"
my = {};
my.base_url = SETTINGS['base_url'];
my.query = {
    "query" : {
            "filtered" : {
                "query" : {
                    "match_all" : { }
                        },
                "filter" : [{
                    "match_all" : { }
                        }]
                    }
                },
    "facets" : {
        "orgao" : {
            "terms" : {
                "field" : "Orgao",
                "size" : 10
                }
            },
        "passageiros" : {
            "terms" : {
                "field" : "Favorecido",
                "size" : 40000
                }
            }
        },
    "size" : 15,
    "from" : 0,
    "sort" : {
        "DataFim" : { "order" : "desc" }
    }
};

//roubado do acontecenacamara
function gup( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    var result = results[1].substring(0,results[1].length);
    return decodeURIComponent(result).replace(/\+/g, " ")
}

//roubado e adaptado do recline
function normalizeFilters(filters) {
    var filter = {}
    if (filters && filters.length) {
        if (!filter) {
            filter = {};
        }
        if (!filter.and) {
            filter.and = [];
        }
        filter.and = filter.and.concat(filters);
    }
    if (filters !== undefined) {
        delete filters;
    }
    return filter;
}


function montaUrl(url, q) {
   return url + '/_search?source=' + JSON.stringify(q) //Jquery tem um metodo pra isso?
}

//temporario - modificar
function carregaFiltros(q) {
    var filters = []
    
    if (gup("destino")) {
        filters.push({ term : { "Destino" : gup("destino") }});
        //$("input#estado").val(gup("estado"));
    }
    
    if (gup("favorecido")) {
        filters.push({ term : { "Favorecido" : gup("favorecido") }});
        //$("input#partido").val(gup("partido"))
    }
    
    if (gup("tags")) {
        filters.push({ term : { "tags" : gup("tags") }});
        $("input#partido").val(gup("partido"));
    }
    
    if (gup("orador")) {
        filters.push({ term : { "orador" : gup("orador") }});
        $("input#orador").val(gup("orador"));
    }
    
    if (gup("data_inicio")) {
        var data_inicio_filter = {
            "range" : {
                "data" : {
                    "from" : gup("data_inicio")
                        }
                    }
                }
        filters.push(data_inicio_filter);
        $("input#data_inicio").val(gup("data_inicio").replace(/%2F/g,"/"));
    }
    
    if (gup("data_fim")) {
        var data_fim_filter = {
            "range" : {
                "data" : {
                    "to" : gup("data_fim")
                        }
                    }
                }
        filters.push(data_fim_filter);
        $("input#data_fim").val(gup("data_fim").replace(/%2F/g,"/"));
    }
    
    if (filters.length >= 1) {
        q.query.filtered.filter = normalizeFilters(filters);
    }
    
    
    return q
}

function render(q, template) {
    url = montaUrl(my.base_url, t[template].query(q));
    $.getJSON(url, function(raw_data) {
            data = t[template].render(raw_data);
            if (data.toString() != "[object Object]") {
                $.each(data, function(key, item) {
                    rendered = ich[template+"CanHaz"](item);
                    $("#"+template).append(rendered);
                });
            }
            else {
                rendered = ich[template+"CanHaz"](data);
                $("#"+template).append(rendered);
            }
    });
    return 'ok'
}
