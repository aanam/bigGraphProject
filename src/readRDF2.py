import re
import datetime

fin = open('/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank_dump.nt', 'r')

data = fin.readlines()

node_list = [{}]
uri_list = []
pre_list = [{}]
property_list = []

count = 0

time1 = datetime.datetime.now()

for line in data:

    triple = line.split('>')
    sub = triple[0].replace("<", "").strip()
    pre = triple[1].replace("<", "").strip()
    obj = triple[2].replace("<", "").strip()

    old_len = len(uri_list)

    if sub not in uri_list:
        uri_list.append(sub)
        node = uri_list[-1].split("/")
        node_list.append({'type_node': node[-1], 'source': '/'.join(node)})

    if (obj.find("http") != -1) and (obj not in uri_list):
        uri_list.append(obj)
        node = uri_list[-1].split("/")
        node_list.append({'type_node': node[-1], 'source': '/'.join(node)})

    if pre not in pre_list:
        pre_list.append(pre)
        new_pre = pre_list[-1].split("/")
        property_list.append({'type_rel':new_pre[-1], 'source':'/'.join(new_pre)})

    count = count+1
    if count%1000 == 0:
        print count
        time2 = datetime.datetime.now() # waited a few minutes before pressing enter
        elapsedTime = time2 - time1
        print divmod(elapsedTime.total_seconds(), 60)


node_list = filter(None, node_list)
property_list = filter(None, property_list)

with open('/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank_dump_schema.txt', 'w') as fout:
    for node in node_list:
        fout.write(str(node))
        fout.write("\n")
    for property in property_list:
        fout.write(str(property))
        fout.write("\n")

print 'Distinct nodes:', len(node_list)
print 'Distinct edges:', len(property_list)

total_time = datetime.datetime.now()  # waited a few minutes before pressing enter
elapsedTime = total_time - time1
print divmod(elapsedTime.total_seconds(), 60)[0], "min(s)", divmod(elapsedTime.total_seconds(), 60)[1], "sec(s)"

#print len(uri_list), len(node_list), len(property_list)
#print uri_list
#print node_list
#print pre_list
#print property_list





