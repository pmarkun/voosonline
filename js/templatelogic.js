t = {};

//configura query e render de um template canhaz!
t.resumo = {}
t.resumo.query = function(query) {
    query.facets = {
        //altamente ineficiente
        "passageiros" : {
            "terms" : {
                "field" : "Favorecido",
                "size" : 40
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
            },
        "valor" : {
            "statistical" : {
                "field" : "Valor",
                }
            },
        "duracao" : {
            "statistical" : {
                "field" : "Quantidade",
                }
            }
        };
    return query;
}
t.resumo.render =  function(raw_data) {
    var reais = Math.round(raw_data.facets.valor.total);
    if (reais > 1000000) {
        reais = Math.round(reais/1000000).toString() + " milhões de reais";
    }
    else if (reais > 1000) {
        reais = Math.round(reais/1000).toString() + " mil reais";
    }
    
    var dias = raw_data.facets.duracao.total;
    if (dias > 365) {
        dias = Math.round(dias/365).toString() + " anos";
    }
    else {
        dias = dias.toString() + " dias";
    }
    var data = {};
    data.passageiros = raw_data.facets.cidade.total;
    data.dias = dias;
    data.reais = reais;
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
t.viagem.query = function(query, options) {
    query.size = 4;
    if (options.from) {
        query.from = options.from;
    }
    return query;
}
t.viagem.render = function(raw_data){
    data = [];
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

