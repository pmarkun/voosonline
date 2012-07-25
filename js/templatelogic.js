t = {};

//configura query e render de um template canhaz!
t.resumo = {}
t.resumo.query = function(query) {
    query.facets = {
        //altamente ineficiente
        "passageiros" : {
            "terms" : {
                "field" : "Favorecido",
                "size" : 40000
                }
            },
        "orgao" : {
            "terms" : {
                "field" : "Orgao",
                "size" : 1
                }
            },
        "passageiro" : {
            "terms" : {
                "field" : "Favorecido",
                "size" : 1
                }
            },
        "cidade" : {
            "terms" : {
                "field" : "Destino",
                "size" : 1
                }
            }
        };
    return query;
}
t.resumo.render =  function(raw_data) {
    var data = {};
    data.passageiros = raw_data.facets.cidade.total;
    data.dias = "x";
    data.reais = "R$x";
    data.maior = {};
    data.maior.cidade = {};
    data.maior.cidade.nome = raw_data.facets.cidade.terms[0].term;
    data.maior.cidade.viagens = raw_data.facets.cidade.terms[0].count;
    data.maior.orgao = {};
    data.maior.orgao.nome = raw_data.facets.orgao.terms[0].term;
    data.maior.orgao.viagens = raw_data.facets.orgao.terms[0].count;
    data.maior.passageiro = {};
    data.maior.passageiro.nome = raw_data.facets.passageiro.terms[0].term;
    data.maior.passageiro.viagens = raw_data.facets.passageiro.terms[0].count;
    
    data.ultima = {};
    data.ultima.viagem = {};
    data.ultima.viagem.nome = raw_data.hits.hits[0]._source.Favorecido;
    data.ultima.viagem.orgao = raw_data.hits.hits[0]._source.Orgao;
    data.ultima.viagem.data = raw_data.hits.hits[0]._source.DataInicio;
    data.ultima.viagem.destino = raw_data.hits.hits[0]._source.Destino;
    data.ultima.viagem.duracao = raw_data.hits.hits[0]._source.Quantidade;
    
    return data;
}

t.viagem = {}
t.viagem.query = function(query) {
    return query;
}
t.viagem.render = function(raw_data){
    data = []
    $.each(raw_data.hits.hits, function(key, item) {
        var bit = {}
        bit.nome = item._source.Favorecido;
        bit.orgao = item._source.Orgao;
        bit.destino = item._source.Destino;
        bit.data = item._source.DataInicio;
        bit.duracao = item._source.Quantidade;
        data.push(bit);
    });
    return data;
}

