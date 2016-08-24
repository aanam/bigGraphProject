//HR Analytics

//what kinds of people (which competencies) are in the db
match (n:Person)-[:HAS_COMPETENCY]->(co:Competency)
return co.name, count(n)
order by count(n) desc;

//Find a carpenter that has a skill in java programming and some other skills
match (p:Person)-[:HAS_COMPETENCY]->(c2:Competency {name:"Carpenter"}),
(p)-[:HAS_COMPETENCY]->(c3:Competency {name:"Java Programming"}),
(p)-[:HAS_COMPETENCY]->(c4:Competency)
return p.first_name, p.last_name, collect(c4.name);

//find the persons that have the same competencies, work/have worked at the same companies
match (p1:Person)-[:HAS_COMPETENCY]->(c:Competency)<-[:HAS_COMPETENCY]-(p2:Person),
(p1)-->(co:Company)<--(p2)
return p1.first_name+' '+p1.last_name as Person1, p2.first_name+' '+p2.last_name as Person2, collect(distinct c.name), collect(distinct co.name) as Company
limit 50;

//find how many people with same competencies have worked at same company
match (p1:Person)-[:HAS_COMPETENCY]->(c:Competency)<-[:HAS_COMPETENCY]-(p2:Person),
(p1)-[:WORKED_FOR|:WORKS_FOR]->(co:Company)<-[:WORKED_FOR]-(p2)
return co.name as Company, c.name as Competency, count(p2) as Count
order by Count desc
limit 10;


//look at the social ties
match (n:Person)-[r:FRIEND_OF]-(m:Person)
return n,r,m
limit 50;

//find the paths from Mike outward
match p=(n:Person {first_name:"Mike"})-[:FRIEND_OF*..2]-(m:Person)
return p;

//Graph Theory: degree centrality
match (n:Person)-[r:FRIEND_OF]-(m:Person)
return n.first_name, n.last_name, count(r) as DegreeScore
order by DegreeScore desc
limit 10;

//Graph Theory: betweenness centrality
MATCH p=allShortestPaths((source:Person)-[:FRIEND_OF*]-(target:Person))
WHERE id(source) < id(target) and length(p) > 1
UNWIND nodes(p)[1..-1] as n
RETURN n.first_name, n.last_name, count(*) as betweenness
ORDER BY betweenness DESC

//Graph Theory: finding potential triadic closures
MATCH path1=(p1:Person)-[:FRIEND_OF*2..2]-(p2:Person)
where not((p1)-[:FRIEND_OF]-(p2))
return path1
limit 50;

//Graph Theory: calculate the pagerank
UNWIND range(1,10) AS round
MATCH (n:Person)
WHERE rand() < 0.1 // 10% probability
MATCH (n:Person)-[:FRIEND_OF*..10]->(m:Person)
SET m.rank = coalesce(m.rank,0) + 1;

//Show the PageRank
match (n:Person)
where n.rank is not null
return n.last_name, n.rank
order by n.rank desc;

//remove the rank
match (n:Person) 
remove n.rank;

//Graph Global: find the persons that have the same competencies, have worked at the same companies, are currently not working together, and are foaf
match (p1:Person)-[:HAS_COMPETENCY]->(c:Competency)<-[:HAS_COMPETENCY]-(p2:Person),
(p1)-[:WORKED_FOR|:WORKS_FOR]->(co:Company)<-[:WORKED_FOR]-(p2)
where not((p1)-[:WORKS_FOR]->(co)<-[:WORKS_FOR]-(p2))
with p1,p2,c,co
match (p1)-[:FRIEND_OF*2..2]-(p2)
return p1.first_name+' '+p1.last_name as Person1, p2.first_name+' '+p2.last_name as Person2, collect(distinct c.name), collect(distinct co.name) as Company
limit 10;

//Graph Local: find foaf of MIKE that have the same competencies, have worked at the same companies, are currently not working together
match (p1:Person {first_name:"Mike"})-[:HAS_COMPETENCY]->(c:Competency)<-[:HAS_COMPETENCY]-(p2:Person),
(p1)-[:WORKED_FOR|:WORKS_FOR]->(co:Company)<-[:WORKED_FOR]-(p2)
where not((p1)-[:WORKS_FOR]->(co)<-[:WORKS_FOR]-(p2))
with p1,p2,c,co
match (p1)-[:FRIEND_OF*2..2]-(p2)
return p1.first_name+' '+p1.last_name as Person1, p2.first_name+' '+p2.last_name as Person2, collect(distinct c.name), collect(distinct co.name) as Company;


//Illustrating graph locality
match (co:Competency {name:"Carpenter"})
return co;

//let's add 100000 people that are Carpenters
begin
match (co:Competency {name:"Carpenter"})
with range(100001,200000) as RANGE, co
foreach (r in RANGE | create (p:Person:Demo {id:r})-[:HAS_COMPETENCY]->(co))
return "Success!";

//run the same query
//find foaf of MIKE that have the same competencies, have worked at the same companies, are currently not working together
match (p1:Person {first_name:"Mike"})-[:HAS_COMPETENCY]->(c:Competency)<-[:HAS_COMPETENCY]-(p2:Person),
(p1)-[:WORKED_FOR|:WORKS_FOR]->(co:Company)<-[:WORKED_FOR]-(p2)
where not((p1)-[:WORKS_FOR]->(co)<-[:WORKS_FOR]-(p2))
with p1,p2,c,co
match (p1)-[:FRIEND_OF*2..2]-(p2)
return p1.first_name+' '+p1.last_name as Person1, p2.first_name+' '+p2.last_name as Person2, collect(distinct c.name), collect(distinct co.name) as Company;

//and rollback the transaction
rollback;


//OTHER RECOMMENDATIONS
//find the people already owning Apple products
match (p:Person)-[b:BOUGHT]->(prod1:Product)-[:MADE_BY]->(br:Brand {name:"Apple"})
return p.first_name+' '+p.last_name as Person, collect(prod1.name) as OwnedProducts
order by Person ASC;

//find what kinds of people by Apple products
match (p:Person)-[b:BOUGHT]->(prod1:Product)-[:MADE_BY]->(br:Brand {name:"Apple"})
with distinct p
match (p)-[:HAS_COMPETENCY]->(co:Competency)
return co.name, count(p)
order by count(p) desc;
