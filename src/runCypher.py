from neo4j.v1 import GraphDatabase, basic_auth

driver = GraphDatabase.driver("bolt://localhost", auth=basic_auth("neo4j", "neo"))
session = driver.session()

def connectedComponents():
    result = session.run("MATCH (n) "
                         "WITH COLLECT(n) as nodes "
                         "RETURN REDUCE(graphs = [], n in nodes | "
                         "case when "
                         "ANY (g in graphs WHERE shortestPath( (n)-[*]-(g) ) ) "
                         "then graphs "
                        "else graphs + [n] end )")


    for record in result:
        print len(record[0])
        for i in range (0, len(record[0])):
            try:
                print("%s" % (record[0][i].id))
            except:
                print 'no'



session.close()