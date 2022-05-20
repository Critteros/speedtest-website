Intro i architektura

Celem projektu jest stworzenie testera prędkości internetu pomiędzy klientem (przeglądarką) a sewerem, na którym zainstalowany jest backend projektu. Backend serwuje plik/pliki, po stronie klienta wizualizowany jest pomiar oraz pokazywane jest podsumowanie.
Wejście na stronę powinno uruchomić automatycznie pomiar prędkości ściągania. Po wykonaniu pomiaru ściągania, powinien się uruchomić pomiar wysyłu. Dobrą inspiracją może być serwis fast.com.

Wymagania

Frontend

react
typescript
licznik postępu (gague)
storybook per każdy komponent, który jest rysowany w UI (np. gauge)
webpack
testy jednostkowe
podsumowanie pomiarów
zachęcająca grafika/kompozycja/wygląd aplikacji


Backend

w pierwszej wersji wystarczy zmierzyć pomiar prędkości ściągania statycznego pliku, który znajduje się na serwerze (wystarczy plik nginxem lub jakimkolwiek serwerem aplikacji serwować)
(z gwiazdką) w drugiej wersji można pokusić się o zrobienie wielu równoległych połączeń przez websocket i przesyłanie wielu kawałków jednocześnie, tak by maksymalnie "wysycić" łącze (tutaj może się przydać node albo Python3 i asyncio)


Co będzie brane pod uwagę:

Przede wszystkim proces powstawania projektu
Funkcjonalność
Wykorzystanie nowych standardów javascript
Wykorzystanie Typescripta
Wykorzystanie Reacta - podział na komponenty, wykorzystanie state, state management
Testy - kilka testów jednostkowych, sprawdzających poprawność komponentów oraz logiki aplikacji frontowej
Style nie są aż tak ważne jak pozostałe punkty, nie poświęcaj zbyt dużo czasu na ostylowanie jakiegoś elementu
Czytelne README.md wyjaśniające co robi projekt i jak go uruchomić - po angielsku
Commity oraz cały kod po angielsku
