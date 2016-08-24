
size = 100000; 
ids = [g.addVertex().id()]; 
rand = new Random();

(1..size).each {
  v = g.addVertex();
  u = g.v(ids.get(rand.nextInt(ids.size())));
  g.addEdge(v,u,'linked');
  ids.add(u.id);
  ids.add(v.id);
  if(it % 1000 == 0)
    g.commit();
}