import re
import datetime

fin_data = "/Users/amritaanam/Documents/bigGraphProject/bigGraphProject/sample_data/drugbank/drugbank_dump.nt"
fout_cql = "/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank/V3/drugbank_edge_9.cql"
fout_lit = "/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank/V3/drugbank_lits_9.cql"


count = 0
time1 = datetime.datetime.now()


with open(fin_data, 'r') as f2:
    data = f2.readlines()
    data = data[800000:900000]

f3 = open(fout_cql, 'w')
f4 = open(fout_lit, "w")
for line in data:
    triple = line.split('>')
    sub = triple[0].replace("<", "").strip()
    pre = triple[1].replace("<", "").strip()
    obj = (triple[2].replace("<", "").strip()).strip(" .")

    if obj != "":
        sub_cql = "(s{source:'" + sub + "'})"

        if "drugbank" in pre:
            rel_ref = "DB_REF"
        else:
            rel_ref = "EXT_REF"

        if "http" in obj:
            pre_cql = "[:" + rel_ref + "{source:'" + pre + "'}]"
            obj_cql = "(o{source:'"+obj+"'})"

            edge_query = "MATCH"+sub_cql+","+obj_cql+" CREATE (s)-"+pre_cql+"->(o)"

            f3.write(edge_query)
            f3.write("\n")
            f3.write("WITH 1 as dummy")
            f3.write("\n")

        else:
            attrib = pre.split("/")[-1]
            attrib = re.sub('[^A-Za-z0-9]+', '', attrib)

            edge_query = "MATCH"+sub_cql+" SET s."+attrib+"="+obj

            f4.write(edge_query)
            f4.write("\n")
            f4.write("WITH 1 as dummy")
            f4.write("\n")


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






