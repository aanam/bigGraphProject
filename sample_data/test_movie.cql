CREATE (:vincent_donofrio{source:'http://www.w3.org/2002/07/vincent_donofrio'})
WITH 1 as dummy
CREATE (:law_order_criminal_intent{source:'http://www.w3.org/2002/07/law_order_criminal_intent'})
WITH 1 as dummy
CREATE (:the_thirteenth_floor{source:'http://www.w3.org/2002/07/the_thirteenth_floor'})
WITH 1 as dummy
CREATE (:movie{source:'http://www.w3.org/2002/07/movie'})
WITH 1 as dummy
CREATE (:tv_show{source:'http://www.w3.org/2002/07/tv_show'})
WITH 1 as dummy
CREATE (:chris_noth{source:'http://www.w3.org/2002/07/chris_noth'})
WITH 1 as dummy
CREATE (:the_matrix{source:'http://www.w3.org/2002/07/the_matrix'})
WITH 1 as dummy
CREATE (:sex_and_the_city{source:'http://www.w3.org/2002/07/sex_and_the_city'})
WITH 1 as dummy
MATCH (s:vincent_donofrio{source:'http://www.w3.org/2002/07/vincent_donofrio'}),(o:law_order_criminal_intent{source:'http://www.w3.org/2002/07/law_order_criminal_intent'}) MERGE(s)-[r:starred_in{source:'http://www.example.org/starred_in'}]-(o)
WITH 1 as dummy
MATCH (s:the_thirteenth_floor{source:'http://www.w3.org/2002/07/the_thirteenth_floor'}),(o:movie{source:'http://www.w3.org/2002/07/movie'}) MERGE(s)-[r:is_a{source:'http://www.example.org/is_a'}]-(o)
WITH 1 as dummy
MATCH (s:law_order_criminal_intent{source:'http://www.w3.org/2002/07/law_order_criminal_intent'}),(o:tv_show{source:'http://www.w3.org/2002/07/tv_show'}) MERGE(s)-[r:is_a{source:'http://www.example.org/is_a'}]-(o)
WITH 1 as dummy
MATCH (s:vincent_donofrio{source:'http://www.w3.org/2002/07/vincent_donofrio'}),(o:the_thirteenth_floor{source:'http://www.w3.org/2002/07/the_thirteenth_floor'}) MERGE(s)-[r:starred_in{source:'http://www.example.org/starred_in'}]-(o)
WITH 1 as dummy
MATCH (s:chris_noth{source:'http://www.w3.org/2002/07/chris_noth'}),(o:law_order_criminal_intent{source:'http://www.w3.org/2002/07/law_order_criminal_intent'}) MERGE(s)-[r:starred_in{source:'http://www.example.org/starred_in'}]-(o)
WITH 1 as dummy
MATCH (s:the_thirteenth_floor{source:'http://www.w3.org/2002/07/the_thirteenth_floor'}),(o:the_matrix{source:'http://www.w3.org/2002/07/the_matrix'}) MERGE(s)-[r:similar_plot_as{source:'http://www.example.org/similar_plot_as'}]-(o)
WITH 1 as dummy
MATCH (s:sex_and_the_city{source:'http://www.w3.org/2002/07/sex_and_the_city'}),(o:tv_show{source:'http://www.w3.org/2002/07/tv_show'}) MERGE(s)-[r:is_a{source:'http://www.example.org/is_a'}]-(o)
WITH 1 as dummy
MATCH (s:the_matrix{source:'http://www.w3.org/2002/07/the_matrix'}),(o:movie{source:'http://www.w3.org/2002/07/movie'}) MERGE(s)-[r:is_a{source:'http://www.example.org/is_a'}]-(o)
WITH 1 as dummy
MATCH (s:chris_noth{source:'http://www.w3.org/2002/07/chris_noth'}),(o:sex_and_the_city{source:'http://www.w3.org/2002/07/sex_and_the_city'}) MERGE(s)-[r:starred_in{source:'http://www.example.org/starred_in'}]-(o)
WITH 1 as dummy
MATCH (s:the_thirteenth_floor{source:'http://www.w3.org/2002/07/the_thirteenth_floor'}) SET s.released_in="1999"
WITH 1 as dummy
MATCH (s:the_matrix{source:'http://www.w3.org/2002/07/the_matrix'}) SET s.released="1999"
WITH 1 as dummy
MATCH (s:vincent_donofrio{source:'http://www.w3.org/2002/07/vincent_donofrio'}) SET s.has_name=" Vicent Donofrio"

