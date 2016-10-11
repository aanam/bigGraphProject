from neo4j.v1 import GraphDatabase, basic_auth
fin = open('/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/test_movie.cql', 'r')

data = fin.readlines()

print len(data)
driver = GraphDatabase.driver("bolt://localhost", auth=basic_auth("neo4j", "neo"))
session = driver.session()

session.run(data)
result = session.run("match (n) return n")
for i in result:
    print i
session.close()
# session.run("CREATE (a:Person {name:'Arthur', title:'King'})")
#
#   result = session.run("MATCH (a:Person) WHERE a.name = 'Arthur' RETURN a.name AS name, a.title AS title")
#   for record in result:
#       print("%s %s" % (record["title"], record["name"]))
#
#   session.close()