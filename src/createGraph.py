from neo4j.v1 import GraphDatabase, basic_auth
import datetime
#fin = open('/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/test_movie.cql', 'r')
fin = open('/Users/amritaanam/Documents/drugbank/drugbank/db_c.cql', 'r')

data = fin.readlines()
print data[0]
print data[1]
data1 = filter(lambda a: a != data[1], data)
print len(data), len(data1)

driver = GraphDatabase.driver("bolt://localhost", auth=basic_auth("neo4j", "neo"))
session = driver.session()


create = 0
merge = 0
set = 0

time1 = datetime.datetime.now()

for i in range(0,10000):
    if data1[i].find("CREATE")!=-1:
        create = create+1
    if data1[i].find("MERGE")>0:
        merge = merge+1
    if data1[i].find("SET")>0:
        set = set+1

    try:
        session.run(data1[i])
        #print 'created'
    except:
        print i, data1[i]

    if i%10000==0:
        print i


print "Nodes created: ", create
print "Edges created: ", merge
print "Nodes updated: ", set

total_time = datetime.datetime.now()  # waited a few minutes before pressing enter
elapsedTime = total_time - time1

print 'Edge cql time: ', divmod(elapsedTime.total_seconds(), 60)[0], 'min(s)', \
    divmod(elapsedTime.total_seconds(), 60)[1], 'sec(s)'

'''
nodes = session.run("match (n) return count(n) AS node_count;")
edges = session.run("match (n)-[r]->() return count(r) AS edge_count;")

for r in nodes:
    print (type(r["node_count"]))


#session.close()
# session.run("CREATE (a:Person {name:'Arthur', title:'King'})")
#
#   result = session.run("MATCH (a:Person) WHERE a.name = 'Arthur' RETURN a.name AS name, a.title AS title")
#   for record in result:
#       print("%s %s" % (record["title"], record["name"]))
#
#   session.close()

'''