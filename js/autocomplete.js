$(function() {
    $("#origem" ).autocomplete({
    source: function( request, response ) {
      var wildcard = request.term.toUpperCase();
      
      var q = {
           "query": { 
                "match_all" : {}
                },
            "size" : 0,
            "facets" : {
                "origem" : {
                    "terms" : {
                        "field" : "Origem"
                        },
                "facet_filter" : {
                    "prefix" : {
                        "Origem" : wildcard
                        }
                    }
                    }
                }
            };
      
      $.ajax({
        url: my.base_url + "/_search?source=" + JSON.stringify(q),
        type: "GET",
        dataType: "json",
        success: function(dados) {
          response( $.map( dados.facets.origem.terms, function( item ) {
            return {
              label: item.term,
              id: item.term
            }
          }));
        }
      });
    },
    minLength: 2
  })
});
