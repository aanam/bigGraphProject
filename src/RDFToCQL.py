import re
import datetime
fin_schema = "/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank_dump_schema.txt"
fin_data = "/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank_dump.nt"
fout_cql = "/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank_dump.cql"

nt_schema = []
source = []

count = 0
time1 = datetime.datetime.now()

with open(fin_schema,'r') as f1:
    for line in f1:
        nt_schema.append(eval(line))

with open(fin_data, 'r') as f2:
    data = f2.readlines()

f3 = open(fout_cql, 'w')

for dict in nt_schema:
    source.append(dict['source'])
    if 'type_node' in dict.keys():
        node_query = "CREATE (:"+dict["type_node"]+"{source:'"+dict["source"]+"'})"

        #print node_query
        f3.write(node_query)
        f3.write("\n")
        f3.write("WITH 1 as dummy")
        f3.write("\n")

time2 = datetime.datetime.now()  # waited a few minutes before pressing enter
elapsedTime = time2 - time1
print 'Node cql time: ', divmod(elapsedTime.total_seconds(), 60)[0], 'min(s)', \
    divmod(elapsedTime.total_seconds(), 60)[1], 'sec(s)'

for line in data:
    triple = line.split('>')
    sub = triple[0].replace("<", "").strip()
    pre = triple[1].replace("<", "").strip()
    obj = triple[2].replace("<", "").strip()

    if sub in source:
        sub_indx = source.index(sub)
        sub_cql = "s:"+nt_schema[sub_indx]['type_node']+"{source:"+"'"+source[sub_indx]+"'}"

    if pre in source:
        try:
            pre_indx = [i for i, x in enumerate(source) if x == pre][-1]
            pre_cql = "r:" + nt_schema[pre_indx]['type_rel'] + "{source:" + "'" + source[pre_indx] + "'}"
        except:
            print line
    else:
        print pre, "here"


    if obj in source:
        obj_indx = source.index(obj)
        obj_cql = "o:" + nt_schema[obj_indx]['type_node'] + "{source:" + "'" + source[obj_indx] + "'}"
        edge_query = "MATCH ("+sub_cql+"),("+obj_cql+") MERGE(s)-["+pre_cql+"]-(o)"
    else:
        obj_cql = re.sub('\ .$', '', obj)
        attr_type = nt_schema[pre_indx]['type_rel']
        edge_query = "MATCH ("+sub_cql+") SET s."+attr_type+"="+obj_cql

    #print edge_query
    f3.write(edge_query)
    f3.write("\n")
    f3.write("WITH 1 as dummy")
    f3.write("\n")

    count = count + 1
    if count % 1000 == 0:
        print count

        time3 = datetime.datetime.now()  # waited a few minutes before pressing enter
        elapsedTime = time3 - time1
        print divmod(elapsedTime.total_seconds(), 60)

total_time = datetime.datetime.now()  # waited a few minutes before pressing enter
elapsedTime = total_time - time1
print 'Edge cql time: ', divmod(elapsedTime.total_seconds(), 60)[0], 'min(s)', \
    divmod(elapsedTime.total_seconds(), 60)[1], 'sec(s)'




