import datastore.client
import csv, os, datetime

#Define elasticsearch database
url = "http://127.0.0.1:9200/esfera/diariasrs2"
client = datastore.client.DataStoreClient(url)


def funkystuff(reader):
    for row in reader:
        row["Mes"] = int(row["Mes"])
        row["Exercicio"] = int(row["Exercicio"])
        row["Quantidade"] = int(row["Quantidade"])
        row["QuantidadeMeia"] = int(row["QuantidadeMeia"])
        row["Valor"] = float(row["Valor"].replace(",","."))
        try:
            row["DataInicio"] = datetime.datetime.strptime(row["DataInicio"], "%d/%M/%Y").isoformat().split("T")[0]
            row["DataFim"] = datetime.datetime.strptime(row["DataFim"], "%d/%M/%Y").isoformat().split("T")[0]
        except:
            pass
        yield row
        
def upload(client, fp, encoding=None, delimiter=','):
    
    if encoding:
        os.system("iconv -f "+ encoding + " -t utf-8 " + fp + " --output utf8-" + fp)
        fo = open("utf8-"+fp)
    else:
        fo = open(fp)
    reader = csv.DictReader(fo, delimiter=delimiter)
    
    try:
        client.delete()
        print "Delete done"
        
        client.mapping_update(
        { "properties" :
            { "Poder" : 
                { "type" : "string", "index" : "not_analyzed" },
            "Orgao" :
                { "type" : "string", "index" : "not_analyzed" },
            "UO" :
                { "type" : "string", "index" : "not_analyzed" },
            "Favorecido" :
                { "type" : "string", "index" : "not_analyzed" },
            "Destino" :
                { "type" : "string", "index" : "not_analyzed" },
            "Tipo" :
                { "type" : "string", "index" : "not_analyzed" },
            "Motivo" :
                { "type" : "string", "index" : "not_analyzed" },
            "Origem" :
                { "type" : "string", "index" : "not_analyzed" },
            "DataFim" :
                { "type" : "date", "format" : "date" },
            "DataInicio" :
                { "type" : "date", "format" : "date" }
            } 
        })
        print 'Mapping done'
        
    except "HTTP Error 404":
        print "Creating new database"

    print "Inserting rows"
    client.upsert(funkystuff(reader))
    
os.chdir("../data")
upload(client, "Diarias-RS-2012.csv", encoding="iso-8859-1", delimiter=";");
os.chdir("../scripts")
