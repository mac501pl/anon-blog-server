Serwer dla aplikacji anon-blog.

Napisany jest w języku Typescript z wykorzystaniem biblioteki express. Jest to usługa sieciowa opierająca swoje działanie na protokole HTTP. Odpowiedzi zwracane przez serwis dostępne są w formacie JSON. Jako baza danych używana jest mongodb. Endpointy opisane są w tabeli poniżej. Wszystkie endpointy z wyjątkiem pierwszego wymagają w swoim body id użytkownika, które zapisywane jest w ciasteczku w celu weryfikacji uprawnineń do wykonywania pewnych czynności (np. usuwania, modyfikacji posta/komentarza).

Testy dla aplikacji napisane są z użyciem bibilioteki jest wraz z pluginem ts-jest.

| Endpoint                                           | Metoda | Opis                                              |
|----------------------------------------------------|--------|---------------------------------------------------|
| /posts                                             | GET    | Pobierz wszystkie posty i informacje na ich temat |
| /posts/add                                         | POST   | Dodaj post                                        |
| /posts/:id/delete                                  | DELETE | Usuń post                                         |
| /posts/:id/update                                  | PUT    | Edytuj post                                       |
| /posts/:id/upvote                                  | PUT    | Dodaj łapkę w górę                                |
| /posts/:id/remove_upvote                           | PUT    | Usuń łapkę w górę                                 |
| /posts/:id/downvote                                | PUT    | Dodaj łapkę w dół                                 |
| /posts/:id/remove_downvote                         | PUT    | Usuń łapkę w dół                                  |
| /posts/:id/add_comment                             | POST   | Dodaj komentarz do postu                          |
| /posts/:postId/comments/:commentId/delete          | DELETE | Usuń komentarz                                    |
| /posts/:postId/comments/:commentId/update          | PUT    | Edytuj komentarz                                  |
| /posts/:postId/comments/:commentId/upvote          | PUT    | Dodaj komentarzowi łapkę w górę                   |
| /posts/:postId/comments/:commentId/remove_upvote   | PUT    | Usuń komentarzowi łapkę w górę                    |
| /posts/:postId/comments/:comment:Id/downvote       | PUT    | Dodaj komentarzowi łapkę w dół                    |
| /posts/:postId/comments/:commentId/remove_downvote | PUT    | Usuń komentarzowi łapkę w dół                     |