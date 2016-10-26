import csv

fin = '/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank/createNodeDB.cql'
fin_node = '/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank/node_type_final.csv'
fout = '/Users/amritaanam/Documents/GIT_Repo/bigGraphProject/sample_data/drugbank/createNodeDBFinal.cql'

with open(fin_node, 'rU') as f1:
    reader = csv.reader(f1)
    node_type = list(reader)
f1.close

with open(fin, 'r') as f2:
    data = f2.readlines()

f2.close


with open(fout, 'w') as f3:
    for line in data:
        type = 'EXT_REF'
        if 'WITH 1 as dummy' not in line:

            line = line.split("'")
            try:
                for entry in node_type:
                    if entry[0] in line[1]:
                        type = entry[1]
                        print line[1], type
                        break

                f3.write("CREATE (:" + type + "{source:'" + line[1] + "'}")
                f3.write('\n')
                f3.write("WITH 1 as dummy")
                f3.write('\n')
            except:
                print line
